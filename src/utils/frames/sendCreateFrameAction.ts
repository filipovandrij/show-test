import { Frame } from './models/Frame'

export const sendCreateFrameAction = (frame: Frame) => {
  chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    tab.id &&
      chrome.tabs.sendMessage(tab.id, {
        action: 'createFrame',
        meta: frame,
      })
  })
}
