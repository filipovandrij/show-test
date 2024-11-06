import { openTab } from '../openTab'

// Here lies the entire sequential processing of the prompt. Initially, a chat tab is opened, followed by a check for working hours, which are set by default in the settings unless adjusted by the user. If the conditions are met, processing begins with the injection of a modal window that displays logs through messages saved in local storage. Subsequently, we locate the field where the prompt question can be entered. Next, we find the button that needs to be pressed to send the question to the chat. The chat then begins to respond, and a function triggers that determines when the chat has replied and checks whether the generate continuation button needs to be pressed. Once the function observes no more changes, it determines the response, records it in the format we want to receive—whether as JSON or text—and then saves it. After processing all prompts, the function closes the window and clears all messages from local storage.

// эта функция достает настройки промпта

const getSettings = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['settings'], (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
      } else if (result.settings) {
        resolve(JSON.parse(result.settings))
      } else {
        const defaultSettings = {
          startTime: '04:00',
          endTime: '23:00',
          dontCloseWindow: false,
          dontShowOverlay: false,
          dontDisplayLogs: false,
          recordLogs: false,
          breakFrequency: 50,
          breakDuration: 10,
          pauseBetweenMessages: 10000,
        }
        chrome.storage.local.set({ settings: JSON.stringify(defaultSettings) }, () => {
          if (chrome.runtime.lastError) {
            reject(
              new Error(`Error saving settings to chrome.storage.local:${chrome.runtime.lastError}`)
            )
          } else {
            console.log('Default settings saved to chrome.storage.local:', defaultSettings)
            resolve(defaultSettings)
          }
        })
      }
    })
  })
}
// эта функция сохраняет сообщения в локальное хранилище

const saveMessages = (messages: any) => {
  chrome.storage.local.set({ userMessages: messages }, () => {
    if (chrome.runtime.lastError) {
      console.error('Ошибка при сохранении сообщений:', chrome.runtime.lastError)
    } else {
      console.log('Сообщения успешно сохранены')
      chrome.runtime.sendMessage({ action: 'messagesUpdated' })
    }
  })
}
// это функция добавляет сообщения в локальное хранилище

const addMessage = (newMessage: any) => {
  chrome.storage.local.get(['userMessages'], (result) => {
    const currentMessages = result.userMessages || []
    const messageObject = {
      date: new Date().toISOString(),
      message: newMessage,
    }
    const updatedMessages = [...currentMessages, messageObject]
    saveMessages(updatedMessages)
  })
}
// эта функция удаляет сообщения из локального хранилища

const deleteMessages = () => {
  chrome.storage.local.remove('userMessages', () => {
    if (chrome.runtime.lastError) {
      console.error('Ошибка при удалении сообщений:', chrome.runtime.lastError)
    } else {
      console.log('Сообщения успешно удалены')

      chrome.runtime.sendMessage({ action: 'messagesUpdated' })
    }
  })
}
// эта функция инжектирует скрипт и открывает и закрывает вкадку с чатом ИИ

