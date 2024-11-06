import { DataList, NestedList } from './models'
import { xpath } from '../xpath'

type ContentItem = { [key: string]: any }

export const parseNestedListField = (field: NestedList, container: HTMLElement) => {
  const data: DataList<ContentItem> = {
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
    const parsedItem: ContentItem = {}

    for (let j = 0; j < field.path_list.length; j++) {
      const pathItem = field.path_list[j]

      if (typeof pathItem === 'object' && 'fieldname' in pathItem) {
        parsedItem[pathItem.fieldname] =
          parseNestedListField(pathItem, list[i] as HTMLElement).content || '-'
      } else {
        const item = xpath(pathItem.path, list[i])

        if (item instanceof HTMLElement) {
          switch (item.tagName) {
            case 'A': {
              const href = item.getAttribute('href')

              if (href && !parsedItem[pathItem.attribute_name]) {
                parsedItem[pathItem.attribute_name] = href.trim()
              }

              break
            }
            case 'VIDEO':
            case 'IMG': {
              const src = item.getAttribute('src')

              if (src && !parsedItem[pathItem.attribute_name]) {
                parsedItem[pathItem.attribute_name] = src.trim()
              }

              break
            }
            default: {
              const { textContent } = item

              if (textContent && !parsedItem[pathItem.attribute_name]) {
                parsedItem[pathItem.attribute_name] = textContent.trim()
              }

              break
            }
          }
        }
      }
    }

    if (parsedItem) {
      data.content.push(parsedItem)
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
