/* eslint-disable no-await-in-loop */
import { changeTabUrl, openTab } from '../../../utils/openTab'

const getGmailOnTab = () => {
    const containerClass = '.gb_zc'
    const gmail = document.querySelector(containerClass)?.querySelectorAll('div')[2]?.textContent || ''
    return gmail
}

export const getSessionGmails = async () => {
    let accountNumber = 0
    const allGmails: string[] = []
    const tabId = await openTab(`https://mail.google.com/mail/u/${accountNumber}/#inbox`, false)

    while (true) {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: getGmailOnTab,
      })
      if (!(allGmails.length == 0 || allGmails[0] != result)) {
        await chrome.tabs.remove(tabId)
        break
      }
      allGmails.push(result)
      accountNumber++
      await changeTabUrl(tabId, `https://mail.google.com/mail/u/${accountNumber}/#inbox`)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    return allGmails
  }