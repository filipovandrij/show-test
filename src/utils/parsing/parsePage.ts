import { Meta, ParsedInfo } from './models'
import { findContainer } from './findContainer'
import { parseField } from './parseField'

export const parsePage = (meta: Meta) => {
  const parsedInfo: ParsedInfo = {
    parse_fields: {},
    errors: [],
    user_url: '',
  }
  const fields = meta.parse_fields

  const main = document.querySelector('main')

  for (let i = 0; i < fields.length; i++) {
    const container = findContainer(fields[i].section, <Element>main)
    const parsedData = parseField(fields[i], container)

    if (parsedData?.content) {
      parsedInfo.parse_fields[fields[i].fieldname] = parsedData.content
    } else {
      parsedInfo.errors.push(parsedData.error)
    }
  }
  return parsedInfo
}
