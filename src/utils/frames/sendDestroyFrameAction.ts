export const sendDestroyFrameAction = (frameId: string) => {
  chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    tab.id &&
      chrome.tabs.sendMessage(tab.id, {
        action: 'destroyFrame',
        meta: frameId,
      })
  })
}
