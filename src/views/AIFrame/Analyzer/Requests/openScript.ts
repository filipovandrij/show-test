export async function processSearchCandidate() {
  try {
    const newTab = await chrome.tabs.create({
      url: 'https://www.linkedin.com/search/results/people/',
      active: true,
    })

    const tabUpdatePromise = new Promise<void>((resolve) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === newTab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener)
          resolve()
        }
      })
    })

    await tabUpdatePromise
    if (newTab.id !== undefined) {
      await chrome.scripting.executeScript({
        target: { tabId: newTab.id },
        files: ['./static/js/messageBus.js'],
      })
    }
  } catch (error) {
    return console.error('Ошибка в collectProfile:', error)
  }
}

export async function processSalesNavigator() {
  try {
    const newTab = await chrome.tabs.create({
      url: 'https://www.linkedin.com/sales/search/people?query=(recentSearchParam%3A(doLogHistory%3Atrue)%2Cfilters%3AList((type%3AFUNCTION%2Cvalues%3AList((id%3A1%2Ctext%3AAccounting%2CselectionType%3AINCLUDED)))))&sessionId=R0%2BOisIFSOuRFNFAUL8sNA%3D%3D',
      active: true,
    })

    const tabUpdatePromise = new Promise<void>((resolve) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === newTab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener)
          resolve()
        }
      })
    })

    await tabUpdatePromise
    if (newTab.id !== undefined) {
      await chrome.scripting.executeScript({
        target: { tabId: newTab.id },
        files: ['./static/js/messageBus.js'],
      })
    }
  } catch (error) {
    return console.error('Ошибка в ', error)
  }
}
