export const setBaseUrl = (url: string): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ baseUrl: url }, () => {
      resolve()
    })
  })
}

export const getBaseUrl = (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(['baseUrl'], (result) => {
      resolve(result.baseUrl)
    })
  })
}
