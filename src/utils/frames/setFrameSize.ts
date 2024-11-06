import { debounce } from '../debounce'
import { Frame } from './models/Frame'

const saveFrameSize = debounce(
  ({ width, height, frameId }: { width: number; height: number; frameId: string }) => {
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
              width,
              height,
            },
          }),
        })
    })
  },
  500
)

export const setFrameSize = ({
  width = 0,
  height = 0,
  frameId,
}: {
  width?: number
  height?: number
  frameId: string
}) => {
  const frame = document.getElementById(frameId)

  if (frame) {
    frame.style.width = `${Math.max(
      Number(frame.style.width.replaceAll(/\p{L}/gu, '') || 0) + width,
      200
    )}px`
    frame.style.height = `${Math.max(
      Number(frame.style.height.replaceAll(/\p{L}/gu, '') || 0) + height,
      200
    )}px`

    saveFrameSize({
      frameId,
      width: Number(frame.style.width.replaceAll(/\p{L}/gu, '') || 0),
      height: Number(frame.style.height.replaceAll(/\p{L}/gu, '') || 0),
    })
  }
}
