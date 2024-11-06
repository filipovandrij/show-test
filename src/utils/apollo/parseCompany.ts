/* eslint-disable  */
import { timer } from '../timer'
import { companiesRunning } from '../../chrome/messageBus'
import { Single } from '../parsing/models'
import { Company } from './models'
import { getRandomInt } from '../getRandomInt'
import { initParse } from './initParse'
import { createMetadataCompany } from './dynamicMetadata'
import { checkFieldnameCompany, parseFieldApollo } from './parseFieldApollo'
import api from '../../api'
import { waitUpdatedTable } from './waitUpdatedTable'
import { updateImport } from '../../views/AIFrame/DataImport/Import'
import { toggleCheckboxes, selectAll } from './mimicUser'
import { isCountExceeded } from '../parsingInterruptions'

function incrementPageNumber(url: string) {
  console.log('url', url)

  return url.replace(/(page=)(\d+)/, function (match, p1, p2) {
    const result = p1 + (parseInt(p2, 10) + 1)
    return result
  })
}

const parsingCompanies = async (item: HTMLElement, metadata: Single[]) => {
  const company = {
    apollo_url: '',
  } as Company

  for (let j = 0; j < metadata.length; j++) {
    company[metadata[j].fieldname as keyof Company] = parseFieldApollo(
      metadata[j],
      item,
      checkFieldnameCompany
    )
  }
  return company
}

export const parseCompany = async (
  counts: number,
  idImport: number,
  guid: string,
  minDelay: number,
  maxDelay: number,
  id: number,
  tag_ids?: string[],
  validate?: {
    method: string
    period: any
  }
) => {
  function extractNumber(inputString: string): number | undefined {
    const regex = /of\s+([\d,]+)/
    const match = inputString.match(regex)
    if (match && match[1]) {
      return parseInt(match[1].replace(/,/g, ''), 10)
    } else {
      return undefined
    }
  }

  const element = document.querySelector('.zp_z0WFz.finder-results-list-panel-content')
  if (element !== null) {
    const result = document.evaluate(
      './div/div/div/div/div[3]/div/div[1]/span',
      element,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue
    const text = result?.textContent

    const total = extractNumber(text || '')

    if ((total !== undefined && counts > total) || counts === 0) {
      return await updateImport(id, { total_entities: total })
    } else {
      console.log('the value was specified')
    }
  }

  const metadata = createMetadataCompany()

  let { table, currentPage, pages, stop } = initParse()
  await selectAll()

  let count = 0

  for (let p = currentPage; p < pages; p++) {
    const importId = id
    let current_url = window.location.href
    await updateImport(id, { current_url })

    const items = table.querySelectorAll('tbody > .zp_cWbgJ') as NodeListOf<Element>
    const nextBtn = document.querySelector('[aria-label="right-arrow"]') as HTMLElement
    const companiesOnPage = []
    toggleCheckboxes()

    for (let i = 0; i < items.length; i++, count++) {
      const company = await parsingCompanies(items[i] as HTMLElement, metadata)

      const { id, ...restCompany } = company as Company
      companiesOnPage.push({
        source: 'apollo',
        entity: 'company',
        specific_key: `https://app.apollo.io/#/accounts/${id}`,
        json_data: restCompany,
        import_number: idImport,
        guid,
        tag_ids,
        validate,
      })
      restCompany.apollo_url = `https://app.apollo.io/#/accounts/${id}`

      if (count === counts - 1) {
        await updateImport(importId, { current_url: incrementPageNumber(current_url) })
        await api.savingData(companiesOnPage)
        return
      }
    }

    const cleanEmptyFields = (obj: Record<string, any>) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] === '') {
          delete obj[key]
        }
      })
    }

    companiesOnPage.forEach((company) => {
      cleanEmptyFields(company.json_data)
    })

    await api.savingData(companiesOnPage)

    await updateImport(importId, { current_url: incrementPageNumber(current_url) })

    if (!companiesRunning) {
      stop = true
      break
    }

    if (await isCountExceeded(count)) {
      return {
        stop,
      }
    }
    // await updateImport(id, { current_url: incrementLastParamValue(window.location.href) })
    nextBtn.click()
    if (p !== pages - 1) {
      await waitUpdatedTable(table)
    }
    await timer(getRandomInt(minDelay, maxDelay))
  }

  return {
    stop,
  }
}
