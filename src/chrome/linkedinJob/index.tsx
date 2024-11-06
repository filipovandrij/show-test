/* eslint-disable no-await-in-loop */
import { createRoot } from 'react-dom/client'
import { parseLinkedinJob } from '../../utils/parseLinkedinJob'
import { timer } from '../../utils/timer'
import api from '../../api'
import { LinkAnalyzer } from '../findCandidatesState'
import { LinkedinJobButton } from './LinkedinJobButton'
import { sendCookie } from '../../utils/sendCookie'

export {}
;(() => {
  // const GOOD_PERCENT = 65
  sendCookie('https://www.linkedin.com/')

  const getJobChat = (findCandidates: LinkAnalyzer[], url: string) => {
    return findCandidates?.find(
      (findCandidate) => findCandidate?.formState?.jobDescription?.specific_key?.content === url
    )
  }

  const addButton = (
    managerUrl: string,
    companyUrl: string,
    url: string,
    findCandidates: LinkAnalyzer[],
    token?: string
  ) => {
    const container = document.querySelector('.mt5 > .display-flex')
    if (container) {
      container.setAttribute('style', 'max-height: 40px;')
      const chat = getJobChat(findCandidates, url)
      const div = container.querySelector('#react-btn')
      if (div) div.remove()

      const app = document.createElement('div')
      app.id = 'react-btn'
      app.setAttribute('style', 'display: flex; align-items: center; margin-left: auto;')

      container.appendChild(app)

      const root = createRoot(app)
      root.render(
        <LinkedinJobButton
          managerUrl={managerUrl}
          companyUrl={companyUrl}
          url={url}
          chat={chat}
          token={token}
        />
      )
    }
  }

  const listener = () => {
    const url = decodeURIComponent(window.location.href.split('?')[0])

    const main = document.querySelector('main') as HTMLElement

    const companyLinkContainer = main.querySelector(
      '.app-aware-link[target="_self"]'
    ) as HTMLElement
    const managerLinkContainer = main.querySelector(
      'a.app-aware-link[aria-label*="profile"]'
    ) as HTMLElement
    let clearManagerUrl = ''

    const hrefAttribute = companyLinkContainer.getAttribute('href') || ''

    const clearCompanyUrl = hrefAttribute.split('/').slice(0, -1).join('/')
    if (managerLinkContainer) {
      clearManagerUrl = managerLinkContainer.getAttribute('href') || ''
    }

    chrome.storage.local.get().then(async (storage) => {
      const token = storage.token

      addButton(clearManagerUrl, clearCompanyUrl, url, storage.state?.linkAnalyzer, token)
      if (!token) return
      await chrome.storage.local.set({ linkedinJobQuickParseInfo: null })

      if (storage?.linkedinJobQuickParse === 'auto') {
        chrome.runtime.sendMessage({
          action: 'parseLinkedinJobInit',
        })

        try {
          const info = await parseLinkedinJob(url)
          const parsedInfo = info.json_data
          const infoStr = JSON.stringify(parsedInfo, null, 2)

          await chrome.storage.local.set({ linkedinJobQuickParseInfo: infoStr })

          const r = await api.savingData(info)

          if (!r.ok) {
            throw new Error('Failed to save data.')
          }
        } catch (e) {
          if (e instanceof Error) {
            console.error('Error occurred while processing LinkedIn job:', e.message)
          } else {
            console.error('An unknown error occurred while processing LinkedIn job.')
          }
        } finally {
          chrome.runtime.sendMessage({ action: 'parseLinkedinJobFinished' })
        }
      }
    })
  }

  timer(3000).then(() => listener())
})()
