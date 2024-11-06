import { createRoot } from 'react-dom/client'
import { timer } from '../../utils/timer'
import LinkedinSearchButton from './linkedinSearchButton'
import { xpath } from '../../utils/xpath'
;(() => {
  // const observer = new MutationObserver(async (mutationsList) => {
  //   const storage = await chrome.storage.local.get()
  //   const caseId = storage.currentCaseId
  //   console.log('render')
  //   for (const mutation of mutationsList) {
  //     if (mutation.type === 'childList' && mutation.addedNodes.length) {
  //       mutation.addedNodes.forEach((node) => {
  //         if (node instanceof HTMLElement && node.id === 'ain-frame') {
  //           chrome.runtime.sendMessage({
  //             action: 'createMainFrame',
  //           })

  //           setTimeout(() => {
  //             chrome.runtime.sendMessage({
  //               action: 'navigate',
  //               url: `/analyzer/${caseId}`,
  //             })
  //           }, 2000)
  //         }
  //       })
  //     }
  //   }
  // })

  // const config = {
  //   childList: true,
  //   subtree: true,
  // }

  // observer.observe(document.documentElement, config)

  const addButtons = async () => {
    const storage = await chrome.storage.local.get()
    const caseId = storage.currentCaseId
    const token = storage?.token
    const peopleContainer = document.querySelectorAll('.reusable-search__result-container')
    for (let i = 0; i < peopleContainer.length; i++) {
      const container = peopleContainer[i]
      const haveName = xpath('./div/div/div/div[2]/div/div[1]/div/span/span/a', container)

      if (haveName && haveName.textContent && haveName.textContent.trim() === 'LinkedIn Member') {
        continue
      }

      const div = container.querySelector(`#react-button-${i}`)
      if (div) div.remove()

      const app = document.createElement('div')
      app.id = `react-button-${i}`

      const buttonContainer = container.querySelector(
        '.entity-result__actions.entity-result__divider'
      )
      buttonContainer?.setAttribute('style', 'grid-auto-flow: row;')
      buttonContainer?.appendChild(app)

      const image = container.querySelector('.app-aware-link')
      const href = image?.getAttribute('href')

      if (href) {
        const url = decodeURIComponent(`${href.split('?')[0]}/`)

        const root = createRoot(app)
        root.render(<LinkedinSearchButton caseId={caseId} url={url} token={token} />)
      }
    }
  }
  const handleMessage = (message: any) => {
    if (message.type === 'CHECK_BUTTONS') {
      addButtons()
    }
  }
  chrome.runtime.onMessage.addListener(handleMessage)

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.currentCaseId) {
      addButtons()
    }
  })

  timer(3000).then(() => addButtons())
})()