export async function createGptTab(permalink: string) {
  const tabId = await openTab(permalink)

  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['./static/js/messageBus.js'],
  })

  chrome.tabs.sendMessage(Number(tabId), { action: 'customDataModal' })
  return {
    askGpt: async (
      question: string,
      shouldDelete: boolean = false,
      shouldRename: string | null = null,
      agentName: string | null = null,
      requiredAnswerFormat: string,
      prompt_id: number
    ) => {
      addMessage(`Запущена обработка промпта ИД-${prompt_id}. Промпт поступил в очередь`)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      addMessage('Начало обработки.')
      const AllSettings: any = await getSettings()

      const startTime = AllSettings.startTime || '09:00'
      const endTime = AllSettings.endTime || '23:00'
      const breakFrequency = AllSettings.breakFrequency || 120
      const breakDuration = AllSettings.breakDuration || 15

      const [startHours, startMinutes] = startTime.split(':').map(Number)
      const [endHours, endMinutes] = endTime.split(':').map(Number)

      const startTimeInMinutes = startHours * 60 + startMinutes
      const endTimeInMinutes = endHours * 60 + endMinutes

      function getCurrentTime() {
        const now = new Date()
        const hours = now.getHours()
        const minutes = now.getMinutes()

        const formattedHours = String(hours).padStart(2, '0')
        const formattedMinutes = String(minutes).padStart(2, '0')

        return `${formattedHours}:${formattedMinutes}`
      }

      const [currentHours, currentMinutes] = getCurrentTime().split(':').map(Number)

      const currentTimeInMinutes = currentHours * 60 + currentMinutes

      function calculateBreakIntervals(
        startTime: any,
        workDuration: any,
        breakDuration: any,
        endTime: any
      ) {
        const [startHours, startMinutes] = startTime.split(':').map(Number)
        const endMinutesOfDay = endTime
          .split(':')
          .map(Number)
          .reduce((hours: any, minutes: any) => hours * 60 + minutes)

        const intervals = []

        let currentTimeInMinutes = startHours * 60 + startMinutes

        while (currentTimeInMinutes < endMinutesOfDay) {
          const breakStart = currentTimeInMinutes + workDuration
          const breakEnd = breakStart + breakDuration

          if (breakEnd > endMinutesOfDay) break

          const formattedBreakStart = `${Math.floor(breakStart / 60)}:${String(
            breakStart % 60
          ).padStart(2, '0')}`
          const formattedBreakEnd = `${Math.floor(breakEnd / 60)}:${String(breakEnd % 60).padStart(
            2,
            '0'
          )}`

          intervals.push({ start: formattedBreakStart, end: formattedBreakEnd })

          currentTimeInMinutes = breakEnd
        }

        return intervals
      }

      const breakIntervals = calculateBreakIntervals(
        startTime,
        breakFrequency,
        breakDuration,
        endTime
      )

      function isCurrentTimeInBreak(currentTime: any, breakIntervals: any) {
        return breakIntervals.some((interval: any) => {
          const [breakStartHours, breakStartMinutes] = interval.start.split(':').map(Number)
          const [breakEndHours, breakEndMinutes] = interval.end.split(':').map(Number)

          const breakStartInMinutes = breakStartHours * 60 + breakStartMinutes
          const breakEndInMinutes = breakEndHours * 60 + breakEndMinutes

          return currentTime >= breakStartInMinutes && currentTime < breakEndInMinutes
        })
      }

      if (currentTimeInMinutes < startTimeInMinutes) {
        console.log("Apparently it's not working hours right now")
      } else if (currentTimeInMinutes < endTimeInMinutes) {
        if (isCurrentTimeInBreak(currentTimeInMinutes, breakIntervals)) {
          console.log("It's currently a break time")
        } else {
          console.log(
            `You can work until the end of work for ${
              endTimeInMinutes - currentTimeInMinutes
            } minutes`
          )
        }
      } else {
        console.log("Apparently it's not working hours right now")
        deleteMessages()
        chrome.tabs.remove(tabId)
        throw new Error("Apparently it's not working hours right now")
      }
      let result = null
      try {
        if (!question || typeof question !== 'string') {
          throw new Error('Question parameter is missing or not a string')
        }

        console.log('Executing script on tab', { tabId, question, shouldDelete, shouldRename })

        let authException = null
        chrome.tabs.onUpdated.addListener(function listener(listenTabId, changeInfo) {
          if (tabId === listenTabId && changeInfo.url?.includes('auth.openai.com/')) {
            chrome.tabs.onUpdated.removeListener(listener)
            authException = 'Please check your GPT login'
          }
        })

        const timer = setTimeout(async () => {
          const [currentTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
          chrome.tabs.get(tabId, (tab) => {
            chrome.tabs.highlight({ tabs: tab.index })
          })
          setTimeout(() => {
            if (currentTab) chrome.tabs.highlight({ tabs: currentTab.index })
          }, 3000)
        }, 360000)

        const [{ result: res }] = await chrome.scripting.executeScript({
          target: { tabId },
          func: executeOnTab,
          args: [question, shouldDelete, shouldRename, tabId, agentName, requiredAnswerFormat],
        })

        if (authException) {
          throw new Error(authException)
        }
        if (timer) clearTimeout(timer)
        result = res
      } catch (e: any) {
        throw new Error(e.message)
      }
      if (result?.error || !result?.chatId || !result?.answer) {
        throw new Error(result?.error)
      }

      return { answer: result.answer, chatId: result.chatId }
    },
    removeTab: () => chrome.tabs.remove(tabId),
  }
}
// эта функция обрабатывает промпты

