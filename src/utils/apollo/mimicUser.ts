import { selectCheckbox } from './selectCheckbox'
import { imitationMoveClick } from '../imitationMoveClick'
import { getRandomInt } from '../getRandomInt'

const XPATHS = {
  selectionWindow: '.finder-select-multiple-entities-button',
  selectAllButton: '.zp-menu-item.zp_fZtsJ.zp_pEvFx.zp_tEPsU',
  tableContainer: '.zp_z0WFz.finder-results-list-panel-content',
  checkboxesList: './div/div/div/div/div[2]/div/table//tbody/tr/td[1]/div/div/label',
}

const MIN_DELAY = 50,
  MAX_DELAY = 150,
  MIN_CHECKBOXES = 2,
  MAX_CHECKBOXES = 8

async function doWithDelay<T>(action: () => Promise<T> | T, [min, max] = [MIN_DELAY, MAX_DELAY]) {
  const delay = getRandomInt(min, max)
  const result = action()
  const wait = new Promise<void>((resolve) => setTimeout(() => resolve(), delay))
  await Promise.all([result, wait])
  return result
}

export async function selectAll() {
  try {
    const toggleSelection = document.querySelector(XPATHS.selectionWindow)
    if (toggleSelection instanceof HTMLElement) {
      await doWithDelay(() => imitationMoveClick(toggleSelection))
      const applySelection = document.querySelectorAll(XPATHS.selectAllButton)[1]
      if (applySelection instanceof HTMLElement) {
        await doWithDelay(() => imitationMoveClick(applySelection))
      }
    }
  } catch (e: any) {
    console.error(`[mimicUser.ts] ${e.message}`)
  }
}

type Checkbox = { element: HTMLElement; toggle: () => Promise<void> }
export async function toggleCheckboxes() {
  const tableContainer = document.querySelector(XPATHS.tableContainer)
  if (tableContainer !== null) {
    const checkboxesRaw = document.evaluate(
      XPATHS.checkboxesList,
      tableContainer,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    )
    const checkboxes: Checkbox[] = []
    let i = 0,
      checkbox: Node | null = null
    do {
      checkbox = checkboxesRaw.snapshotItem(i++)
      if (checkbox instanceof HTMLElement) {
        checkboxes.push({
          element: checkbox,
          async toggle() {
            await selectCheckbox(this.element)
          },
        })
      }
    } while (checkbox)

    const checkboxesCount = getRandomInt(MIN_CHECKBOXES, MAX_CHECKBOXES)
    let promise = Promise.resolve()
    for (let i = 0; i < checkboxesCount; i++) {
      const cb = checkboxes.splice(getRandomInt(0, checkboxes.length), 1)[0]
      promise = promise.then(async (pr) => {
        await doWithDelay(() => cb.toggle())
        return pr
      })
    }
  } else {
    console.error('[mimicUser.ts] Элемент tableContainer не найден.')
  }
}
