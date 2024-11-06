import { getRandomInt } from './getRandomInt'

export const imitationScroll = async (element: HTMLElement) => {
  const elementY = element.getBoundingClientRect().top
  const lengthScroll = getRandomInt(100, 150)
  const { scrollY } = window
  const countScroll = Math.floor(elementY / lengthScroll)

  for (let i = 0; i < countScroll; i++) {
    window.scroll({
      top: scrollY + lengthScroll * i,
      behavior: 'smooth',
    })
    // eslint-disable-next-line no-await-in-loop
  }
}