async function executeOnTab(
  question: string,
  shouldDelete: boolean,
  shouldRename: string | null,
  tabId: number,
  agentName: string | null,
  requiredAnswerFormat: string
): Promise<{ answer?: string; chatId?: string; error?: string }> {
  return new Promise((resolve) => {
    try {
      removeIfUnable().catch((message: string) => resolve({ error: message }))
      openIfCaptcha().catch(() => chrome.tabs.highlight({ tabs: tabId }))
      const [timeoutPromise, refreshTimeout] = removeIfTimeout()
      timeoutPromise.catch((message: string) => resolve({ error: message }))

      const saveMessages = (messages: any) => {
        chrome.storage.local.set({ userMessages: messages }, () => {
          if (chrome.runtime.lastError) {
            console.error('Ошибка при сохранении сообщений:', chrome.runtime.lastError)
          } else {
            console.log('Сообщения успешно сохранены')
            chrome.runtime.sendMessage({ action: 'messagesUpdated' })
          }
        })
      }

      const addMessage = (newMessage: any) => {
        chrome.storage.local.get(['userMessages'], (result) => {
          const currentMessages = result.userMessages || []
          const messageObject = {
            date: new Date().toISOString(),
            message: newMessage,
          }
          const updatedMessages = [...currentMessages, messageObject]
          saveMessages(updatedMessages)
        })
      }

      const run = async () => {
        const getSettings = async () => {
          return new Promise((resolve, reject) => {
            chrome.storage.local.get(['settings'], (result) => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message))
              } else if (result.settings) {
                resolve(JSON.parse(result.settings))
              } else {
                const defaultSettings = {
                  startTime: '04:00',
                  endTime: '23:00',
                  dontCloseWindow: false,
                  dontShowOverlay: false,
                  dontDisplayLogs: false,
                  recordLogs: false,
                  breakFrequency: 50,
                  breakDuration: 10,
                  pauseBetweenMessages: 10000,
                }
                chrome.storage.local.set({ settings: JSON.stringify(defaultSettings) }, () => {
                  if (chrome.runtime.lastError) {
                    reject(
                      new Error(
                        `Error saving settings to chrome.storage.local:${chrome.runtime.lastError}`
                      )
                    )
                  } else {
                    console.log('Default settings saved to chrome.storage.local:', defaultSettings)
                    resolve(defaultSettings)
                  }
                })
              }
            })
          })
        }
        const AllSettings: any = await getSettings()
        console.log('Waiting for the page to stabilize...', AllSettings)
        await new Promise((resolve) =>
          setTimeout(resolve, AllSettings.pauseBetweenMessages || 10000)
        )

        // const textarea = await getTextarea()

        const textareaSimple = await getEditableDiv()

        refreshTimeout()
        addMessage('Отсылаем вопрос')

        // await sendQuestion(textarea, question, agentName)
        await sendQuestionSimple(textareaSimple, question, agentName)

        refreshTimeout()

        const answer = await getFullAnswer(requiredAnswerFormat)
        addMessage(
          `Зафиксирован конец генерации. Анализ полученных данных, трансформация ответа в требуемый формат ${
            requiredAnswerFormat === 'json' ? 'json' : 'text'
          }`
        )

        refreshTimeout()

        const chatId = getChatId()
        console.log('Answer chatId:', chatId)

        if (shouldRename) {
          await renameChat(shouldRename)
        }
        if (shouldDelete) {
          await removeChat()
        }
        console.log('Resolving with answer and chatId')
        return resolve({ answer, chatId })
      }
      run()
    } catch (e: any) {
      console.log('Error in executeOnTab:', e.message)
      resolve({ error: e.message })
    }
  })
}
// эта функция ищет куда вставить текст

async function getEditableDiv(): Promise<HTMLElement> {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const editableDiv = document.querySelector('#prompt-textarea[contenteditable="true"]')
          if (editableDiv) {
            observer.disconnect()
            clearInterval(interval)
            resolve(editableDiv as HTMLElement)
          }
        }
      }
    })

    const interval = setInterval(() => {
      const editableDiv = document.querySelector('#prompt-textarea[contenteditable="true"]')
      if (editableDiv) {
        clearInterval(interval)
        observer.disconnect()
        resolve(editableDiv as HTMLElement)
      }
    }, 3000)

    observer.observe(document.body, { childList: true, subtree: true })
  })
}
// эта функция отправляет вопрос промпта

