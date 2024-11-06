/* eslint-disable no-await-in-loop */
import api from '../../api'
import { imitationMoveClick } from '../imitationMoveClick'
import { imitationScroll } from '../imitationScroll'
import { metadataDetailAboutCompany } from '../metadataLinkedin/metadataCompanyDetail/about'
import { metadataDetailJobsCompany } from '../metadataLinkedin/metadataCompanyDetail/jobs'
import { metadataSimpleAboutCompany } from '../metadataLinkedin/metadataCompanySimple/about'
import { metadataSimpleJobsCompany } from '../metadataLinkedin/metadataCompanySimple/jobs'
import { parseCompany } from '../parseCompany'
import { ConditionalMetadata } from '../parseLinkedinProfile'
import { parse } from '../parseLinkedinProfile/parse'
import { parseDetail } from '../parseLinkedinProfile/parseDetail'
import { xpath } from '../xpath'

// Here, LinkedIn Company full-parsing is performed using simple functions to extract information based on specific XPaths stored in metadata or conditions for retrieving data between regular expression patterns.

const metadata: { [k: string]: ConditionalMetadata } = {
  about: { simple: metadataSimpleAboutCompany, detail: metadataDetailAboutCompany },
  jobs: { simple: metadataSimpleJobsCompany, detail: metadataDetailJobsCompany },
}

const findHeader = (section: HTMLElement) => {
  const header1 = xpath('./div/header/h2', section)
  const header2 = xpath('./div/h3', section)

  let word = header1 && header1.textContent?.trim()

  if (!word) {
    word = header2 && 'jobs'
  }

  return word && word.toLowerCase()
}

const handleParse = async (
  section: HTMLElement,
  main: HTMLElement,
  sections: NodeListOf<HTMLElement>,
  metadata: any,
  metadataDetail?: any
) => {
  const detailAnchor = xpath('.//a[contains(@aria-label, "all")]', section)
  let result: any = {}

  if (detailAnchor instanceof HTMLElement && metadataDetail) {
    await imitationMoveClick(detailAnchor)
    result = await parseDetail(metadataDetail)

    main = document.querySelector('main') as HTMLElement
    sections = main.querySelectorAll(':scope > section')
  } else {
    result = Array.isArray(metadata)
      ? metadata.reduce((acc, item) => {
          acc[item.fieldname] = parse(section, item)
          return acc
        }, {})
      : parse(section, metadata)
  }

  return { result, main, sections }
}

export const parseLinkedinCompany = async (url: string) => {
  const info: any = {
    specific_key: url,
    source: 'linkedin',
    upload_method: 'full_parse',
    entity: 'company',
    json_data: {
      company_data: parseCompany(),
      specific_key: url,
    },
  }

  let main = document.querySelector('main') as HTMLElement

  let sections = main.querySelectorAll(':scope  section') as NodeListOf<HTMLElement>

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i]

    await imitationScroll(section)

    const title = findHeader(section)

    if (title && metadata[title]) {
      const currentMetadata = metadata[title]

      const res = await handleParse(
        section,
        main,
        sections,
        currentMetadata.simple,
        currentMetadata?.detail
      )
      main = res.main
      sections = res.sections
      info.json_data[title] = res.result
    }
    main = document.querySelector('main') as HTMLElement
    sections = main.querySelectorAll(':scope  section') as NodeListOf<HTMLElement>
  }

  await api.savingData(info)

  return info
}
