export function showModal() {
  const overlay = document.createElement('div')
  overlay.style.position = 'fixed'
  overlay.style.zIndex = '999'
  overlay.style.left = '0'
  overlay.style.top = '0'
  overlay.style.width = '100%'
  overlay.style.height = '100%'
  overlay.style.backgroundColor = 'rgba(0,0,0,0.5)'
  overlay.style.display = 'flex'
  overlay.style.justifyContent = 'center'
  overlay.style.alignItems = 'center'

  const modal = document.createElement('div')
  modal.id = 'myModal'
  modal.style.width = '232px'
  modal.style.height = '175px'
  modal.style.borderRadius = '8px'
  modal.style.backgroundColor = 'white'
  modal.style.position = 'fixed'
  modal.style.zIndex = '1000'
  modal.style.left = '50%'
  modal.style.top = '50%'
  modal.style.transform = 'translate(-50%, -50%)'
  modal.style.display = 'flex'
  modal.style.flexDirection = 'column'
  modal.style.justifyContent = 'center'
  modal.style.alignItems = 'center'
  modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
  overlay.appendChild(modal)

  const grabBar = document.createElement('div')
  grabBar.style.width = '57px'
  grabBar.style.height = '5px'
  grabBar.style.borderRadius = '8px'
  grabBar.style.backgroundColor = '#F2F2F2'
  grabBar.style.margin = '5px auto'
  grabBar.style.cursor = 'grabbing'
  modal.appendChild(grabBar)

  const contentBox = document.createElement('div')
  contentBox.style.backgroundColor = '#F2F2F2'
  contentBox.style.width = '212px'
  contentBox.style.height = '142px'
  contentBox.style.padding = '6px'
  contentBox.style.borderRadius = '4px'
  contentBox.style.display = 'flex'
  contentBox.style.flexDirection = 'column'
  contentBox.style.justifyContent = 'space-between'
  modal.appendChild(contentBox)

  // Header section with logo and control buttons
  const header = document.createElement('div')
  header.style.display = 'flex'
  header.style.justifyContent = 'space-between'
  contentBox.appendChild(header)

  const logoAndTitle = document.createElement('div')
  logoAndTitle.style.display = 'flex'
  logoAndTitle.style.alignItems = 'center'
  header.appendChild(logoAndTitle)

  // const logo = new Image()
  // logo.src = Logo
  // logo.alt = 'logo'
  // logo.style.height = '30px'
  // logoAndTitle.appendChild(logo)

  const title = document.createElement('span')
  title.textContent = 'AIDE'
  title.style.color = '#AB47BC'
  title.style.fontSize = '18px'
  title.style.fontWeight = '700'
  title.style.lineHeight = '26px'
  title.style.marginLeft = '8px'
  logoAndTitle.appendChild(title)

  const controlButtons = document.createElement('div')
  controlButtons.style.display = 'flex'
  controlButtons.style.gap = '12px'
  header.appendChild(controlButtons)

  // const pauseButton = new Image()
  // pauseButton.src = pause
  // pauseButton.alt = 'pause'
  // pauseButton.style.width = '12px'
  // controlButtons.appendChild(pauseButton)

  // const stopButton = new Image()
  // stopButton.src = stop
  // stopButton.alt = 'stop'
  // stopButton.style.width = '12px'
  // controlButtons.appendChild(stopButton)

  // Progress bar
  // const progressBarContainer = document.createElement('div')
  // progressBarContainer.style.backgroundColor = '#D9D9D9'
  // progressBarContainer.style.borderRadius = '5px'
  // progressBarContainer.style.width = '100%'
  // progressBarContainer.style.height = '10px'
  // progressBarContainer.style.margin = '10px 0 5px'
  // contentBox.appendChild(progressBarContainer)

  // const progressBar = document.createElement('div')
  // progressBar.style.backgroundColor = '#AB47BC'
  // progressBar.style.width = '84%' // Set the width based on progress value
  // progressBar.style.height = '100%'
  // progressBar.style.borderRadius = '5px'
  // progressBarContainer.appendChild(progressBar)

  // Status text
  const statusText = document.createElement('div')
  statusText.textContent = 'Import processing '
  statusText.style.fontSize = '13px'
  statusText.style.fontWeight = '400'
  statusText.style.lineHeight = '20px'
  statusText.style.color = '#9E9E9E'
  statusText.style.textAlign = 'left'
  contentBox.appendChild(statusText)

  // Check status button
  // const checkStatusButton = document.createElement('button')
  // checkStatusButton.textContent = 'Check Status'
  // checkStatusButton.style.marginTop = '10px'
  // checkStatusButton.style.width = '100%'
  // checkStatusButton.style.height = '36px'
  // checkStatusButton.style.border = 'none'
  // checkStatusButton.style.borderRadius = '4px'
  // checkStatusButton.style.fontSize = '14px'
  // checkStatusButton.style.fontWeight = '400'
  // checkStatusButton.style.lineHeight = '18px'
  // checkStatusButton.style.textAlign = 'center'
  // checkStatusButton.style.backgroundColor = '#AB47BC'
  // checkStatusButton.style.color = 'white'
  // contentBox.appendChild(checkStatusButton)

  document.body.appendChild(overlay)
}
