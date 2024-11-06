export const getNodeContent = (node: Node | null) => {
  if (!(node instanceof HTMLElement)) {
    return null
  }
  switch (node.tagName) {
    case 'A': {
      return node.getAttribute('href')
    }
    case 'VIDEO':
    case 'IMG': {
      return node.getAttribute('src')
    }
    default: {
      return node.textContent?.trim()
    }
  }
}
