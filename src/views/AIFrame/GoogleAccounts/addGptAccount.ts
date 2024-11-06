import axios from 'axios'
import { getBaseUrl } from '../../../api/baseUrl'
import { getToken } from '../../../api/getToken'
import { openTab } from '../../../utils/openTab'

export async function getLinkGptAccount(retry = 3): Promise<any> {
  let tabId = -1
  try {
    tabId = await openTab('https://chatgpt.com/#settings/BuilderProfile', false)

    setTimeout(() => {
      chrome.tabs.remove(tabId)
    }, 60000)

    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: executeOnTab,
    })
    return result
  } catch (e) {
    if (retry) {
      return getLinkGptAccount(retry - 1)
    }
  } finally {
    chrome.tabs.remove(tabId)
  }
  return []
}

function executeOnTab() {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = ''
      const contentElement = document.querySelector('div[role="dialog"]')
      if (contentElement) {
        const content = contentElement.textContent || ''
        const emailMatch = content.match(/Email([\s\S]*?)Receive/)

        if (emailMatch && emailMatch[1]) {
          const email = emailMatch[1].trim()
          result = email
        } else {
          console.log("Failed to find the email between 'Email' and 'Receive'.")
        }
      } else {
        console.log("Element with role='dialog' not found.")
      }

      resolve(result)
    }, 10000)
  })
}

const fetchGptList = async () => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()
  const url = `${baseUrl}/api/constructor/planner/settings/`

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    console.log('list:', response.data)
    return response.data
  } catch (error: any) {
    console.error('An error occurred:', error)
  }
}

export const chekActiveGptAcc = async () => {
  try {
    const gptAccMail = await getLinkGptAccount()
    const allList = await fetchGptList()

    if (!Array.isArray(allList)) {
      throw new Error('fetchGptList did not return an array')
    }

    const updatedList = allList.map((account: any) => ({
      account_id: account.account_id,
      account_status: account.account_id === gptAccMail ? 'active' : 'inactive',
    }))

    console.log('updatedList', updatedList)

    chrome.storage.local.set({ accGpts: updatedList })

    chrome.runtime.sendMessage({ dataUpdated: true })

    return updatedList
  } catch (error) {
    console.error('Error in chekActiveGptAcc:', error)
    throw error
  }
}
