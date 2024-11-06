import { timer } from '../timer'
import { parseField } from '../parsing'
import { ParseInfo } from '../parsing/models'
import { getRandomInt } from '../getRandomInt'
import { xpath } from '../xpath'

const metadata = [
  {
    type: 'single',
    fieldname: 'event_name',
    section: 'profile-head',
    xpath: './section/div[1]/div[2]/div/div[1]/div[1]/h1',
  },
  {
    type: 'single',
    fieldname: 'event_date',
    section: 'profile-head',
    xpath: './section[1]/div[1]/div[2]/div/div[1]/div[1]/div[2]/div/span',
  },
  {
    type: 'single',
    fieldname: 'event_about',
    section: 'profile-head',
    xpath: './section[2]/div/div/div/span[1]',
  },
  {
    type: 'single',
    fieldname: 'event_attendees',
    section: 'profile-head',
    xpath: './section[1]/div[1]/div[2]/div/div[1]/div[1]/div[3]/div/div/div',
  },
  {
    type: 'single',
    fieldname: 'event_img',
    section: 'profile-head',
    xpath: './section[1]/div[1]/div[1]/figure/div/div/img',
  },
  {
    type: 'single',
    fieldname: 'event_video',
    section: 'profile-head',
    xpath: './section[1]/div[1]/div[1]/div/div/div/div/video',
  },
]

export const parseEvent = async () => {
  const main = document.querySelector('main')
  const parsedInfo: ParseInfo = {}

  if (!main) return

  const seeMore = xpath('./section[2]/div/div/div/span[5]/span/a', main)

  if (seeMore instanceof HTMLAnchorElement) {
    const x = seeMore.offsetLeft
    const y = seeMore.offsetTop

    const event = new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
    })
    seeMore.dispatchEvent(event)

    seeMore.click()
  }

  await timer(getRandomInt(1000, 3000))

  for (let i = 0; i < metadata.length; i++) {
    parsedInfo[metadata[i].fieldname] = parseField(metadata[i], main).content
  }

  // eslint-disable-next-line no-console
  console.log(parsedInfo)
  return parsedInfo
}
