export const xpath = (expression: string, container: HTMLElement | Element | Document) => {
  return document.evaluate(expression, container, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue
}
