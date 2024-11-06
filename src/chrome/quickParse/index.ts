import { getState, setState } from '../state'
import { State } from '../types'
import { ParserConfig } from './model/ParserConfig'
import { storageTime } from '../logState'

const processingTabs: {
  [k: number]: {
    timer: ReturnType<typeof setTimeout>
    onHeadersReceivedListener: ({ url }: chrome.webRequest.WebResponseHeadersDetails) => void
    requestFinishedListener: ({ url }: chrome.webRequest.WebResponseCacheDetails) => void
  }
} = {}

const parserByTabId: {
  [k: number]: {
    parser: ParserConfig
    url: string
  }
} = {}

const getParserKey = (url: string, parsers: Required<State>['parsers']) => {
  const normalizedUrl = decodeURIComponent(url)

  return Object.keys(parsers).find((url) => new RegExp(url, 'u').test(normalizedUrl))
}

const clearPrevParse = (tabId: number) => {
  if (tabId in processingTabs) {
    clearTimeout(processingTabs[tabId].timer)
    chrome.webRequest.onHeadersReceived.removeListener(
      processingTabs[tabId].onHeadersReceivedListener
    )
    chrome.webRequest.onCompleted.removeListener(processingTabs[tabId].requestFinishedListener)
    chrome.webRequest.onErrorOccurred.removeListener(processingTabs[tabId].requestFinishedListener)
    delete processingTabs[tabId]
  }
  setState([[`quickParse.${tabId}` as any, { processing: false, data: undefined }]], 'bg')
}

const startParse = ({
  details: { tabId, mainUrl },
  parser,
}: {
  details: { tabId: number; mainUrl: string }
  parser: ParserConfig
}) => {
  const { requestsUrls: urls, types } = parser

  if (!urls.length || !types.length) return
  setState([[`quickParse.${tabId}` as any, { processing: true }]], 'bg')
  const requests = {
    inited: [] as string[],
    finished: [] as string[],
  }

  const onHeadersReceivedListener = ({ url }: chrome.webRequest.WebResponseHeadersDetails) => {
    requests.inited.push(url)

    processingTabs[tabId].timer && clearTimeout(processingTabs[tabId].timer)
    processingTabs[tabId].timer = setTimeout(() => clearPrevParse(tabId), 10000)
  }

  const requestFinishedListener = ({ url }: chrome.webRequest.WebResponseCacheDetails) => {
    requests.finished.push(url)

    processingTabs[tabId].timer && clearTimeout(processingTabs[tabId].timer)
    parserByTabId[tabId] = { parser, url }
    processingTabs[tabId].timer = setTimeout(
      () => {
        new RegExp(String.raw`https://www.linkedin.com/in/[\p{L}\p{N}\p{Pd}]+/$`, 'u').test(
          decodeURIComponent(mainUrl)
        )
          ? launchLinkedin(mainUrl, tabId)
          : chrome.scripting.executeScript({
              target: { tabId },
              files: ['./static/js/messageBus.js', './static/js/quickParse.js'],
            })
        clearPrevParse(tabId)
      },
      requests.finished.length >= requests.inited.length ? 3000 : 10000
    )
  }

  processingTabs[tabId] = {
    onHeadersReceivedListener,
    requestFinishedListener,
    timer: setTimeout(() => {
      parserByTabId[tabId] = { parser, url: mainUrl }
      new RegExp(String.raw`https://www.linkedin.com/in/[\p{L}\p{N}\p{Pd}]+/$`, 'u').test(
        decodeURIComponent(mainUrl)
      )
        ? launchLinkedin(mainUrl, tabId)
        : chrome.scripting.executeScript({
            target: { tabId },
            files: ['./static/js/messageBus.js', './static/js/quickParse.js'],
          })
      clearPrevParse(tabId)
    }, 3000),
  }

  chrome.webRequest.onHeadersReceived.addListener(onHeadersReceivedListener, {
    urls,
    types,
  })

  chrome.webRequest.onCompleted.addListener(requestFinishedListener, {
    urls,
    types,
  })

  chrome.webRequest.onErrorOccurred.addListener(requestFinishedListener, {
    urls,
    types,
  })
}

const launchLinkedin = (url: string, tabId: number) => {
  const parsedUrl = decodeURIComponent(url.split('?')[0])
  setState((state) => ({
    ...state,
    logs: {
      ...state.logs,
      [parsedUrl]: [
        ...(state.logs?.[parsedUrl] ?? []),
        {
          timestamp: Date.now(),
          result: {
            success: true,
          },
          action: 'trigger',
          expiryDate: Date.now() + storageTime,
        },
      ],
    },
  }))
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['./static/js/messageBus.js', './static/js/linkedinProfile.js'],
  })
  // chrome.scripting.executeScript({
  //   target: { tabId },
  //   files: ['./static/js/messageBus.js', './static/js/linkedinProfileForJob.js'],
  // })
}

export const quickParseListener = async (
  details: chrome.webNavigation.WebNavigationFramedCallbackDetails
) => {
  const parsers = (await getState()).parsers || {}
  const parserKey =
    details.frameType !== 'outermost_frame' ? undefined : getParserKey(details.url, parsers)
  const parser = parserKey ? parsers[parserKey] : undefined
  if (!parser) return

  clearPrevParse(details.tabId)

  parser.mode === 'auto' && startParse({ details: { ...details, mainUrl: details.url }, parser })
}

chrome.runtime.onMessage.addListener((request, { tab }, sendResponse) => {
  if (request.action === 'get_parser' && tab?.id !== undefined) {
    sendResponse(parserByTabId[tab.id])
  }

  if (request.action === 'start_parse' && tab?.id !== undefined && tab.url) {
    getState().then(({ parsers = {} }) => {
      const parserKey = getParserKey(tab.url!, parsers)
      const parser = parserKey ? parsers[parserKey] : undefined
      if (parser) {
        clearPrevParse(tab.id!)
        startParse({ details: { tabId: tab.id!, mainUrl: tab.url! }, parser })
        sendResponse('parse_started')
      }
      sendResponse('bad_request')
    })
    return true
  }
})

export * from './model/QuickParseState'