async function sendQuestionSimple(
  editableDiv: HTMLElement,
  question: string,
  agentName: string | null
) {
  const eventOptions = {
    bubbles: true,
    cancelable: true,
    view: window,
  }

  if (agentName) {
    editableDiv.focus()
    console.log('agent:', agentName)
    ;['keydown', 'input', 'keyup'].forEach((type) => {
      const event = new KeyboardEvent(type, {
        ...eventOptions,
        key: '@',
        code: 'Digit2',
        keyCode: 50,
        which: 50,
      })
      editableDiv.dispatchEvent(event)
    })

    await new Promise((resolve) => setTimeout(resolve, 6000))

    const agentItems = document.querySelectorAll('[tabindex]')
    let agentFound = false
    agentItems.forEach((item) => {
      if (item.textContent?.includes(agentName)) {
        console.log(`Element with text ${agentName} find:`, item)
        item.dispatchEvent(new Event('click', { ...eventOptions }))
        agentFound = true
      }
    })

    if (!agentFound) {
      console.log(`Element with text ${agentName} not found`)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  // Use innerText instead of textContent to preserve special characters like \n and \r
  editableDiv.innerText = question
  const inputEvent = new Event('input', eventOptions)
  editableDiv.dispatchEvent(inputEvent)

  await new Promise((resolve) => setTimeout(resolve, 2000))

  const sendBtn = document.querySelector('[data-testid="send-button"]') as HTMLElement
  if (sendBtn) {
    console.log('Кнопка отправки найдена, отправляем вопрос')
    sendBtn.click()
  } else {
    const interval = setInterval(() => {
      const sendBtn = document.querySelector('[data-testid="send-button"]') as HTMLElement
      if (sendBtn) {
        console.log('Кнопка отправки найдена, отправляем вопрос')
        sendBtn.click()
        clearInterval(interval)
      }
    }, 3000)
  }
}

// эта старая функция которая искала куда вставить текст

// async function getTextarea(): Promise<HTMLTextAreaElement> {
//   return new Promise((resolve) => {
//     const observer = new MutationObserver((mutations) => {
//       for (const mutation of mutations) {
//         if (mutation.type === 'childList') {
//           const textarea = document.querySelector('textarea')
//           if (textarea) {
//             observer.disconnect()
//             clearInterval(interval)
//             observer.disconnect()
//             resolve(textarea as HTMLTextAreaElement)
//           }
//         }
//       }
//     })
//     const interval = setInterval(() => {
//       const textarea = document.querySelector('textarea')
//       if (textarea) {
//         clearInterval(interval)
//         observer.disconnect()
//         resolve(textarea as HTMLTextAreaElement)
//       }
//     }, 3000)
//     observer.observe(document.body, { childList: true, subtree: true })
//   })
// }

// async function sendQuestion(
//   textarea: HTMLTextAreaElement,
//   question: string,
//   agentName: string | null
// ) {
//   if (agentName) {
//     textarea.focus()
//     console.log('Агент:', agentName)
//     const eventOptions = {
//       bubbles: true,
//       cancelable: true,
//       view: window,
//     }

//     const atKeydownEvent = new KeyboardEvent('keydown', {
//       ...eventOptions,
//       key: '@',
//       code: 'Digit2',
//       keyCode: 50,
//       which: 50,
//     })
//     textarea.dispatchEvent(atKeydownEvent)

//     const inputEventFirst = new Event('input', eventOptions)
//     textarea.value = '@'
//     textarea.dispatchEvent(inputEventFirst)

//     const atKeyupEvent = new KeyboardEvent('keyup', {
//       ...eventOptions,
//       key: '@',
//       code: 'Digit2',
//       keyCode: 50,
//       which: 50,
//     })
//     textarea.dispatchEvent(atKeyupEvent)

//     await new Promise((resolve) => setTimeout(resolve, 6000))

//     const agentItems = document.querySelectorAll('[tabindex]')
//     let agentFound = false

//     agentItems.forEach((item) => {
//       if (item.textContent?.includes(agentName)) {
//         console.log(`Element with text ${agentName} find:`, item)
//         item.dispatchEvent(new Event('click', { bubbles: true }))
//         agentFound = true
//       }
//     })

//     if (!agentFound) {
//       console.log(`Element with text ${agentName} not found`)
//       return
//     }

//     await new Promise((resolve) => setTimeout(resolve, 2000))
//   }

//   const textareaQuestion = document.getElementById('prompt-textarea') as HTMLTextAreaElement
//   textareaQuestion.value = question
//   const inputEvent = new Event('input', {
//     bubbles: true,
//     cancelable: true,
//   })
//   textareaQuestion.dispatchEvent(inputEvent)

//   await new Promise((resolve) => setTimeout(resolve, 2000))

//   const sendBtn = document.querySelector('[data-testid="send-button"]') as HTMLButtonElement

//   if (sendBtn) {
//     console.log('Кнопка отправки найдена, отправляем вопрос')
//     sendBtn.click()
//   } else {
//     const interval = setInterval(() => {
//       const sendBtn = document.querySelector('[data-testid="send-button"]') as HTMLButtonElement
//       if (sendBtn) {
//         console.log('Кнопка отправки найдена, отправляем вопрос')
//         sendBtn.click()
//         clearInterval(interval)
//       }
//     }, 3000)
//   }
// }

// эта функция получает ответ в нужном формате для того чтоб отослать его на бек

async function getFullAnswer(requiredAnswerFormat: string): Promise<string> {
  const gptMessageContainer = await getGptMessageContainer()
  console.log('gptMessageContainer:', gptMessageContainer.innerText)

  const extractJsonStringFromText = (text: string): string => {

    const startIndex = text.indexOf('{')
    const endIndex = text.lastIndexOf('}')

    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      console.error('Error: JSON array not found or malformed.')
      return ''
    }

    return text.substring(startIndex, endIndex + 1)
  }

  if (requiredAnswerFormat === 'json') {
    if (gptMessageContainer.textContent) {
      const jsonString = extractJsonStringFromText(gptMessageContainer.textContent)
      console.log('Extracted JSON String:', jsonString)
      return jsonString
    }
  }

  return gptMessageContainer.innerText
}

function getChatId() {
  const url = window.location.href.split('/')
  return url[url.length - 1]
}
// эта функция выключает таймаут

function removeIfTimeout(): [Promise<string>, (time?: number) => void] {
  const DEFAULT_TIMEOUT = 150 * 1000
  let timer: NodeJS.Timeout | null = null
  try {
    let rej = (str: string) => {
      str
    }
    const promise = new Promise<string>((resolve, reject) => {
      rej = reject
    })

    timer = setTimeout(() => {
      rej('Answer timeout exceeded')
    }, DEFAULT_TIMEOUT)

    const refreshTimeout = (time = DEFAULT_TIMEOUT) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        rej('Answer timeout exceeded')
      }, time)
    }

    return [promise, refreshTimeout]
  } finally {
    if (timer) clearTimeout(timer)
  }
}
// эта функция отключает чат еси что то не так

