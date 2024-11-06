export const getToken = () => {
  return new Promise<string | undefined>((resolve) => {
    chrome.storage.local.get(['token'], (result) => {
      resolve(result.token)
    })
  })
}
