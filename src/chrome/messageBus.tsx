/* eslint-disable default-case */
/* eslint-disable import/no-mutable-exports */
import { createRoot } from 'react-dom/client'
import { parsePage } from '../utils/parsing'
import { parsePost } from '../utils/parsePost'
import { parseEvent } from '../utils/parseEvent'
import { parseArticles } from '../utils/parseArticles'
import { parseCompany, parseContacts } from '../utils/apollo'
import { setFramePosition } from '../utils/frames/setFramePosition'
import { setFrameSize } from '../utils/frames/setFrameSize'
import { destroyFrame } from '../utils/frames/destroyFrame'
import { sendFrameMetaUpdateMessage } from '../utils/frames/sendFrameMetaUpdateMessage'
import { sendUpdateStorageSharedDataMessage } from '../utils/frames/sendUpdateStorageSharedDataMessage'
import { addFrame } from './addFrame'
import { parseCommentsPost } from '../utils/parseCommentsPost'
import { toggleFrames } from '../utils/frames/toggleFrames'
import { parseLinkedinJob } from '../utils/parseLinkedinJob'
import { parseLinkedinProfile } from '../utils/parseLinkedinProfile/parseLinkedinProfile'
import { parseSimpleLinkedinProfile } from '../utils/parseSimpleLinkedin'
import { metadataIndeed, parsejob } from '../utils/indeed/indeed'
import { parseSimpleLinkedinCompany } from '../utils/parseSimpleLinkedinCompany/parseSimpleLinkedinCompany'
import { parseZoomInfo } from '../utils/zoomInfo'
import { parseLinkedinCompany } from '../utils/parseLinkedinCompany/parseLinkedinCompany'
import { showModal } from './bgParseModal'
import { CustomDataModal } from '../views/AIFrame/Analyzer/components/jobComponents/CustomData'

let contactsRunning = false
let companiesRunning = false

export { contactsRunning, companiesRunning }
;(() => {
  if (document.body.getAttribute('messageBus')) return
  document.body.setAttribute('messageBus', 'messageBus')
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case 'showModal': {
        showModal()
        break
      }
      case 'customDataModal': {
        const container = document.createElement('div')
        container.style.position = 'fixed'
        container.style.left = '0'
        container.style.top = '0'
        container.style.zIndex = '10000'
        document.body.appendChild(container)
        const root = createRoot(container)
        root.render(<CustomDataModal />)
        break
      }

      case 'stopContactsParse': {
        contactsRunning = false
        // const iframe = document.getElementById("ain-frame") as HTMLElement;
        // iframe.style.height = "100%";
        sendResponse({ apolloRunning: contactsRunning })
        break
      }
      case 'stopCompaniesParse': {
        companiesRunning = false
        // const iframe = document.getElementById("ain-frame") as HTMLElement;
        // iframe.style.height = "100%";
        sendResponse({ apolloRunning: companiesRunning })
        break
      }
      case 'parsePage': {
        const parsedInfo = parsePage(request.meta)
        sendResponse({ parsedInfo })
        break
      }
      case 'parsePosts': {
        parsePost().then((parsedInfo) => sendResponse({ parsedInfo }))
        break
      }
      case 'parseEvent': {
        const parsedInfo = parseEvent()
        sendResponse({ parsedInfo })
        break
      }
      case 'parseArticles': {
        const parsedInfo = parseArticles()
        sendResponse({ parsedInfo })
        break
      }
      case 'parseLinkedinCompany': {
        parseLinkedinCompany(request.url).then((parsedInfo) => sendResponse({ parsedInfo }))
        break
      }
      case 'parseSimpleLinkedinCompany': {
        sendResponse({ parsedInfo: parseSimpleLinkedinCompany(request.url) })
        break
      }
      case 'parseZoomInfo': {
        parseZoomInfo(
          request.count,
          request.importNumber,
          request.guid,
          request.minDelay,
          request.maxDelay
        ).then(() => sendResponse())
        break
      }
      case 'parseLinkedinProfile': {
        parseLinkedinProfile(request.url).then((parsedInfo) => sendResponse({ parsedInfo }))
        break
      }
      case 'parseSimpleLinkedinProfile': {
        sendResponse({ parsedInfo: parseSimpleLinkedinProfile(request.url) })
        break
      }
      case 'parseContactsApollo': {
        contactsRunning = true
        parseContacts(
          request.count,
          request.importNumber,
          request.guid,
          request.minDelay,
          request.maxDelay,
          request.id,
          request.tag_ids,
          request.validate
        ).then((r) => sendResponse(r))
        break
      }
      case 'parseCompaniesApollo': {
        companiesRunning = true
        parseCompany(
          request.count,
          request.importNumber,
          request.guid,
          request.minDelay,
          request.maxDelay,
          request.id,
          request.tag_ids,
          request.validate
        ).then(() => sendResponse())
        break
      }
      case 'parseCommentsPost': {
        parseCommentsPost().then((parsedInfo) => sendResponse({ parsedInfo }))
        break
      }
      case 'parseLinkedinJob': {
        parseLinkedinJob(request.url).then((parsedInfo) => sendResponse({ parsedInfo }))
        break
      }
      case 'parseIndeedJob': {
        sendResponse({ parsedInfo: parsejob(metadataIndeed, request.url) })
        break
      }
      case 'createFrame': {
        addFrame(request.meta)
        break
      }
      case 'destroyFrame': {
        destroyFrame(request.meta)
        break
      }
      case 'setFramePosition': {
        setFramePosition(request.meta)
        break
      }
      case 'setFrameSize': {
        setFrameSize(request.meta)
        break
      }
      case 'storagePutFrame': {
        sendFrameMetaUpdateMessage(request.meta)
        break
      }
      case 'updateStorageSharedData': {
        sendUpdateStorageSharedDataMessage()
        break
      }
      case 'toggleFrames': {
        toggleFrames(addFrame)
        break
      }
      case 'checkUrl': {
        sendResponse({ url: window.location.href })
        break
      }
      case 'fullBodyParse': {
        sendResponse(
          (
            document.evaluate(
              '/html/body',
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            )?.singleNodeValue as HTMLElement
          )?.innerText
        )
        break
      }

      case 'parsePagesApollo': {
        const element = document.querySelector('.zp_z0WFz.finder-results-list-panel-content')
        if (element !== null) {
          const result = document.evaluate(
            './div/div/div/div/div[3]/div/div[1]/span',
            element,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue
          const text = result?.textContent
          const headers = document.querySelectorAll('th')

          const formattedHeadings = Array.from(headers).map((item) => {
            const text = item.innerText.trim()
            return text
          })

          sendResponse({ text, formattedHeadings })
        } else {
          console.error("Элемент '.zp_z0WFz.finder-results-list-panel-content' не найден.")
          sendResponse(null)
        }

        break
      }
    }
    return true
  })
})()
