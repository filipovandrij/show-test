import api from '../../api'
import { getBaseUrl } from '../../api/baseUrl'
import { getToken } from '../../api/getToken'
import { updateImport } from '../../views/AIFrame/DataImport/Import'
import { checkTestingDev } from './checkTestingDev'

const getImport = async (id: number) => {
  try {
    const token = await getToken()
    const baseUrl = await getBaseUrl()

    const response = await fetch(`${baseUrl}/api/import/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting import data:', error)
    return null
  }
}

export async function processLinkedInCompany(companyUrl: string) {
  let processingStatus = 'processing'

  try {
    const newTab = await chrome.tabs.create({ url: companyUrl, active: false })

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

    chrome.tabs.sendMessage(Number(newTab.id), { action: 'showModal' })

    const messagePromise = new Promise((resolve) => {
      chrome.tabs.sendMessage(
        Number(newTab.id),
        { action: 'parseLinkedinCompany', url: newTab.pendingUrl },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Ошибка при отправке сообщения:', chrome.runtime.lastError.message)
            processingStatus = 'error'
          } else if (!response || !response.parsedInfo) {
            console.error('Ответ от контентного скрипта некорректен:', response)
            processingStatus = 'error'
          } else {
            api
              .savingData(response.parsedInfo)
              .then((r) => {
                if (!r.ok) {
                  throw new Error('Ошибка сохранения данных')
                }
                console.log('Server response:', r)
                processingStatus = 'success'
              })
              .catch((error) => {
                console.error('Error sending data to server:', error)
                processingStatus = 'error'
              })
              .finally(() => {
                if (newTab.id) {
                  chrome.tabs.remove(newTab.id, () => {
                    console.log('Tab closed')
                  })
                  resolve(processingStatus)
                }
              })
          }
        }
      )
    })

    return messagePromise
  } catch (error) {
    console.error('Ошибка в collectProfile:', error)
    processingStatus = 'error'
    return processingStatus
  }
}

export async function processLinkedInProfile(profileUrl: string): Promise<string> {
  let newTabId: number | undefined

  let tabClosedPrematurely = false
  const onTabRemoved = (tabId: number) => {
    if (tabId === newTabId) {
      console.error('Tab was closed prematurely')
      tabClosedPrematurely = true
    }
  }

  try {
    const newTab = await chrome.tabs.create({ url: profileUrl, active: false })
    newTabId = newTab.id

    chrome.tabs.onRemoved.addListener(onTabRemoved)

    await new Promise<void>((resolve) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === newTab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener)
          resolve()
          setTimeout(() => {}, 3000)
        }
      })
    })

    if (tabClosedPrematurely) {
      throw new Error('Tab was closed prematurely')
    }

    if (newTab.id !== undefined) {
      await chrome.scripting.executeScript({
        target: { tabId: newTab.id },
        files: ['./static/js/messageBus.js'],
      })
    }

    chrome.tabs.sendMessage(Number(newTab.id), { action: 'showModal' })

    const result = await new Promise<string>((resolve, reject) => {
      chrome.tabs.sendMessage(
        Number(newTab.id),
        { action: 'parseLinkedinProfile', url: profileUrl },
        async (response) => {
          try {
            const saveResult = await api.savingData(response.parsedInfo)
            if (!saveResult.ok) {
              throw new Error('Server responded with an error')
            }
            resolve('success')
          } catch (error) {
            console.error('Error sending data to server:', error)
            reject('error')
          }
        }
      )
    })

    return result
  } catch (error) {
    console.error('Error in processLinkedInProfile:', error)
    return 'error'
  } finally {
    if (newTabId) {
      chrome.tabs.onRemoved.removeListener(onTabRemoved)
      chrome.tabs.remove(newTabId).catch(console.error)
    }
  }
}

export async function processLinkedInJob(jobUrl: string) {
  let newTabId: number | undefined

  let tabClosedPrematurely = false
  const onTabRemoved = (tabId: number) => {
    if (tabId === newTabId) {
      console.error('Tab was closed prematurely')
      tabClosedPrematurely = true
    }
  }

  try {
    const newTab = await chrome.tabs.create({ url: jobUrl, active: false })
    newTabId = newTab.id

    chrome.tabs.onRemoved.addListener(onTabRemoved)

    await new Promise<void>((resolve) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === newTab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener)
          resolve()
          setTimeout(() => {}, 3000)
        }
      })
    })

    if (tabClosedPrematurely) {
      throw new Error('Tab was closed prematurely')
    }

    if (newTab.id !== undefined) {
      await chrome.scripting.executeScript({
        target: { tabId: newTab.id },
        files: ['./static/js/messageBus.js'],
      })
    }

    chrome.tabs.sendMessage(Number(newTab.id), { action: 'showModal' })

    const result = await new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('success')
      }, 5000)
    })

    return result
  } catch (error) {
    console.error('Error in processLinkedInJob:', error)
    return 'error'
  } finally {
    if (newTabId) {
      chrome.tabs.onRemoved.removeListener(onTabRemoved)
      chrome.tabs.remove(newTabId).catch(console.error)
    }
  }
}

export async function processZoomInfo(
  url: string,
  action: string,
  count: number,
  minDelay: number,
  maxDelay: number,
  guid: string,
  importNumber: number,
  id: number
) {
  let newTabId: number | undefined
  let tabClosedPrematurely = false
  const onTabRemoved = (tabId: number) => {
    if (tabId === newTabId) {
      console.error('Tab was closed prematurely')
      tabClosedPrematurely = true
    }
  }
  const checkImport: any = getImport(id)

  try {
    const newTab: any = await chrome.windows.create({ url, incognito: false })
    newTabId = newTab.tabs[0].id

    chrome.tabs.onRemoved.addListener(onTabRemoved)

    await new Promise<void>((resolve) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === newTab.tabs[0].id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener)
          setTimeout(() => {
            resolve()
          }, 15000)
        }
      })
    })

    if (tabClosedPrematurely) {
      await updateImport(id, {
        status: 'error',
      })
      throw new Error('Tab was closed prematurely')
    }

    await updateImport(id, {
      status: 'in progress',
    })

    if (newTab.tabs[0].id !== undefined) {
      await chrome.scripting.executeScript({
        target: { tabId: newTab.tabs[0].id },
        files: ['./static/js/messageBus.js'],
      })
    }

    chrome.tabs.sendMessage(Number(newTab.tabs[0].id), { action: 'showModal' })

    await updateImport(id, {
      total_entities: count,
      status: 'in progress',
      planned_date: new Date().toISOString(),
      filter_string: url,
    })

    const result = await new Promise<string>((resolve, reject) => {
      chrome.tabs.sendMessage(
        Number(newTab.tabs[0].id),
        {
          action,
          count: +count,
          minDelay: (+minDelay || 0) * 1000,
          maxDelay: (+maxDelay || 0) * 1000,
          guid,
          importNumber,
        },

        async (response) => {
          try {
            const saveResult = checkImport.processed_entities === checkImport.total_entities
            if (!saveResult) {
              throw new Error('Server responded with an error')
            }
            console.log('res', response)
            resolve('success')
          } catch (error) {
            console.error('Error sending message to script:', error)
            reject('error')
          }
        }
      )
    })

    await updateImport(id, {
      status: 'done',
    })

    return result
  } catch (error) {
    console.error('Error in processLinkedInProfile:', error)
    return 'error'
  } finally {
    if (newTabId) {
      chrome.tabs.onRemoved.removeListener(onTabRemoved)
      chrome.tabs.remove(newTabId).catch(console.error)
    }
  }
}

export async function processApollo(
  url: string,
  action: string,
  count: number,
  minDelay: number,
  maxDelay: number,
  guid: string,
  count_processed: number,
  importNumber: number,
  id: number,
  tag_ids?: string[],
  validate?: {
    method: string
    period: any
  }
) {
  let newTabId: number | undefined
  let tabClosedPrematurely = false
  const onTabRemoved = (tabId: number) => {
    if (tabId === newTabId) {
      console.error('Tab was closed prematurely')
      tabClosedPrematurely = true
    }
  }

  const checkTesting = await checkTestingDev()

  try {
    const newTab: any = await chrome.tabs.create({ url, active: false })
    newTabId = newTab.id

    // const newTab: any = await chrome.windows.create({ url, incognito: false })
    // newTabId = newTab.tabs[0].id

    chrome.tabs.onRemoved.addListener(onTabRemoved)

    await new Promise<void>((resolve) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === newTab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener)
          setTimeout(resolve, 5000)
        }
      })
    })

    if (tabClosedPrematurely) {
      throw new Error('Tab was closed prematurely')
    }

    if (newTab.id !== undefined) {
      await chrome.scripting.executeScript({
        target: { tabId: newTab.id },
        files: ['./static/js/messageBus.js'],
      })
    }

    chrome.tabs.sendMessage(Number(newTab.id), { action: 'showModal' })

    await updateImport(id, {
      total_entities: count,
      status: 'processing',
      planned_date: new Date().toISOString(),
    })

    const result = await new Promise<string>((resolve, reject) => {
      chrome.tabs.sendMessage(
        Number(newTab.id),
        {
          action,
          count: count - count_processed,
          minDelay: (+minDelay || 0) * 1000,
          maxDelay: (+maxDelay || 0) * 1000,
          guid,
          importNumber,
          id,
          tag_ids,
          validate,
        },
        async (response) => {
          try {
            if (tabClosedPrematurely) {
              reject('paused due to error')
              throw new Error('Server responded with an error')
            }
            console.log('res', response)
            resolve('done')
          } catch (error) {
            console.error('Error sending message to script:', error)
            reject('error')
          }
        }
      )
    })

    return result
  } catch (error) {
    if (tabClosedPrematurely) {
      return 'paused due to error'
    }
    console.error('Error in processApollo:', error)
    return 'error'
  } finally {
    if (newTabId) {
      chrome.tabs.onRemoved.removeListener(onTabRemoved)
      !checkTesting && chrome.tabs.remove(newTabId).catch(console.error)
    }
  }
}
