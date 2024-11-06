import { DataList, List } from './models'
import { xpath } from '../xpath'

export const parseListField = (field: List, container: HTMLElement) => {
  const data: DataList<string> = {
    content: [],
    fieldname: field.fieldname,
    error: {},
  }

  const parent = xpath(field.xpath, container) as Element

  if (parent === null) {
    data.error = {
      type: 'EmptyParentReturn',
      fieldname: field.fieldname,
    }
    return data
  }

  const list = parent.querySelectorAll(field.li_selector)
  if (list === null || list.length === 0) {
    data.error = {
      type: 'EmptyListReturnError',
      fieldname: field.fieldname,
    }
    return data
  }

  for (let i = 0; i < list.length; i++) {
    const item = xpath(field.itempath, list[i])

    if (item) {
      if (item.textContent) {
        data.content.push(item.textContent)
      }
    }
  }

  if (data.content.length === 0) {
    data.error = {
      type: 'EmptyResultError',
      fieldname: field.fieldname,
    }
    return data
  }

  return data
}
