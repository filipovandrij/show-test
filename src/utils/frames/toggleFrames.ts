import { Frame } from './models/Frame'

export const toggleFrames = (addFrame: (frame: Frame) => void) => {
  chrome.storage.local.get().then((storage) => {
    const ainFrames = (storage?.ainFrames ? JSON.parse(storage?.ainFrames) : {}) as {
      [k: string]: Frame
    }
    const ids = Object.keys(ainFrames)

    ids.filter((id) => !!document.getElementById(id)).length
      ? ids.forEach((id) => document.getElementById(id)?.remove())
      : ids.forEach((id) => addFrame(ainFrames[id]))
  })
}
