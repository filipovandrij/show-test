export const getEmailStatus = (node: HTMLElement) => {
  const firstChild = node.children[0]

  if (firstChild.tagName === 'path') {
    return 'Guessed'
  }

  const childrenG = firstChild.children

  if (childrenG.length > 2) {
    if (childrenG[2].tagName === 'g') {
      return 'N/A'
    }

    return childrenG[2].getAttribute('fill') === '#fff' ? 'verified' : 'user managed'
  }
  if (childrenG.length == 1) {
    if (childrenG[0].tagName === 'g') {
      return 'N/A'
    }
  }
  return 'N/A'
}
