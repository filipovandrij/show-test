// @ts-nocheck

import { parseField } from '../parsing'
import { Field, ParseInfo } from '../parsing/models'

const metadata = [
  {
    type: 'single',
    fieldname: 'company_name',
    section: 'company-head',
    xpath: './div/div[2]/div[2]/div[1]/div[2]/div/h1',
  },
  {
    type: 'single',
    fieldname: 'title',
    section: 'company-head',
    xpath: './div[2]/div[2]/div[1]/div[2]',
  },
  {
    type: 'single',
    fieldname: 'location',
    section: 'company-head',
    xpath: './div/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[1]',
  },
  {
    type: 'single',
    fieldname: 'followers',
    section: 'company-head',
    xpath: './div/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/div[2]',
  },

  {
    type: 'single',
    fieldname: 'industry',
    section: 'company-head',
    xpath: './div/div[2]/div[2]/div[1]/div[2]/div/div/div[1]',
  },
  {
    type: 'single',
    fieldname: 'employees',
    section: 'company-head',
    xpath: './div/div[2]/div[2]/div[1]/div[2]/div/div/div[2]/a/span',
  },
]

function parseValue(value: string) {
  let multiplier: number = 1
  if (value.includes('K')) {
    multiplier = 1000
    value = value.replace('K', '')
  } else if (value.includes('M')) {
    multiplier = 1000000
    value = value.replace('M', '')
  } else if (value.includes('+')) {
    value = value.replace('+', '')
  }

  const parsedValue = parseFloat(value.replace(',', '')) * multiplier
  return isNaN(parsedValue) ? 0 : parsedValue
}

const loopParse = (metaInfo: Field[], section: HTMLElement, parsedInfo: ParseInfo) => {
  for (let i = 0; i < metaInfo.length; i++) {
    const { fieldname } = metaInfo[i]
    const parseResult = parseField(metaInfo[i], section).content

    if (!parsedInfo[fieldname] && parseResult) {
      switch (fieldname) {
        case 'company_name':
          parsedInfo.company_name = parseResult
          break
        case 'industry':
          parsedInfo.industry = parseResult
          break
        case 'location':
          parsedInfo.location = parseResult
          break
        case 'followers':
          parsedInfo.followers = parseValue(parseResult)
          break
        case 'employees':
          parsedInfo.employees = parseValue(parseResult)
          break
        default:
          parsedInfo[fieldname] = parseResult
          break
      }
    }
  }
}

export const parseCompany = () => {
  const main = document.querySelector('main')
  const parsedInfo: ParseInfo = {}

  if (main) {
    const section = main.querySelector(':scope > div > section') as HTMLElement
    loopParse(metadata, section, parsedInfo)
  }

  return parsedInfo
}