function removeIfUnable(): Promise<string> {
  const events = document.querySelector('.pointer-events-none')
  if (!events) {
    return Promise.resolve('removeIfUnable: No events')
  }

  return new Promise((resolve, reject) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if ((node as HTMLDivElement)?.innerText?.includes('Unable to load conversation')) {
              reject('Invalid permalink')
              observer.disconnect()
            }
          }
        }
      }
    })
    observer.observe(events, { childList: true, attributes: true })
  })
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
// эта функция следит когда ответит чат на промпт и созраняет ответ и нажимает кнопку продолжить

function getGptMessageContainer() {
  const saveMessages = (messages: any) => {
    chrome.storage.local.set({ userMessages: messages }, () => {
      if (chrome.runtime.lastError) {
        console.error('Ошибка при сохранении сообщений:', chrome.runtime.lastError)
      } else {
        console.log('Сообщения успешно сохранены')
        chrome.runtime.sendMessage({ action: 'messagesUpdated' })
      }
    })
  }

  const addMessage = (newMessage: any) => {
    chrome.storage.local.get(['userMessages'], (result) => {
      const currentMessages = result.userMessages || []
      const messageObject = {
        date: new Date().toISOString(),
        message: newMessage,
      }
      const updatedMessages = [...currentMessages, messageObject]
      saveMessages(updatedMessages)
    })
  }

  const presentation = document.querySelector('div[role="presentation"]') as HTMLDivElement

  addMessage('Ожидаем окончания обработки отслеживаем результаты')

  return new Promise<HTMLDivElement>((resolve) => {
    let lastContent = ''
    const contentCheckInterval = setInterval(() => {
      const currentContent = presentation.innerText
      const continueBtns = Array.from(document.querySelectorAll('button')).filter((btn) =>
        btn.textContent?.includes('Continue generating')
      )

      if (continueBtns.length > 0) {
        addMessage('Зафиксирована кнопка "Continue generating"')
      }

      if (currentContent !== lastContent) {
        console.log('Content has changed, waiting more...')
        lastContent = currentContent
        continueBtns.forEach((btn) => btn.click())
      } else {
        console.log('Content stabilized')
        if (continueBtns.length === 0) {
          clearInterval(contentCheckInterval)

          const markdownDivs = document.querySelectorAll('.markdown')
          const lastMarkdownDiv = markdownDivs[markdownDivs.length - 1] as HTMLDivElement

          console.log('No continue button and content is stable. Resolving...')
          resolve(lastMarkdownDiv)
        }
      }
    }, 10000)
  })
}
// эта функция переименовывает чат

