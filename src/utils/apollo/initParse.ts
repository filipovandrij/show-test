import { countPages } from './countPages'
import { checkFilter } from './checkFilter'

export const initParse = () => {
  const table = document.querySelector('table') as HTMLTableElement
  const [currentPage, pages] = countPages()
  const stop = false

  checkFilter()

  return {
    table,
    currentPage,
    pages,
    stop,
  }
}
