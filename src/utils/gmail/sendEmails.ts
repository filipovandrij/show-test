import { openTab, changeTabUrl } from '../openTab'

let tabId = -1
let numberGmail = 0

export async function openGmail(): Promise<number> {
  // if (tabId === -1) tabId = await openTab('https://mail.google.com/mail/u/2/#inbox')
  if (tabId === -1) tabId = await openTab('https://mail.google.com/mail/u/0/#inbox')
  numberGmail = 0
  function closeTab(id: number) {
    if (id === tabId) {
      tabId === -1
      numberGmail = 0
      chrome.tabs.onRemoved.removeListener(closeTab)
    }
  }
  chrome.tabs.onRemoved.addListener(closeTab)

  await new Promise((resolve) => setTimeout(resolve, 10000))
  return tabId
}

export async function openNumberGmail(num: number): Promise<number> {
  if (numberGmail === num) return num
  await changeTabUrl(tabId, `https://mail.google.com/mail/u/${num}/#inbox`)
  numberGmail = num
  return num
}

export async function highlightGmail(time = 1.5 * 1000) {
  const [currentTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
  chrome.tabs.get(tabId, (tab) => {
    chrome.tabs.highlight({ tabs: tab.index })
  })
  setTimeout(() => {
    if (currentTab) chrome.tabs.highlight({ tabs: currentTab.index })
  }, time)
}

export async function getEmail(): Promise<string | undefined> {
  console.log('getEmail')
  console.log('getEmail', tabId)
  const [{ result: email }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: getCurrentEmail,
  })
  console.log('result email', email)
  return email
}

export async function sendMail(mail: Mail): Promise<string | null> {
  console.log('sendMail')
  console.log('sendMail', tabId)
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: sendMailScript,
    args: [mail],
  })
  console.log('result send mail', result)
  return result
}

type Mail = {
  guid: string
  date_time?: Date
  sender_email: string
  email_content: string
  email_subject: string
  recepient_email: string
}
async function sendMailScript(mail: Mail) {
  console.log('sendMailScript')

  const selectors = {
    write: '.T-I.T-I-KE.L3',
    recipient: '.agP.aFw',
    subject: '.aoT',
    content: '.editable',
    sendNow: '.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3',
    messageSendContainer: '.AD',
    sendDateArrow: '.T-I.J-J5-Ji.hG.T-I-atl.L3',
    scheduleSendPicker: '.J-N.yr',
    pickDateAndTime: '.Az.AM',
    dateInput: 'input[aria-label*="Date"]',
    timeInput: 'input[aria-label*="Time"]',
    scheduleSend: '.J-at1-auR',
  }
  const simulateUser = (min = 400, max = 800) => {
    return new Promise((resolve) =>
      setTimeout(resolve, Math.floor(Math.random() * (max - min)) + min)
    )
  }
  const createMouseEvent = (name: string) =>
    new MouseEvent(name, {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  async function getElementBySelector(selector: string): Promise<HTMLElement> {
    const res = window.document.querySelector(selector) as HTMLElement
    console.log('res1', res)
    if (res) return res

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.log(`Error due getting selector: ${selector}`)
        clearTimeout(timeout)
        clearInterval(interval)
        reject(`Error due getting selector: ${selector}`)
      }, 30000)
      const interval = setInterval(() => {
        const res = window.document.querySelector(selector) as HTMLElement
        if (res) {
          clearTimeout(timeout)
          clearInterval(interval)
          resolve(res)
        }
      }, 1000)
    })
  }
  await simulateUser()
  ;(await getElementBySelector(selectors.write)).click()
  await simulateUser(1000, 1500)
  ;((await getElementBySelector(selectors.recipient)) as HTMLInputElement).value =
    mail.recepient_email
  await simulateUser()
  ;((await getElementBySelector(selectors.subject)) as HTMLInputElement).value = mail.email_subject
  await simulateUser()
  ;((await getElementBySelector(selectors.content)) as HTMLInputElement).innerText =
    mail.email_content
  await simulateUser()
  if (!mail.date_time) {
    ;(await getElementBySelector(selectors.sendNow)).click()
  } else {
    await getElementBySelector(selectors.sendDateArrow)
    await simulateUser()
    const sendPicker = await getElementBySelector(selectors.scheduleSendPicker)
    sendPicker.dispatchEvent(createMouseEvent('mousedown'))
    await simulateUser(50, 150)
    sendPicker.dispatchEvent(createMouseEvent('mouseup'))
    await simulateUser(50, 150)
    sendPicker.dispatchEvent(createMouseEvent('mouseup'))
    await simulateUser()
    ;(await getElementBySelector(selectors.pickDateAndTime)).click()
    await simulateUser()
    const datearr = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'long',
    })
      .format(new Date(mail.date_time))
      .split(' ')
    ;(
      (await getElementBySelector(selectors.dateInput)) as HTMLInputElement
    ).value = `${datearr[1]} ${datearr[2]} ${datearr[3]}`
    await simulateUser()
    ;(
      (await getElementBySelector(selectors.timeInput)) as HTMLInputElement
    ).value = `${datearr[5]} ${datearr[6]}`
    await simulateUser()
    ;((await getElementBySelector(selectors.scheduleSend)) as HTMLButtonElement).click()
  }

  await simulateUser(2000, 2500)
  if (!(await window.document.querySelector(selectors.messageSendContainer))) {
    console.log('message sent successfully')
    await simulateUser()
    return 'message sent successfully'
  }
  return 'message sent successfully'
}

export async function closeGmail() {
  if (tabId > -1) {
    await chrome.tabs.remove(tabId, () => {
      tabId = -1
    })
    tabId = -1
    numberGmail = 0
  }
}

async function getCurrentEmail() {
  return new Promise<string | undefined>((resolve, reject) => {
    const selectors = {
      rightTopEmail: '.gb_d.gb_Ja.gb_K',
    }
    const simulateUser = (min = 400, max = 800) => {
      return new Promise((resolve) =>
        setTimeout(resolve, Math.floor(Math.random() * (max - min)) + min)
      )
    }
    async function getElementBySelector(selector: string): Promise<HTMLElement> {
      const res = window.document.querySelector(selector) as HTMLElement
      if (res) return res

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          clearTimeout(timeout)
          clearInterval(interval)
          reject(new Error(`Error due getting selector: ${selector}`))
        }, 30000)
        const interval = setInterval(() => {
          const res = window.document.querySelector(selector) as HTMLElement
          if (res) {
            clearTimeout(timeout)
            clearInterval(interval)
            resolve(res)
          }
        }, 1000)
      })
    }
    const getEmail = async () => {
      await simulateUser(1000, 1500)
      const res = await getElementBySelector(selectors.rightTopEmail)
      const mail = res?.ariaLabel?.match(/\((.+?)\)$/)?.[1]
      return mail
    }

    getEmail().then(resolve).catch(reject)
  })
}
