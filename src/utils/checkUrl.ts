export const checkUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      resolve(!!tab.url && tab.url.includes(url))
    })
  })
}
