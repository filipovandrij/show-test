import { setState } from './state'

export type Log = {
  timestamp: number
  action: 'parse' | 'trigger'
  result: {
    success: boolean
    hash?: string
    resultId?: string
    metrics?: number
  }
  errors?: {
    errorId: string
    details: string
  }
  expiryDate: number
  metadata?: any
}

export const storageTime = 3600 * 24 * 3

export const logBg = () => {
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'clear-logs') {
      setState((prev) => {
        const logs = { ...prev.logs }
        for (const key in logs) {
          logs[key] = logs[key].filter((log) => log.expiryDate > Date.now())
        }
        return { ...prev, logs }
      })
    }
  })
}