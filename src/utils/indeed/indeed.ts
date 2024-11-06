import { ParseInfo } from '../parsing/models'
import { parseField } from '../parsing'

export const metadataIndeed = [
  {
    type: 'single',
    fieldname: 'job_title',
    xpath: "//div[contains(@class, 'jobsearch-JobInfoHeader-title-container')]//span",
  },
  {
    type: 'single',
    fieldname: 'company_link',
    xpath: "//div[@data-testid='inlineHeader-companyName']/span/a",
  },
  {
    type: 'single',
    fieldname: 'location',
    xpath: "//div[@data-testid='inlineHeader-companyLocation']/div",
  },
  {
    type: 'single',
    fieldname: 'job_description',
    xpath: "//div[@id='jobDescriptionText']",
  },
  {
    type: 'nested_list',
    fieldname: 'job_details',
    xpath: "//div[@id='jobDetailsSection']",
    li_selector: ':scope > div.css-rr5fiy',
    path_list: [
      {
        attribute_name: 'type',
        path: './div[1]',
      },
      {
        attribute_name: 'value',
        path: "./div[2]//div[contains(@class, 'css-tvvxwd')]",
      },
    ],
  },
]

export const parsejob = (metaInfo: any, url: string) => {
  const body = document.querySelector('body')

  const parsedInfo: ParseInfo = {}

  if (body) {
    for (let i = 0; i < metaInfo.length; i++) {
      const { fieldname } = metaInfo[i]
      const parseResult = parseField(metaInfo[i], body).content

      if (!parsedInfo[fieldname] && parseResult) {
        parsedInfo[fieldname] = parseResult
      }
    }
  }
  return { id_vacancy: url, ...parsedInfo }
}
