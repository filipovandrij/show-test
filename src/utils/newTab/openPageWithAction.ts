import { loadNewTab } from './loadNewTab'
import { timer } from '../timer'
import { getRandomInt } from '../getRandomInt'
import { executeNewTab } from './executeNewTab'

export const openPageWithAction = async (url: string, action: string) => {
  let auto

  chrome.storage.local.get().then((storage) => {
    auto = storage?.autoExecute === 'auto'
    auto && chrome.storage.local.set({ autoExecute: 'manual' })
  })

  const tabId = await loadNewTab(url)

  if (typeof tabId !== 'number') return

  await timer(getRandomInt(4000, 5000))
  await executeNewTab(tabId as number)
  await timer(getRandomInt(700, 1000))

  const responseFromContent: any = await new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { action, url }, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(response)
      }
    })
  })

  auto && (await chrome.storage.local.set({ autoExecute: 'auto' }))

  // await api.sendToGsheets(responseFromContent.parsedInfo);

  await timer(getRandomInt(700, 1000))
  await chrome.tabs.remove(tabId)
  return responseFromContent.parsedInfo
}
