import { findContainer, parseField } from '../parsing'
import { ParseInfo } from '../parsing/models'
import { imitationMoveClick } from '../imitationMoveClick'
import { getRandomInt } from '../getRandomInt'
import { timer } from '../timer'

export const metadata = [
  {
    type: 'nested_list',
    fieldname: 'websites',
    section: 'Websites',
    xpath: './ul',
    li_selector: ':scope > li',
    path_list: [{ attribute_name: 'website', path: './a' }],
  },
  {
    type: 'nested_list',
    fieldname: 'IM',
    section: 'IM',
    xpath: './ul',
    li_selector: ':scope > li',
    path_list: [
      { attribute_name: 'nickname', path: './span[1]' },
      { attribute_name: 'messenger', path: './span[2]' },
    ],
  },
  { type: 'single', fieldname: 'email', section: 'Email', xpath: './div/a' },
  { type: 'single', fieldname: 'birthday', section: 'Birthday', xpath: './div/span' },
  { type: 'single', fieldname: 'address', section: 'Address', xpath: './div/a' },
  { type: 'single', fieldname: 'connected', section: 'Connected', xpath: './div/span' },
  { type: 'single', fieldname: 'website', section: 'Website', xpath: './ul/li/a' },
  { type: 'single', fieldname: 'phone', section: 'Phone', xpath: './ul/li/span[1]' },
]

export const parseContactInfo = async () => {
  await timer(getRandomInt(500, 1000))
  const openContactInfo = document.querySelector('#top-card-text-details-contact-info')
  if (openContactInfo instanceof HTMLAnchorElement) await imitationMoveClick(openContactInfo)

  const sectionInfo = document.querySelector('.section-info')
  const parsedInfo: ParseInfo = {}

  if (sectionInfo) {
    for (let i = 0; i < metadata.length; i++) {
      const container = findContainer(metadata[i].section, sectionInfo, './h3')
      const { fieldname } = metadata[i]
      const parseResult = parseField(metadata[i], container).content

      if (!parsedInfo[fieldname] && parseResult) {
        parsedInfo[fieldname] = parseResult
      }
    }
  }

  await timer(getRandomInt(500, 1000))
  const closeBtn = document.querySelector('.artdeco-modal__dismiss')
  if (closeBtn instanceof HTMLButtonElement) await imitationMoveClick(closeBtn)
  return parsedInfo
}
