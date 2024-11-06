import { xpath } from '../xpath'

export const findContainer = (
  containerName: string,
  section: Element,
  expression = './/div[2]/div/div/div/h2/span[1]'
) => {
  if (containerName === 'profile-head') {
    return section.querySelector('section')
  }

  const containers = section.querySelectorAll('section')
  for (let i = 0; i < containers.length; i++) {
    const header = xpath(expression, containers[i])

    if (header?.textContent?.trim() === containerName) {
      return containers[i]
    }
  }
}
