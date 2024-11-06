export const setToken = (token: string | null): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ token }, () => {
      resolve()
    })
  })
}
