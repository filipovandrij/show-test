export const sendUpdateStorageSharedDataAction = () => {
  chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    tab.id &&
      chrome.tabs.sendMessage(tab.id, {
        action: 'updateStorageSharedData',
      })
  })
}
