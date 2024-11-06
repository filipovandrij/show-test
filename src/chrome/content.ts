export {}
;(() => {
  const frame = document.getElementById('ain-frame')

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'closeMainFrame') {
      const frameToRemove = document.getElementById('ain-frame')
      if (frameToRemove) {
        frameToRemove.remove()
      }
    }

    if (request.action === 'togglePluginPosition') {
      const iframe = document.getElementById('ain-frame')
      if (!iframe) return

      const newPosition = request.position === 'left' ? 'left' : 'right'
      localStorage.setItem('pluginPosition', newPosition)

      const iframeStyle =
        newPosition === 'left'
          ? `left: 0; width: 460px; height: 99%; z-index: 2147483650; border: none; position: fixed; top: 0; border-radius: 15px; background:#ECECEC; margin: 4px;
    box-shadow: 0 0 10px rgb(0 0 0 / 75%);`
          : `right: 0; width: 460px; height: 99%; z-index: 2147483650; border: none; position: fixed; top: 0; border-radius: 15px; background:#ECECEC; margin: 4px;
    box-shadow: 0 0 10px rgb(0 0 0 / 75%);`

      iframe.setAttribute('style', iframeStyle)
    }
  })

  if (frame) {
    frame.remove()
    return
  }

  const iframe = document.createElement('iframe')
  iframe.setAttribute('id', 'ain-frame')
  iframe.setAttribute('title', 'ain-frame')

  const savedPosition = localStorage.getItem('pluginPosition') || 'right' // По умолчанию справа
  const iframeStyle =
    savedPosition === 'left'
      ? `left: 0; width: 460px; height: 99%; z-index: 2147483650; border: none; position: fixed; top: 0; border-radius: 15px; background:#ECECEC; margin: 4px;
    box-shadow: 0 0 10px rgb(0 0 0 / 75%);`
      : `right: 0; width: 460px; height: 99%; z-index: 2147483650; border: none; position: fixed; top: 0; border-radius: 15px; background:#ECECEC; margin: 4px;
    box-shadow: 0 0 10px rgb(0 0 0 / 75%);`

  iframe.setAttribute('style', iframeStyle)
  iframe.setAttribute('allow', 'clipboard-read; clipboard-write')
  iframe.src = chrome.runtime.getURL('index.html')

  iframe.onload = function () {
    setTimeout(() => {
      chrome.runtime.sendMessage({ frameType: 'main', frameId: 'ain-frame' })

      // if (isLinkedInSearchPage) {
      //   const applicationOutlet = document.querySelector('.application-outlet')
      //   if (applicationOutlet && applicationOutlet instanceof HTMLElement) {
      //     applicationOutlet.style.width = '85%'
      //     applicationOutlet.style.float = 'right'
      //   }

      //   const globalNav = document.getElementById('global-nav')
      //   if (globalNav && globalNav instanceof HTMLElement) {
      //     globalNav.style.width = '70%'
      //     globalNav.style.marginLeft = '500px'
      //   }
      // }
    }, 100)
  }

  document.documentElement.appendChild(iframe)
})()
