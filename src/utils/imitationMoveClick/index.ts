// import { timer } from '../timer'
// import { getRandomInt } from '../getRandomInt'

export const imitationMoveClick = async (element: HTMLElement) => {
  const x = element.offsetLeft
  const y = element.offsetTop

  const event = new MouseEvent('mousemove', {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: x,
    clientY: y,
  })

  element.dispatchEvent(event)
  element.click()
  // await timer(getRandomInt(200, 400))
}
