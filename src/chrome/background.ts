import { backgroundGpt } from './gptState'
import { findCandidatesBg } from './findCandidatesState'
import { quickParseState } from './quickParse/quickParseState'
import { setState } from './state'
import { logBg, storageTime } from './logState'
import { quickParseListener } from './quickParse'
import { runPromptQueue, stopPromptQueue } from '../utils/gpt/runPromptQueue'
import {
  processQueueManagerApollo,
  processQueueManagerLinkedIn,
} from './queue/newQueue/queueManager'

logBg()
backgroundGpt()
findCandidatesBg()
quickParseState()

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({
      linkedinQuickParse: 'auto',
      linkedinJobQuickParse: 'auto',

      credits: 5,
    })

    chrome.alarms.create('clear-logs', {
      periodInMinutes: 60,
    })
  }
})

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id || 0 },
    files: ['./static/js/content.js', './static/js/messageBus.js'],
  })
})

chrome.runtime.onMessage.addListener((req, _, sendResp) => {
  if (req.action === 'startPromptQueue') {
    runPromptQueue().then((r) => sendResp(r))
  }

  if (req.action === 'stopPromptQueue') {
    stopPromptQueue()
  }
})

setInterval(async () => {
  await processQueueManagerApollo()
  await processQueueManagerLinkedIn()
}, 30000)

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'createMainFrame') {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id || 0 },
        files: ['./static/js/content.js', './static/js/messageBus.js'],
      })
    })
  }
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.tabs.sendMessage(tab?.id || 0, request)
  })
})

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'closeMainFrame') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== undefined) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'closeMainFrame' })
      }
    })
  }
})

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === 'open-extensions-tab') {
    chrome.scripting.executeScript({
      target: { tabId: tab.id || 0 },
      files: ['./static/js/content.js', './static/js/messageBus.js'],
    })
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'get-cookie') {
    chrome.cookies.getAll({ url: request.url }).then((cookies) => sendResponse(cookies))
  }
  return true
})

// const onUpdatedListener = (
//   tabId: number,
//   changeInfo: chrome.tabs.TabChangeInfo,
//   tab: chrome.tabs.Tab
// ) => {
//   const siteScripts: { [k: string]: (k: string) => string[] | null } = {
//     "mail.google.com": () => [
//       "./static/js/messageBus.js",
//       "./static/js/gmail.js",
//     ],
//     "www.linkedin.com": (url: string) =>
//         new RegExp(String.raw`https://www.linkedin.com/in/[\p{L}\p{N}\p{Pd}]+/$`, "u").test(url)
//         ? ["./static/js/messageBus.js", "./static/js/linkedinProfile.js"]
//         : new RegExp(String.raw`https://www.linkedin.com/jobs/view/\d+\/`).test(url)
//           ? ["./static/js/messageBus.js", "./static/js/linkedinJob.js"]
//               : null,
//     "indeed.com": (url: string) =>
//       url.includes("indeed.com/viewjob")
//         ? ["./static/js/messageBus.js", "./static/js/indeed.js"]
//         : null,
//     "www.indeed.com": (url: string) =>
//       url.includes("indeed.com")
//         ? ["./static/js/messageBus.js", "./static/js/indeed.js"]
//         : null,
//     "www.adzuna.com": (url: string) =>
//         url.startsWith("https://www.adzuna.com/details/")
//             ? ["./static/js/messageBus.js", "./static/js/adzunaProfile.js"]
//             : null,
//   };
//
//
//   const url = tab.url;
//   const hostPrefixes = ["pl", "fr", "nl", "ca"];
//
//   if (changeInfo.status === "complete" && url) {
//     let strippedHost = new URL(url).host;
//     hostPrefixes.forEach((prefix) => {
//       if (strippedHost.startsWith(prefix + ".")) {
//         strippedHost = strippedHost.replace(`${prefix}.`, "");
//       }
//     });
//     const scripts = siteScripts[strippedHost] && siteScripts[strippedHost](decodeURIComponent(url));
//
//     scripts && chrome.scripting.executeScript({
//           target: { tabId },
//           files: scripts,
//         });
//   }
// };

const onUpdatedListener = (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) => {
  tab.id &&
    changeInfo.url &&
    chrome.tabs.sendMessage(tab.id, {
      currentUrl: changeInfo.url,
    })
}

const onBeforeNavigateListener = (
  details: chrome.webNavigation.WebNavigationFramedCallbackDetails
) => {
  quickParseListener(details)
}

const onCompletedListener = (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
  const { url } = details
  const siteScripts: { [k: string]: (k: string) => string[] | null } = {
    'mail.google.com': () => ['./static/js/messageBus.js', './static/js/gmail.js'],
    'www.linkedin.com': (url: string) => {
      if (new RegExp(String.raw`https://www.linkedin.com/jobs/view/\d+\/`).test(url)) {
        return ['./static/js/messageBus.js', './static/js/linkedinJob.js']
      }
      if (new RegExp(String.raw`https://www.linkedin.com/search/results/people/*`).test(url)) {
        return ['./static/js/messageBus.js', './static/js/linkedinSearchButton.js']
      }
      if (new RegExp(String.raw`https://www.linkedin.com/sales/search/people/*`).test(url)) {
        return ['./static/js/messageBus.js', './static/js/SalesNavigatorSearchButton.js']
      }

      return null
    },
    'indeed.com': (url: string) =>
      url.includes('indeed.com/viewjob')
        ? ['./static/js/messageBus.js', './static/js/indeed.js']
        : null,
    'www.indeed.com': (url: string) =>
      url.includes('indeed.com') ? ['./static/js/messageBus.js', './static/js/indeed.js'] : null,
    'www.adzuna.com': (url: string) =>
      url.startsWith('https://www.adzuna.com/details/')
        ? ['./static/js/messageBus.js', './static/js/adzunaProfile.js']
        : null,
  }

  const hostPrefixes = ['pl', 'fr', 'nl', 'ca']

  if (url) {
    let strippedHost = new URL(url).host
    hostPrefixes.forEach((prefix) => {
      if (strippedHost.startsWith(`${prefix}.`)) {
        strippedHost = strippedHost.replace(`${prefix}.`, '')
      }
    })
    const scripts = siteScripts[strippedHost] && siteScripts[strippedHost](decodeURIComponent(url))

    if (scripts) {
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
        target: { tabId: details.tabId },
        files: scripts,
      })
    }
  }
}

!chrome.webNavigation.onCompleted.hasListener(onCompletedListener) &&
  chrome.webNavigation.onCompleted.addListener(onCompletedListener)

!chrome.webNavigation.onBeforeNavigate.hasListener(onBeforeNavigateListener) &&
  chrome.webNavigation.onBeforeNavigate.addListener(onBeforeNavigateListener)

!chrome.webNavigation.onHistoryStateUpdated.hasListener(onBeforeNavigateListener) &&
  chrome.webNavigation.onHistoryStateUpdated.addListener(onBeforeNavigateListener)

!chrome.webNavigation.onHistoryStateUpdated.hasListener(onCompletedListener) &&
  chrome.webNavigation.onHistoryStateUpdated.addListener(onCompletedListener)

!chrome.tabs.onUpdated.hasListener(onUpdatedListener) &&
  chrome.tabs.onUpdated.addListener(onUpdatedListener)
