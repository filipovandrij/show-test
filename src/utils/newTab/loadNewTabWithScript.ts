import { loadNewTab } from './loadNewTab'
import { executeNewTab } from './executeNewTab'

export const loadNewTabWithScript = async (url: string, files?: string[]) => {
  const tabId = await loadNewTab(url)
  if (typeof tabId !== 'number') {
    return
  }

  if (files) {
    await executeNewTab(tabId as number, files)
  }
  return tabId
}
