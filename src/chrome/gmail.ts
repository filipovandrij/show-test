import { Frame } from '../utils/frames/models/Frame'
import { sendUpdateStorageSharedDataMessage } from '../utils/frames/sendUpdateStorageSharedDataMessage'
import { addFrame } from './addFrame'

export {}
;(() => {
  const updatePage = () => {
    const writeMessagFrames = [...document.querySelectorAll('.AD')]
    const fullScreenWriteMessagFrame = document.querySelector('.aSt') as HTMLDivElement
    const fullScreenWriteMessagFramesContainer = document.querySelector('.aSs') as HTMLDivElement
    const element =
      fullScreenWriteMessagFramesContainer?.style?.visibility === 'hidden'
        ? writeMessagFrames[0]
        : fullScreenWriteMessagFrame
    const ainEmail =
      writeMessagFrames.length !== 1
        ? ''
        : [...element.querySelectorAll('span')]
            .find((s) => s.hasAttribute('email'))
            ?.getAttribute('email') || ''

    chrome.storage.local
      .set({
        ainEmail,
      })
      .then(() => {
        sendUpdateStorageSharedDataMessage()
        chrome.storage.local.get().then((storage) => {
          const ainFrames = (storage?.ainFrames ? JSON.parse(storage?.ainFrames) : {}) as {
            [k: string]: Frame
          }
          const framesToggleMode = storage?.framesToggleMode as string | undefined
          framesToggleMode === 'auto' &&
            Object.keys(ainFrames).forEach((id) => {
              ainEmail ? addFrame(ainFrames[id]) : document.getElementById(id)?.remove()
            })
        })
      })
  }
  setTimeout(() => updatePage(), 150)
  if (document.body.getAttribute('gmail-script')) return
  document.body.setAttribute('gmail-script', 'gmail-script')

  const listener = () => {
    updatePage()
  }

  document.addEventListener('click', listener)
})()
