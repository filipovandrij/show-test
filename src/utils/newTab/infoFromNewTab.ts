import { loadNewTab } from './loadNewTab'
import { timer } from '../timer'
import { executeNewTab } from './executeNewTab'

export const infoFromNewTab = async (url: string, action: string) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })

  let auto

  chrome.storage.local.get().then((storage) => {
    auto = storage?.autoExecute === 'auto'
    auto && chrome.storage.local.set({ autoExecute: 'manual' })
  })

  const tabId = await loadNewTab(tabs[0].url + url)

  if (typeof tabId !== 'number') return

  await timer(5000)
  await executeNewTab(tabId as number)
  await timer(1000)

  const responseFromContent: any = await new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { action, url: tabs[0].url }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(response)
      }
    })
  })

  auto && (await chrome.storage.local.set({ autoExecute: 'auto' }))

  return responseFromContent.parsedInfo
}
