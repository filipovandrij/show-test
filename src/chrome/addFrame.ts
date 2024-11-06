import { createFrame } from '../utils/frames/createFrame'
import { Frame } from '../utils/frames/models/Frame'

const framesManager = () => {
  const queue: string[] = []
  const framesMeta: { [k: string]: Frame } = {}
  let processing = false

  const evaluateQueue = () => {
    if (processing || !queue.length) return
    processing = true
    const frameId = queue.shift()!
    createFrame(framesMeta[frameId]).then(() => {
      delete framesMeta[frameId]
      processing = false
      evaluateQueue()
    })
  }

  const addFrame = (frame: Frame) => {
    queue.push(frame.id)
    framesMeta[frame.id] = frame
    evaluateQueue()
  }

  return addFrame
}

export const addFrame = framesManager()
