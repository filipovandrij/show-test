import { ParseInfo } from '../parsing/models'
import { timer } from '../timer'
import { compareTimeString } from '../compareTime'
import { Article } from './models'
import { xpath } from '../xpath'

const metadata = [
  {
    type: 'single',
    fieldname: 'article_image',
    section: 'Articles',
    xpath: './div/div/div/div/article/div/div[1]/a/div/div/img',
  },
  {
    type: 'single',
    fieldname: 'article_link',
    section: 'Articles',
    xpath: './div/div/div/div/article/div/div[1]/a',
  },
  {
    type: 'single',
    fieldname: 'article_preview',
    section: 'Articles',
    xpath: './div/div/div/div/div[4]/div/div/span/span/span',
  },
  {
    type: 'single',
    fieldname: 'article_date',
    section: 'article_date',
    xpath: './div/div/div/div/div[2]/div/div/a[2]/span/div/span/span[1]',
  },
]

let intervalId: number
let counter = 0
const articles: Article[] = []

const updateArticles = async (main: HTMLElement) => {
  const parent = xpath('./div[2]/div/div[2]/div[2]/div/div[1]', main) as Element

  const articleList = parent.querySelectorAll(':scope > div')

  // eslint-disable-next-line no-labels
  articleLoop: for (let i = counter; i < articleList.length; i++) {
    counter += 1
    const article: any = {}

    // eslint-disable-next-line no-await-in-loop
    await timer(1000)
    articleList[i].scrollIntoView({ behavior: 'smooth' })

    for (let j = 0; j < metadata.length; j++) {
      const pathItem = metadata[j]

      const item = xpath(pathItem.xpath, articleList[i])

      if (item instanceof HTMLElement) {
        switch (item.tagName) {
          case 'A': {
            const href = item.getAttribute('href')

            if (href && !article[pathItem.fieldname]) {
              article[pathItem.fieldname] = href
            }

            break
          }
          case 'VIDEO':
          case 'IMG': {
            const src = item.getAttribute('src')

            if (src && !article[pathItem.fieldname]) {
              article[pathItem.fieldname] = src
            }

            break
          }
          default: {
            const { textContent } = item

            if (textContent && !article[pathItem.fieldname]) {
              if (pathItem.fieldname === 'article_date' && compareTimeString(textContent)) {
                clearInterval(intervalId)
                // eslint-disable-next-line no-console
                console.log(articles)
                // eslint-disable-next-line no-labels
                break articleLoop
              }
              article[pathItem.fieldname] = textContent
            }

            break
          }
        }
      }
    }
    articles.push(article)
  }
  counter += 1
}

export const parseArticles = async () => {
  const main = document.querySelector('main')
  const parsedInfo: ParseInfo = {}

  if (!main) return

  intervalId = window.setInterval(async () => updateArticles(main), 15000)

  return parsedInfo
}
