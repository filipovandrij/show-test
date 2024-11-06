import { Frame } from './models/Frame'

export const destroyFrame = (frameId: string) => {
  document.getElementById(frameId)?.remove()
  chrome.storage.local.get().then((storage) => {
    const ainFrames = (storage?.ainFrames ? JSON.parse(storage?.ainFrames) : {}) as {
      [k: string]: Frame
    }
    delete ainFrames[frameId]
    chrome.storage.local.set({
      ainFrames: JSON.stringify(ainFrames),
    })
  })
}
