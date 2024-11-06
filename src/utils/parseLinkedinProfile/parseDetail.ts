import { timer } from '../timer'
import { getRandomInt } from '../getRandomInt'
import { parseField } from '../parsing'

export const parseDetail = async (metadata: any) => {
  await timer(getRandomInt(1000, 2000))
  const main = document.querySelector('main') as HTMLElement

  const parsedInfo = parseField(metadata, main).content || '-'

  await timer(getRandomInt(1500, 2000))
  window.history.back()
  await timer(getRandomInt(1500, 2000))

  return parsedInfo
}
