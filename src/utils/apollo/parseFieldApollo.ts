import { Single } from '../parsing/models'
import { getEmailStatus } from './getEmailStatus'
import { xpath } from '../xpath'

function isDateRelatedString(str: string): boolean {
  const regex = /^(a|an|\d+)\s+(day|month|year)s?\s+ago$/
  return regex.test(str)
}

function convertToTimestamp(timeAgo: string): number {
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  const dateToConvert = new Date(currentDate)

  const timeValue = timeAgo.split(' ')[0]
  const timeUnit = timeAgo.split(' ')[1]

  const number = timeValue === 'a' || timeValue === 'an' ? 1 : parseInt(timeValue, 10)

  if (timeUnit.startsWith('day')) {
    dateToConvert.setDate(currentDate.getDate() - number)
  } else if (timeUnit.startsWith('month')) {
    dateToConvert.setMonth(currentDate.getMonth() - number)
  } else if (timeUnit.startsWith('year')) {
    dateToConvert.setFullYear(currentDate.getFullYear() - number)
  }
  return dateToConvert.getTime()
}

export const parseFieldApollo = (
  field: Single,
  container: HTMLElement,
  checkFieldname: (node: HTMLElement, fieldname: string) => string
) => {
  let data: string | number = ''

  const node = xpath(field.xpath, container)

  if (node instanceof HTMLElement) {
    const result = checkFieldname(node, field.fieldname)

    if (result !== 'N/A' && isDateRelatedString(result)) {
      data = convertToTimestamp(result).toString()
    } else {
      data = result === 'N/A' ? '' : result
    }
  }

  if (/^\d+$/.test(data)) {
    data = Number(data)
  } else {
    if (data.includes('@')) {
      data = data.trim()
      return data
    }
    return data
  }
  return data
}

export const checkFieldnameContact = (node: HTMLElement, fieldname: string) => {
  let data = '-'
  switch (fieldname) {
    case 'status_email': {
      data = getEmailStatus(node.firstChild as HTMLElement)
      break
    }
    case 'id': {
      const href = node.getAttribute('href')

      if (href) {
        data = href.split('/')[2]
      }
      break
    }
    case 'linkedin':
    case 'company_link':
    case 'company_linkedin':
    case 'company_facebook':
    case 'company_twitter': {
      const href = node.getAttribute('href')

      if (href) {
        data = href
      }
      break
    }
    default: {
      const { textContent } = node

      if (textContent) {
        data = textContent
      }
      break
    }
  }
  return data
}

export const checkFieldnameCompany = (node: HTMLElement, fieldname: string) => {
  let data = '-'
  switch (fieldname) {
    case 'id': {
      const href = node.getAttribute('href')

      if (href) {
        data = href.split('/')[2]
      }
      break
    }
    case 'company_link':
    case 'company_linkedin':
    case 'company_facebook':
    case 'company_twitter': {
      const href = node.getAttribute('href')

      if (href) {
        data = href
      }
      break
    }
    default: {
      const { textContent } = node

      if (textContent) {
        data = textContent
      }
      break
    }
  }
  return data
}
