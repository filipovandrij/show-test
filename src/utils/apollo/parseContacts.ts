/* eslint-disable  */
import { Single } from '../parsing/models'
import { timer } from '../timer'
import { contactsRunning } from '../../chrome/messageBus'
import { Contact } from './models'
import { getRandomInt } from '../getRandomInt'
import { initParse } from './initParse'
import { createMetadataContact, newXpathContact, newXpathContactForNet } from './dynamicMetadata'
import { checkFieldnameContact, parseFieldApollo } from './parseFieldApollo'
import api from '../../api'
import { updateImport } from '../../views/AIFrame/DataImport/Import'
import { waitUpdatedTable } from './waitUpdatedTable'
import { toggleCheckboxes, selectAll } from './mimicUser'
import { isCountExceeded } from '../parsingInterruptions'

function incrementPageNumber(url: string) {
  console.log('url', url)

  return url.replace(/(page=)(\d+)/, function (match, p1, p2) {
    const result = p1 + (parseInt(p2, 10) + 1)
    return result
  })
}

const parsingContacts = async (item: HTMLElement, metadata: Single[]) => {
  const contact = {
    apollo_url: '',
  } as Contact

  for (let j = 0; j < metadata.length; j++) {
    contact[metadata[j].fieldname as keyof Contact] = parseFieldApollo(
      metadata[j],
      item,
      checkFieldnameContact
    )
  }
  return contact
}

export const parseContacts = async (
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
  const linkSaved = document.querySelector(
    '.zp-tabs.pipeline-tabs > a:nth-of-type(3)'
  ) as HTMLElement

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

  const xpathContact = newXpathContact
  const metadata = createMetadataContact(xpathContact)
  let { table, currentPage, pages, stop } = initParse()
  await selectAll()
  let count = 0

  for (let p = currentPage; p < pages; p++) {
    const importId = id
    let current_url = window.location.href
    await updateImport(importId, { current_url })
    const items = table.querySelectorAll('tbody > .zp_cWbgJ') as NodeListOf<Element>
    const nextBtn = document.querySelector('[aria-label="right-arrow"]') as HTMLElement
    const contactsOnPage = []
    toggleCheckboxes()

    for (let i = 0; i < items.length; i++, count++) {
      if (!contactsRunning) {
        await api.savingData(contactsOnPage)

        await updateImport(importId, { current_url: incrementPageNumber(current_url) })
        return {
          stop: true,
        }
      }

      const contact = await parsingContacts(items[i] as HTMLElement, metadata)

      const { id, ...restContact } = contact as Contact
      contactsOnPage.push({
        source: 'apollo',
        entity: 'profile',
        specific_key: `https://app.apollo.io/#/contacts/${id}`,
        json_data: restContact,
        import_number: idImport,
        guid,
        tag_ids,
        validate,
      })
      restContact.apollo_url = `https://app.apollo.io/#/accounts/${id}`

      if (count === counts - 1) {
        await api.savingData(contactsOnPage)
        await updateImport(importId, { current_url: incrementPageNumber(current_url) })
        return {
          stop,
        }
      }
    }

    const cleanEmptyFields = (obj: Record<string, any>) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] === '') {
          delete obj[key]
        }
      })
    }

    contactsOnPage.forEach((contact) => {
      cleanEmptyFields(contact.json_data)
    })

    await api.savingData(contactsOnPage)

    await updateImport(importId, {
      current_url: incrementPageNumber(current_url),
      last_timestamp: Date.now(),
    })

    if (await isCountExceeded(count)) {
      return {
        stop,
      }
    }

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
