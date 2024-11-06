import { openTab } from '../openTab'

const DEFAULT_TIMEOUT = 60 * 1000
// эта функция проверяет авторизацию
export async function getAvailableGptModels(retry = 3): Promise<string[]> {
  let tabId = -1
  try {
    console.log('Opening tab...')

    tabId = await openTab('https://chat.openai.com/')

    console.log('Tab opened with ID:', tabId)

    await new Promise((resolve) => setTimeout(resolve, 5000))

    setTimeout(() => {
      console.log('Removing tab due to timeout:', tabId)
      chrome.tabs.remove(tabId)
    }, DEFAULT_TIMEOUT)

    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: executeOnTab,
      args: [tabId],
    })

    console.log('Script executed, result:', result)

    return result
  } catch (e) {
    console.log('Error occurred:', e)

    if (retry) {
      console.log('Retrying...')
      return getAvailableGptModels(retry - 1)
    }
  } finally {
    console.log('Cleaning up, removing tab:', tabId)
    chrome.tabs.remove(tabId)
  }
  return []
}
// эта функция определяет модель чата
function executeOnTab(tabId: number): Promise<string[]> {
  openIfCaptcha().catch(() => chrome.tabs.highlight({ tabs: tabId }))
  const navContainer = document.querySelector('nav[aria-label="Chat history"]')
  if (!navContainer) {
    return Promise.resolve([])
  }

  const models = {
    gpt4: 'gpt-4',
    textDavinchi: 'text-davinci-002-render-sha',
  }

  return Promise.resolve([models.gpt4, models.textDavinchi])
}
// эта функция обходит капчу
function openIfCaptcha() {
  return new Promise((res, rej) => {
    setInterval(() => {
      if (document.querySelector('.cb-i')) {
        rej()
      }
    }, 3000)
  })
}
