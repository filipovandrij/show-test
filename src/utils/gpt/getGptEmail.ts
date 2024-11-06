import { openTab } from '../openTab'

const DEFAULT_TIMEOUT = 60 * 1000

type EmailInfo = { email?: string; name?: string; error?: string }
export async function getGptEmail(retry = 3): Promise<EmailInfo> {
  let tabId = -1
  try {
    tabId = await openTab('https://chat.openai.com/')

    setTimeout(() => {
      chrome.tabs.remove(tabId)
    }, DEFAULT_TIMEOUT)

    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: executeOnTab,
      args: [tabId],
    })
    return result
  } catch (e) {
    if (retry) {
      return getGptEmail(retry - 1)
    }
  } finally {
    chrome.tabs.remove(tabId)
  }
  return { error: 'Error due auth' }
}

function executeOnTab(tabId: number): Promise<EmailInfo> {
  openIfCaptcha().catch(() => chrome.tabs.highlight({ tabs: tabId }))
  const xpaths = {
    topRightMenuButton:
      '/html/body/div[1]/div[1]/div[2]/main/div[1]/div[1]/div/div[1]/div/div[3]/button',
    settingsButton: '/html/body/div[6]/div/div[4]',
    builderProfile: '/html/body/div[6]/div/div/div/div[2]/div/div[1]/button[4]',
    name: '/html/body/div[6]/div/div/div/div[2]/div/div[4]/div/div/div[3]/div/div[1]/div[2]/span[1]',
    email: '/html/body/div[6]/div/div/div/div[2]/div/div[4]/div/div/div[3]/div/div[3]/div[2]/span',
  }
  const simulateUser = (min = 400, max = 800) => {
    return new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * (max - min)) + min)
    )
  }
  const createenter = () =>
    new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      which: 13,
      keyCode: 13,
      bubbles: true,
      cancelable: true,
      view: window,
    })
  const tryToGetEmail = async (): Promise<EmailInfo> => {
    simulateUser()
    const evalDoc = (path: string) => {
      return document.evaluate(path, document, null, 9, null)?.singleNodeValue
    }

    const loginButton = document.querySelector(
      'button[data-testid="login-button"]'
    ) as HTMLButtonElement
    if (loginButton) return { error: 'You need to login to ChatGPT' }
    const topRightMenuButton = evalDoc(xpaths.topRightMenuButton) as HTMLButtonElement
    if (!topRightMenuButton) {
      return { error: 'button is empty' }
    }
    topRightMenuButton.dispatchEvent(createenter())
    await simulateUser()
    ;(evalDoc(xpaths.settingsButton) as HTMLButtonElement).dispatchEvent(createenter())
    await simulateUser()
    ;(evalDoc(xpaths.builderProfile) as HTMLButtonElement).dispatchEvent(createenter())
    await simulateUser()
    const name = (evalDoc(xpaths.name) as HTMLSpanElement).innerText
    const email = (evalDoc(xpaths.email) as HTMLSpanElement).innerText
    return { email, name }
  }
  let resolve: (value: any) => void
  const promise = new Promise<EmailInfo>((res) => {
    resolve = res
  })
  setInterval(async () => {
    const res = await tryToGetEmail()
    if (!(res?.error === 'button is empty')) {
      return resolve(res)
    }
  }, 1000)

  return promise
}

function openIfCaptcha() {
  return new Promise((res, rej) => {
    setInterval(() => {
      if (document.querySelector('.cb-i')) {
        rej()
      }
    }, 3000)
  })
}
