import { convertToNumber } from './convertToNumber'

export const countPages = () => {
  const strCount = document.querySelector('.zp_VVYZh')
  let contacts = 0
  let currentContactsOnPage = 0

  if (strCount?.textContent) {
    const counts = strCount.textContent.split(' ')
    // eslint-disable-next-line radix
    currentContactsOnPage = parseInt(counts[2])
    contacts = convertToNumber(counts[4])
  }

  return [Math.ceil(currentContactsOnPage / 25), Math.ceil(contacts / 25) + 1]
}
