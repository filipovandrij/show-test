import hash_sum from 'hash-sum'
import { createRoot } from 'react-dom/client'
import { parseSimpleLinkedinProfile } from '../../utils/parseSimpleLinkedin'
import api from '../../api'
import { setState } from '../state'
import { Log, storageTime } from '../logState'
import { LinkedinProfileButton } from './LinkedinProfileButton'
import { sendCookie } from '../../utils/sendCookie'
;(async () => {
  sendCookie('https://www.linkedin.com/')

  const addButton = (url: string, token?: string) => {
    const caseId = storage.currentCaseId

    const main = document.querySelector('main')
    if (main) {
      const xpath = '//main/section[1]/div[2]/div[3]/div'

      const result = document.evaluate(xpath, main, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)

      const secondDiv = result.singleNodeValue

      if (secondDiv) {
        const app = document.createElement('div')
        app.id = 'react-btn'
        app.setAttribute('style', 'display: flex; align-items: center; margin-left: auto;')
        secondDiv.appendChild(app)

        const root = createRoot(app)
        root.render(<LinkedinProfileButton caseId={caseId} url={url} token={token} />)
      }
    }
  }

  const storage = await chrome.storage.local.get()
  const token = storage?.token
  const url = decodeURIComponent(window.location.href.split('?')[0])
  addButton(url, token)
  if (storage?.linkedinQuickParse !== 'auto' || !token) return

  chrome.runtime.sendMessage({
    action: 'parseSimpleLinkedinProfileInit',
  })

  const updateState = (url: string, success: boolean, metrics: number, hash: string) =>
    setState((state) => ({
      ...state,
      logs: {
        ...state.logs,
        [url]: [
          ...(state.logs?.[url] ?? []),
          {
            timestamp: Date.now(),
            result: {
              success,
              metrics,
              hash,
            },
            action: 'parse',
            expiryDate: Date.now() + storageTime,
          },
        ],
      },
    }))

  const analyzeLogs = (logs?: Log[]) => {
    if (!logs) return
    const successLogs = []

    for (let i = 0; i < logs.length; i++) {
      if (logs[i].action === 'parse') {
        logs[i].result.success && successLogs.push(logs[i])
      }
    }

    return successLogs.length > 0 ? successLogs[successLogs.length - 1] : undefined
  }

  const formatHash = (info: any) => {
    // eslint-disable-next-line no-unused-vars
    const { Interests, Activity, ...rest } = info

    if (
      rest.json_data &&
      rest.json_data.profile_data &&
      typeof rest.json_data.profile_data === 'object'
    ) {
      delete rest.json_data.profile_data.followers
    }

    return JSON.stringify(rest, null, 2)
  }

  const logs = storage.state.logs[url]
  const lastSuccess = analyzeLogs(logs)

  try {
    const info = parseSimpleLinkedinProfile(url)
    const parsedInfo = info.json_data
    const infoStr = JSON.stringify(parsedInfo, null, 2)
    const hash = hash_sum(formatHash(parsedInfo))

    await chrome.storage.local.set({ linkedinQuickParseInfo: infoStr })
    updateState(url, true, info?.Skills?.occupancy || 0, hash)

    if (hash !== lastSuccess?.result.hash) {
      const r = await api.savingData(info)

      if (!r.ok) throw Error()
    }
  } finally {
    chrome.runtime.sendMessage({
      action: 'parseSimpleLinkedinProfileFinished',
    })
  }
})()
