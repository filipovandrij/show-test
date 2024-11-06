export const sendUpdateStorageSharedDataMessage = () => {
  chrome.runtime.sendMessage({
    action: 'updateStorageSharedData',
  })
}
