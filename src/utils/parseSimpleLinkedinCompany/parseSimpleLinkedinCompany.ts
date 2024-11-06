import { metadataSimpleAboutCompany } from '../metadataLinkedin/metadataCompanySimple/about'
import { metadataSimpleJobsCompany } from '../metadataLinkedin/metadataCompanySimple/jobs'
import { parseCompany } from '../parseCompany'
import { parse } from '../parseLinkedinProfile/parse'
import { Field } from '../parsing/models'
import { xpath } from '../xpath'

// Here, LinkedIn Company quick-parsing is performed using simple functions to extract information based on specific XPaths stored in metadata or conditions for retrieving data between regular expression patterns.

export const parseSimpleLinkedinCompany = (url: string) => {
  const info: any = {
    specific_key: url,
    source: 'linkedin',
    upload_method: 'quick_parse',
    entity: 'company',
    json_data: {
      company_data: parseCompany(),
      specific_key: url,
    },
  }

  const main = document.querySelector('main') as HTMLElement

  const sections = main.querySelectorAll(':scope  section') as NodeListOf<HTMLElement>

  const findHeader = (section: HTMLElement) => {
    const header1 = xpath('./div/header/h2', section)
    const header2 = xpath('./div/h3', section)

    let word = header1 && header1.textContent?.trim()

    if (!word) {
      word = header2 && 'jobs'
    }

    return word && word.toLowerCase()
  }

  const metadata: { [k: string]: Field | Field[] } = {
    about: metadataSimpleAboutCompany,
    jobs: metadataSimpleJobsCompany,
  }

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i]

    const title = findHeader(section)

    if (title && metadata[title]) {
      const currentMetadata = metadata[title]
      info.json_data[title] = Array.isArray(currentMetadata)
        ? currentMetadata.reduce((acc: any, item) => {
            acc[item.fieldname] = parse(section, item)
            return acc
          }, {})
        : parse(section, currentMetadata)
    }
  }

  return info
}
