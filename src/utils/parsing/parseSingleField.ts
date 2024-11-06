import { Single, DataSingle } from './models'
import { xpath } from '../xpath'

export const parseSingleField = (field: Single, container: HTMLElement) => {
  const data: DataSingle = {
    fieldname: field.fieldname,
    error: {},
    content: '',
  }

  const node = xpath(field.xpath, container)

  if (node === null) {
    data.error = {
      type: 'EmptyResultError',
      fieldname: field.fieldname,
    }
    return data
  }

  if (node instanceof HTMLElement) {
    switch (node.tagName) {
      case 'A': {
        const href = node.getAttribute('href')

        if (href) {
          data.content = href
        }

        break
      }
      case 'VIDEO':
      case 'IMG': {
        const src = node.getAttribute('src')

        if (src) {
          data.content = src
        }

        break
      }
      default: {
        const { textContent } = node

        if (textContent) {
          data.content = textContent
        }

        break
      }
    }
  }

  data.content = data.content.trim()

  return data
}
