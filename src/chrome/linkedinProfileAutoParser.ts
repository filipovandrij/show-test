const linkedinProfileAutoParser = () => {
  const urls = ['https://www.linkedin.com/voyager/api/*']
  const types: chrome.webRequest.ResourceType[] = ['other', 'xmlhttprequest']

  let beforeRequestListener: ({ url }: chrome.webRequest.WebRequestBodyDetails) => void

  let requestFinishedListener: ({ url }: chrome.webRequest.WebResponseCacheDetails) => void

  let timer: ReturnType<typeof setTimeout>

  const reset = (sendEvent = true) => {
    chrome.webRequest.onBeforeRequest.removeListener(beforeRequestListener)
    chrome.webRequest.onCompleted.removeListener(requestFinishedListener)
    chrome.webRequest.onErrorOccurred.removeListener(requestFinishedListener)
    timer && clearTimeout(timer)
    chrome.storage.local.remove('linkedinQuickParseInfo')
    sendEvent &&
    chrome.runtime.sendMessage({
      action: 'parseSimpleLinkedinProfileReset',
    })
  }

  const executeParseScript = async (tabId: number) => {
    reset(false)
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['./static/js/messageBus.js', './static/js/linkedinProfile.js'],
    })

  }

  const init = async (tabId: number) => {
    reset()
    const storage = await chrome.storage.local.get()

    if (storage?.linkedinQuickParse !== 'auto') return

    chrome.runtime.sendMessage({
      action: 'parseSimpleLinkedinProfileInit',
    })
    const requests = {
      inited: [] as string[],
      finished: [] as string[],
    }

    beforeRequestListener = ({ url }: chrome.webRequest.WebRequestBodyDetails) => {
      requests.inited.push(url)
      timer && clearTimeout(timer)
      timer = setTimeout(() => reset(), 10000)
    }

    requestFinishedListener = ({ url }: chrome.webRequest.WebResponseCacheDetails) => {
      requests.finished.push(url)
      timer && clearTimeout(timer)
      if (
        requests.finished.filter((u) => requests.inited.includes(u)).length ===
        requests.inited.length
      ) {
        timer = setTimeout(() => {
          executeParseScript(tabId)
        }, 1000)
      }
    }

    chrome.webRequest.onBeforeRequest.addListener(beforeRequestListener, {
      types,
      urls,
    })

    chrome.webRequest.onCompleted.addListener(requestFinishedListener, {
      types,
      urls,
    })

    chrome.webRequest.onErrorOccurred.addListener(requestFinishedListener, {
      types,
      urls,
    })
  }

  return {
    initLinkedinProfileAutoParser: init,
    resetLinkedinProfileAutoParser: reset,
  }
}

export const { initLinkedinProfileAutoParser, resetLinkedinProfileAutoParser } =
  linkedinProfileAutoParser()