async function renameChat(newName: string) {
  function findElementByXPath(xpath: string) {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
    return result.singleNodeValue as HTMLElement
  }

  function simulateKeyboardEvent(element: HTMLElement, eventName: string, keyCode: number) {
    const keyboardEvent = new KeyboardEvent(eventName, {
      bubbles: true,
      cancelable: true,
      key: 'Enter',
      code: 'Enter',
      keyCode,
      which: keyCode,
    })
    element.dispatchEvent(keyboardEvent)
  }

  const xpathButton =
    '/html/body/div[1]/div[1]/div[1]/div/div/div/div/nav/div[2]/div[3]/div/div[1]/ol/li[1]/div/div/span/button'
  const button = findElementByXPath(xpathButton)

  if (button) {
    button.focus()
    console.log('Фокус установлен на кнопку')

    simulateKeyboardEvent(button, 'keydown', 13)
    simulateKeyboardEvent(button, 'keyup', 13)

    console.log('Имитация нажатия клавиши Enter выполнена')
  }

  await new Promise((resolve) => setTimeout(resolve, 1500))

  const xpathRename = '/html/body/div[4]/div/div[2]'
  const renameLi = findElementByXPath(xpathRename)

  if (renameLi) {
    renameLi.click()
  } else {
    console.log('renameLi не найден')
    return
  }

  await new Promise((resolve) => setTimeout(resolve, 1500))

  const xpathInput =
    '/html/body/div[1]/div[1]/div[1]/div/div/div/div/nav/div[2]/div[3]/div/div[1]/ol/li[1]/div/div/input'
  const input = findElementByXPath(xpathInput) as HTMLInputElement

  await new Promise((resolve) => setTimeout(resolve, 10000))
  if (input) {
    input.focus()

    await new Promise((resolve) => setTimeout(resolve, 5000))
    input.value = newName

    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
    })
    input.dispatchEvent(inputEvent)
    console.log('Событие input отправлено')
    simulateKeyboardEvent(input, 'keydown', 13)
    simulateKeyboardEvent(input, 'keyup', 13)
  } else {
    console.log('Поле ввода не найдено')
  }
}
// эта функция удаляет чат

async function removeChat() {
  function findElementByXPath(xpath: string) {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
    return result.singleNodeValue as HTMLElement
  }

  function simulateKeyboardEvent(element: HTMLElement, eventName: string, keyCode: number) {
    const keyboardEvent = new KeyboardEvent(eventName, {
      bubbles: true,
      cancelable: true,
      key: 'Enter',
      code: 'Enter',
      keyCode,
      which: keyCode,
    })
    element.dispatchEvent(keyboardEvent)
  }

  const xpathButton =
    '/html/body/div[1]/div[1]/div[1]/div/div/div/div/nav/div[2]/div[3]/div/div[1]/ol/li[1]/div/div/span/button'
  const button = findElementByXPath(xpathButton)

  if (button) {
    button.focus()
    console.log('Фокус установлен на кнопку')

    simulateKeyboardEvent(button, 'keydown', 13)
    simulateKeyboardEvent(button, 'keyup', 13)

    console.log('Имитация нажатия клавиши Enter выполнена')
  }

  await new Promise((resolve) => setTimeout(resolve, 1500))

  const xpathDelete = '/html/body/div[4]/div/div[4]'
  const deleteLi = findElementByXPath(xpathDelete)

  if (deleteLi) {
    deleteLi.click()
  } else {
    return console.log('renameLi не найден')
  }

  await new Promise((resolve) => setTimeout(resolve, 2000))

  const xpathDeleteBtn = '/html/body/div[4]/div/div/div/div[2]/div[2]/button[1]'
  const deleteBtn = findElementByXPath(xpathDeleteBtn)
  if (deleteBtn) {
    deleteBtn.click()
  } else {
    return console.log('deleteBtn не найден')
  }
}
