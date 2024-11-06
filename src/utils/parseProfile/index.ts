// @ts-nocheck

import { parseField } from '../parsing'
import { Field, ParseInfo } from '../parsing/models'

const metadata = [
  {
    type: 'single',
    fieldname: 'name',
    section: 'profile-head',
    xpath: './div[2]/div[2]/div[1]/div[1]/span[1]/a/h1',
  },
  {
    type: 'single',
    fieldname: 'title',
    section: 'profile-head',
    xpath: './div[2]/div[2]/div[1]/div[2]',
  },
  {
    type: 'single',
    fieldname: 'location',
    section: 'profile-head',
    xpath: './div[2]/div[2]/div[2]/span[1]',
  },
  {
    type: 'single',
    fieldname: 'talks',
    section: 'profile-head',
    xpath: './div[2]/div[2]/div[1]/div[3]/span[1]',
  },
  {
    type: 'single',
    fieldname: 'talks',
    section: 'profile-head',
    xpath: './div[2]/div[2]/div[1]/div[4]/span[1]',
  },
  {
    type: 'single',
    fieldname: 'connected',
    section: 'profile-head',
    xpath: './/div[2]/ul/li[2]/span/span',
  },
  {
    type: 'single',
    fieldname: 'followers',
    section: 'profile-head',
    xpath: './div[2]/ul/li[1]/span',
  },
  {
    type: 'single',
    fieldname: 'providingServices',
    section: 'profile-head',
    xpath: './div[4]/section/div/a[h3/strong[contains(text(), "Providing")]]/p',
  },
]

// const loopParse = (metaInfo: Field[], section: HTMLElement, parsedInfo: ParseInfo) => {
//   for (let i = 0; i < metaInfo.length; i++) {
//     const { fieldname } = metaInfo[i]
//     const parseResult = parseField(metaInfo[i], section).content

//     if (!parsedInfo[fieldname] && parseResult) {
//       // if (fieldname === 'name') {
//       //     const [name, surname] = parseResult.split(' ');
//       //     parsedInfo.name = name;
//       //     parsedInfo.surname = surname;
//       // } else {
//       parsedInfo[fieldname] = parseResult
//       // }
//     }
//   }
// }

const loopParse = (metaInfo: Field[], section: HTMLElement, parsedInfo: ParseInfo) => {
  let words = null
  let region = null
  let city = null
  let country = null
  let state = null
  let followers = null
  for (let i = 0; i < metaInfo.length; i++) {
    const { fieldname } = metaInfo[i]
    const parseResult = parseField(metaInfo[i], section).content

    if (!parsedInfo[fieldname] && parseResult) {
      switch (fieldname) {
        case 'name':
          words = parseResult.split(' ')
          parsedInfo.full_name = parseResult
          parsedInfo.first_name = words[0]
          parsedInfo.last_name = words[words.length - 1]
          break
        case 'location':
          ;[region, city, country, state] = parseResult.split(', ')
          parsedInfo.location = {
            region: region || null,
            city: city || null,
            country: country || null,
            state: state || null,
          }
          break
        case 'followers':
          followers = parseInt(parseResult.replace(',', ''), 10)
          parsedInfo.followers = isNaN(followers) ? 0 : followers
          break
        default:
          parsedInfo[fieldname] = parseResult
          break
      }
    }
  }
}

export const parseProfile = () => {
  const main = document.querySelector('main')
  const parsedInfo: ParseInfo = {}

  if (main) {
    const section = main.querySelector(':scope > section') as HTMLElement
    loopParse(metadata, section, parsedInfo)
  }

  return parsedInfo
}
