import { createRoot } from 'react-dom/client'
import { xpath } from '../../utils/xpath'
import SalesNavigatorSearchButton from './SalesNavigatorSearchButton'
import { timer } from '../../utils/timer'
;(() => {
  console.log('начинаю2')
  const addSalesButtons = async () => {
    console.log('PHAHFOHASOFI2')
    const storage = await chrome.storage.local.get()
    const caseId = storage.currentCaseId
    const token = storage?.token
    const peopleContainer = document.querySelectorAll('.artdeco-list__item')
    console.log('peopleContainer', peopleContainer)

    for (let i = 0; i < peopleContainer.length; i++) {
      const container = peopleContainer[i]

      const div = container.querySelector(`#react-button-${i}`)
      if (div) div.remove()

      const app = document.createElement('div')
      app.id = `react-button-${i}`

      const buttonContainer = xpath('./div/div/div[2]/div[2]', container) as HTMLElement
      console.log('buttonContainer', buttonContainer)
      buttonContainer?.setAttribute('style', 'grid-auto-flow: row;')
      buttonContainer?.appendChild(app)

      const href = xpath(
        './div/div/div[2]/div[1]/div[1]/div/div[2]/div[1]/div[1]/a',
        container
      ) as HTMLElement

      console.log('href', href)

      if (href) {
        const url = decodeURIComponent(`https://www.linkedin.com${href}`)

        const root = createRoot(app)
        root.render(<SalesNavigatorSearchButton caseId={caseId} url={url} token={token} />)
      }
    }
  }
  const handleMessage = (message: any) => {
    if (message.type === 'CHECK_BUTTONS') {
      addSalesButtons()
    }
  }
  chrome.runtime.onMessage.addListener(handleMessage)

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.currentCaseId) {
      console.log('Case ID has changed:', changes.currentCaseId.newValue)
      addSalesButtons()
    }
  })

  timer(3000).then(() => addSalesButtons())
})()
