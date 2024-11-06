import { Field } from './models'
import { parseSingleField } from './parseSingleField'
import { parseListField } from './parseListField'
import { parseNestedListField } from './parseNestedListField'

function convertToMilliseconds(inputDate: string) {
  const timeUnits: { [unit: string]: number } = {
    ms: 1,
    s: 1000,
    h: 3600000,
    d: 86400000,
    w: 604800000,
    mo: 2592000000,
    yr: 31536000000,
  }
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const timeNow = Date.now()

  if (inputDate.toLowerCase() === 'present') {
    return timeNow
  }

  const standardFormatMatch = inputDate.match(/^(\d+)([a-z]+)$/i)
  const yearFormatMatch = inputDate.match(/^(\d{4})$/)
  if (standardFormatMatch) {
    const number = parseInt(standardFormatMatch[1], 10)
    const unit = standardFormatMatch[2]

    if (unit in timeUnits) {
      return timeNow - number * timeUnits[unit]
    }
  }

  if (yearFormatMatch) {
    const year = parseInt(yearFormatMatch[1], 10)
    const startOfYear = new Date(year, 0)
    return startOfYear.getTime()
  }

  const monthYearFormatMatch = inputDate.match(/^([A-Za-z]+)\s(\d{4})$/)
  if (monthYearFormatMatch) {
    const monthIndex = monthNames.indexOf(monthYearFormatMatch[1])
    const year = parseInt(monthYearFormatMatch[2], 10)

    if (monthIndex !== -1) {
      const date = new Date(year, monthIndex)
      return date.getTime()
    }
  }

  return null
}

function extractAndAssignValue(
  inputText: any,
  key: string,
  regexPattern: any,
  extractedValues: any
) {
  const cleanedString = inputText.trim().replace(/\s+/g, ' ')
  const regex = regexPattern

  const match = regex.exec(cleanedString)

  if (match !== null) {
    if (key === 'specialties') {
      const specialtiesString = match[1]
      const specialitiesArray = specialtiesString
        .split(', ')
        .map((speciality: any) => ({ speciality }))
      extractedValues[key] = specialitiesArray
    } else {
      extractedValues[key] = match[1]
    }
  }
}

export const parseField = (field: Field, container: HTMLElement | null | undefined) => {
  if (!container) {
    return {
      fieldname: field.fieldname,
      error: {
        type: 'BadContainer',
        fieldname: field.fieldname,
      },
      content: '',
    }
  }

  const parseList: { [key: string]: Function } = {
    single: parseSingleField,
    list: parseListField,
    nested_list: parseNestedListField,
  }

  const result = parseList[field.type](field, container) || {
    fieldname: field.fieldname,
    error: {
      type: 'UnknownField',
      fieldname: field.fieldname,
    },
    content: '',
  }

  if (result.content && field.fieldname === 'jobs') {
    result.content = result.content.filter((obj: any) => Object.keys(obj).length !== 0)
  }

  if (result.content && field.fieldname === 'aboutcompany') {
    const extractedValues: any = {}
    const cleanedString = result.content.trim().replace(/\s+/g, ' ')
    const websiteRegex =
      /Website\s+(.*?)\s+(?:Industry|Phone|employees|members|Headquarters|Specialties)/g
    extractAndAssignValue(cleanedString, 'website', websiteRegex, extractedValues)

    const phoneRegex =
      /Phone\s+(.*?)\s+(?:Phone|Industry|employees|members|Headquarters|Specialties)/g
    extractAndAssignValue(cleanedString, 'phone', phoneRegex, extractedValues)

    const industryRegex =
      /Industry\s+(.*?)\s+(?:Company size|Phone|employees|members|Headquarters|Specialties)/g
    extractAndAssignValue(cleanedString, 'industry', industryRegex, extractedValues)

    const employeesRegex = /size\s+(.*?)\s+(?:employees)/g
    extractAndAssignValue(cleanedString, 'employees', employeesRegex, extractedValues)

    const membersRegex = /employees\s+(.*?)\s+(?:associated)/g
    extractAndAssignValue(cleanedString, 'members', membersRegex, extractedValues)

    const foundedRegex = /Founded\s+(.*?)\s+(?:Specialties|$)/g
    extractAndAssignValue(cleanedString, 'founded', foundedRegex, extractedValues)

    const headquartersRegex = /Headquarters\s+(.*?)\s+(?:Specialties|$)/g
    extractAndAssignValue(cleanedString, 'headquarters', headquartersRegex, extractedValues)

    const specialtiesRegex = /Specialties\s+([\s\S]*)$/g
    extractAndAssignValue(cleanedString, 'specialties', specialtiesRegex, extractedValues)
    result.content = extractedValues
    return result
  }

  if (result.content && Array.isArray(result.content)) {
    result.content = result.content.map(
      (item: {
        end_date: any
        date: any
        start_date: any
        positions: any
        work_format: any
        followers: any
        recommendations: any
        given: any
        url: any
        company_name: any
      }) => {
        const processWorkFormat = (workFormat: any) => {
          if (workFormat && typeof workFormat === 'string' && workFormat.includes(' · ')) {
            const parts = workFormat.split(' · ')
            return parts.length > 1 ? parts[1].trim() : null
          }
          return null
        }

        if (item.start_date && typeof item.start_date === 'string') {
          item.start_date = convertToMilliseconds(item.start_date.split(' - ')[0])
        }

        if (item.end_date && typeof item.end_date === 'string') {
          item.end_date = convertToMilliseconds(item.end_date.split(' - ')[1].split(' \u00B7')[0])
        }
        if (item.company_name && typeof item.company_name === 'string') {
          const parts = item.company_name.split('·')
          item.company_name = parts[0].trim()
        }

        if (item.date && typeof item.date === 'string') {
          item.date = convertToMilliseconds(item.date)
        }

        if (item.url && typeof item.url === 'string') {
          item.url = `https://www.linkedin.com${item.url}`
        }

        if (item.positions && Array.isArray(item.positions)) {
          item.positions = item.positions.filter((pos) => Object.keys(pos).length > 0)

          if (item.positions.length === 0) {
            delete item.positions
          }
        }

        if (item.positions && Array.isArray(item.positions)) {
          item.positions.forEach((pos) => {
            if (pos.start_date && typeof pos.start_date === 'string') {
              pos.start_date = convertToMilliseconds(pos.start_date.split(' - ')[0])
            }

            if (pos.end_date && typeof pos.end_date === 'string') {
              const endDateParts = pos.end_date.split(' - ')
              if (endDateParts.length > 1) {
                const endDate = endDateParts[1].split(' \u00B7')[0]
                pos.end_date = convertToMilliseconds(endDate)
              } else {
                pos.end_date = 1111111111
              }
            }

            if (pos.work_format) {
              pos.work_format = processWorkFormat(pos.work_format)
            }
          })
        }

        if (item.work_format) {
          item.work_format = processWorkFormat(item.work_format)
        }

        if (item.followers && typeof item.followers === 'string') {
          const followersNumber = parseInt(item.followers.replace(/[^0-9]/g, ''), 10)
          item.followers = followersNumber
        }

        return item
      }
    )
  }

  return result
}
