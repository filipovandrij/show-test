import { xpath } from '../xpath'

export const getLinkedinId = () => {
  const code = xpath('.//*[contains(text(), "*elements")][2]', document.body)
  let id = ''
  if (code && code.textContent && JSON.parse(code.textContent).data['*elements'][0]) {
    id = `https://www.linkedin.com/in/${JSON.parse(code.textContent).data['*elements'][0].slice(
      19
    )}`
  }
  return id
}
