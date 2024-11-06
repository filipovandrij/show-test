/* eslint-disable no-await-in-loop */
import hash_sum from 'hash-sum'
import api from '../api'

import { setState } from './state'
import { Log, storageTime } from './logState'
import { parseLinkedinProfileForJob } from '../utils/parseLinkedinJob/parseLinkedinProfileForJob'
import { timer } from '../utils/timer'
import { addFrame } from './addFrame'

;(async () => {
  const GOOD_PERCENT = 40
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
    if (!logs) return { launch: true, lastSuccess: undefined }
    const successLogs = []
    const errorLogs = []

    for (let i = 0; i < logs.length; i++) {
      if (logs[i].action === 'parse') {
        logs[i].result.success ? successLogs.push(logs[i]) : errorLogs.push(logs[i])
      }
    }

    const lastSuccess = successLogs.length > 0 ? successLogs[successLogs.length - 1] : undefined
    const lastError = errorLogs.length > 0 ? errorLogs[errorLogs.length - 1] : undefined

    const launch =
      !lastSuccess ||
      (lastSuccess.result.metrics && lastSuccess.result.metrics < GOOD_PERCENT) ||
      (!!lastError && lastError.timestamp > lastSuccess.timestamp)

    return { launch, lastSuccess }
  }

  const url = decodeURIComponent(window.location.href.split('?')[0])
  const storage = await chrome.storage.local.get()
  const logs = storage.state.logs[url]
  const { lastSuccess, launch } = analyzeLogs(logs)

  if (launch) {
    const frameConfig = {
      id: 'frame_monitoring',
      title: 'frame_monitoring',
      width: 200,
      top: 0,
      left: 0,
      height: 200,
      frameType: 'frame_monitoring',
    }
    addFrame(frameConfig)

    let info = await parseLinkedinProfileForJob(url)
    let infoStr = JSON.stringify(info, null, 2)
    let hash = hash_sum(infoStr)

    updateState(url, true, info.Skills.occupancy, hash)
    if (info.Skills.occupancy < GOOD_PERCENT) {
      for (let i = 0; i < 3; i++) {
        await timer(3000)
        info = await parseLinkedinProfileForJob(url)
        infoStr = JSON.stringify(info, null, 2)
        hash = hash_sum(infoStr)
        if (info.Skills.occupancy > GOOD_PERCENT) {
          updateState(url, true, info.Skills.occupancy, hash)
          break
        }
        updateState(url, false, info.Skills.occupancy, hash)
      }
    }
    if (hash !== lastSuccess?.result.hash) {
      const r = await api.savingData(info)

      if (!r.ok) throw Error()
    }
    chrome.runtime.sendMessage({ action: 'finishMonitoring' })
    await chrome.storage.local.set({ linkedinJobQuickParseInfo: infoStr })
  }
})()
