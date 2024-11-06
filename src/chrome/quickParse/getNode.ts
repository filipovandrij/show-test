import { isString } from '../../utils/isString'

export const getNode = (xpath: string, container: Node | null) => {
  if (!container) {
    console.error(`Invalid container ${xpath}`)
    return null
  }

  if (!isString(xpath) || xpath.trim() === '') {
    console.error(`Invalid xpath ${xpath}`)
    return null
  }

  return document.evaluate(xpath, container, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue
}
