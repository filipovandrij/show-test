import { deepEqual } from '../deepEqual'
import { Frame } from './models/Frame'
import { sendCreateFrameAction } from './sendCreateFrameAction'

export const storagePutFrame = <T extends object = any>({
  id,
  title,
  height = 300,
  left = 0,
  top = 0,
  width = 300,
  meta,
}: Frame<T>) => {
  chrome.storage.local.get().then((storage) => {
    const ainFrames = (storage?.ainFrames ? JSON.parse(storage?.ainFrames) : {}) as {
      [k: string]: Frame
    }
    const savedFrameConfig = ainFrames[id] as Frame<T> | undefined
    const needUpdate = !savedFrameConfig || !deepEqual(savedFrameConfig?.meta, meta)

    const frameConfig = {
      id,
      title,
      height,
      left,
      top,
      width,
      ...savedFrameConfig,
      meta,
    } satisfies Frame<T>

    needUpdate &&
      chrome.storage.local
        .set({
          ainFrames: JSON.stringify({ ...ainFrames, [id]: frameConfig }),
        })
        .then(() =>
          savedFrameConfig
            ? chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
                tab.id &&
                  chrome.tabs.sendMessage(tab.id, {
                    action: 'storagePutFrame',
                    meta: id,
                  })
              })
            : sendCreateFrameAction(frameConfig)
        )
  })
}
