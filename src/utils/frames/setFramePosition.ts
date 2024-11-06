import { debounce } from '../debounce'
import { Frame } from './models/Frame'

const saveFramePosition = debounce(
  ({ top, left, frameId }: { top: number; left: number; frameId: string }) => {
    chrome.storage.local.get().then((storage) => {
      const ainFrames = (storage?.ainFrames ? JSON.parse(storage?.ainFrames) : {}) as {
        [k: string]: Frame
      }

      ainFrames[frameId] &&
        chrome.storage.local.set({
          ainFrames: JSON.stringify({
            ...ainFrames,
            [frameId]: {
              ...ainFrames[frameId],
              top,
              left,
            },
          }),
        })
    })
  },
  500
)

export const setFramePosition = ({
  top = 0,
  left = 0,
  frameId,
}: {
  top: number
  left: number
  frameId: string
}) => {
  const frame = document.getElementById(frameId)

  if (frame) {
    frame.style.top = `${Number(frame.style.top.replaceAll(/\p{L}/gu, '') || 0) + top}px`
    frame.style.left = `${Number(frame.style.left.replaceAll(/\p{L}/gu, '') || 0) + left}px`

    saveFramePosition({
      frameId,
      top: Number(frame.style.top.replaceAll(/\p{L}/gu, '') || 0),
      left: Number(frame.style.left.replaceAll(/\p{L}/gu, '') || 0),
    })
  }
}
