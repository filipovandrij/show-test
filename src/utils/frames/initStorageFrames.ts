import { Frame } from './models/Frame'
import { sendCreateFrameAction } from './sendCreateFrameAction'

export const initStorageFrames = () => {
  chrome.storage.local.get().then((storage) => {
    const ainFrames = (storage?.ainFrames ? JSON.parse(storage?.ainFrames) : {}) as {
      [k: string]: Frame
    }

    Object.keys(ainFrames).forEach((id) => {
      sendCreateFrameAction(ainFrames[id])
    })
  })
}
