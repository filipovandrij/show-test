export async function openTab(url: string, active = true): Promise<number> {
  const newTab: any = await chrome.tabs.create({ url, active })
  await waitTabLoading(newTab.id)
  return newTab.id
}

export async function changeTabUrl(tabId: number, newUrl: string): Promise<number> {
  chrome.tabs.update(tabId, { url: newUrl })
  await waitTabLoading(tabId)
  return tabId
}

function waitTabLoading(loadingTabId: number) {
  return new Promise<void>((resolve) => {
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      if (tabId === loadingTabId && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener)
        resolve()
      }
    })
  })
}
