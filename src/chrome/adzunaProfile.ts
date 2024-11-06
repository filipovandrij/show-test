import { getToken } from '../api/getToken'
import { parseField } from '../utils/parsing'
import { ParseInfo } from '../utils/parsing/models'

const currentUrl = window.location.href

const metadataAdzuna = [
  {
    type: 'nested_list',
    fieldname: 'details',
    xpath: './div[2]/div/section[1]/div[1]/div[1]/table/tbody',
    li_selector: 'tr',
    path_list: [
      {
        attribute_name: 'type',
        path: './th',
      },
      {
        attribute_name: 'value',
        path: './td',
      },
    ],
  },
  {
    type: 'single',
    fieldname: 'description',
    xpath: './div[2]/div/section[1]/div[1]/div[3]/div/section',
  },
  {
    type: 'single',
    fieldname: 'title',
    xpath: './div[2]/section/h1',
  },
]

const sendParseData = async (data: any) => {
  const token = await getToken()
  if (token) {
    await fetch('https://aide.ainsys.com/api/data-parsing/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: data,
    })
  }
}

const textModifier = (text?: string) => {
  return text?.replace(/\s+/g, ' ').replace('\n', '').trim()
}

const parsejob = (metaInfo: any) => {
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
  return { id_vacancy: currentUrl, ...parsedInfo }
}

const launchParser = () => {
  const data = parsejob(metadataAdzuna)
  const modifiedData = textModifier(JSON.stringify(data))

  if (!localStorage.getItem(currentUrl)) {
    localStorage.setItem(currentUrl, currentUrl)
    sendParseData(modifiedData)
  }
}

launchParser()
