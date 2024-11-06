export const loadNewTab = async (url: string) => {
  return new Promise((resolve) => {
    let targetTabId: any = null

    const listener = (tabId: any, changedProps: any) => {
      if (tabId != targetTabId || changedProps.status != 'complete') {
        return
      }
      chrome.tabs.onUpdated.removeListener(listener)
      resolve(tabId)
    }
    chrome.tabs.onUpdated.addListener(listener)

    chrome.tabs.create({ url, active: true }, (tab) => {
      targetTabId = tab.id
    })
  })
}
// export const loadNewTab = async (url: string) => {
//   return new Promise((resolve, reject) => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const currentTabId: any = tabs.length ? tabs[0].id : null
//       if (currentTabId === null) {
//         reject(new Error('No active tab found'))
//         return
//       }
//
//       const listener = (tabId: any, changedProps: any) => {
//         if (tabId !== currentTabId || changedProps.status !== 'complete') {
//           return
//         }
//         chrome.tabs.onUpdated.removeListener(listener)
//         resolve(tabId)
//       }
//       chrome.tabs.onUpdated.addListener(listener)
//
//       chrome.tabs.update(currentTabId, { url }, () => {
//         if (chrome.runtime.lastError) {
//           chrome.tabs.onUpdated.removeListener(listener)
//           reject(new Error(chrome.runtime.lastError.message))
//         }
//       })
//     })
//   })
// }
