/* eslint-disable no-await-in-loop */
import { timer } from '../timer'
import { getRandomInt } from '../getRandomInt'
import { compareTimeString } from '../compareTime'
import { parseField } from '../parsing'
import { Post } from '../parsePost/models'
import { xpath } from '../xpath'

const metadata = [
  {
    type: 'single',
    fieldname: 'post_date',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div[4]/div/div/a[2]/span/div/span/span[1]',
  },
  {
    type: 'single',
    fieldname: 'post_date',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div/div[4]/div/div/a[2]/span/div/span/span[1]',
  },
  {
    type: 'single',
    fieldname: 'post',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div[5]/div[1]/div/span/span/span',
  },
  {
    type: 'single',
    fieldname: 'post_photo',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div/div[6]/div/div/button/div/div/img',
  },
  {
    type: 'single',
    fieldname: 'post_video',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div[6]/div/div/div/div/video',
  },
  {
    type: 'single',
    fieldname: 'poll_name',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div[5]/div[1]/div/h5',
  },
  {
    type: 'single',
    fieldname: 'poll_option_1',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div[5]/div[2]/div/fieldset/div[1]/div[1]/div/div/span',
  },
  {
    type: 'single',
    fieldname: 'poll_percentages_1',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div[5]/div[2]/div/fieldset/div[1]/div[2]',
  },
  {
    type: 'single',
    fieldname: 'poll_option_2',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div[5]/div[2]/div/fieldset/div[2]/div[1]/div/div/span',
  },
  {
    type: 'single',
    fieldname: 'poll_percentages_2',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div[5]/div[2]/div/fieldset/div[2]/div[2]',
  },

  {
    type: 'single',
    fieldname: 'poll_option_3',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div[5]/div[2]/div/fieldset/div[3]/div[1]/div/div/span',
  },
  {
    type: 'single',
    fieldname: 'poll_percentages_3',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div[5]/div[2]/div/fieldset/div[3]/div[2]',
  },

  {
    type: 'single',
    fieldname: 'poll_option_4',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div[5]/div[2]/div/fieldset/div[4]/div[1]/div/div/span',
  },
  {
    type: 'single',
    fieldname: 'poll_percentages_4',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div[5]/div[2]/div/fieldset/div[4]/div[2]',
  },
  {
    type: 'single',
    fieldname: 'response_rate',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div[5]/div[2]/div/div/p[1]',
  },
  {
    type: 'single',
    fieldname: 'poll_status',
    section: 'post',
    xpath: './div/div/div[2]/div/div/div[5]/div[2]/div/div/p[2]/span[1]',
  },
]

const commentData = [
  {
    type: 'single',
    fieldname: 'link_author',
    section: 'comment',
    xpath: './div[1]/a',
  },
  {
    type: 'single',
    fieldname: 'comment',
    section: 'comment',
    xpath: './div[3]/div/div[1]/span/div/span',
  },
]

let intervalId: number
let counter = 0
const posts: Post[] = []
const parse = () => {
  return new Promise<any>((resolve) => {
    const main = document.querySelector('main')

    if (!main) return

    intervalId = window.setInterval(async () => updatePosts(main), 15000)

    const updatePosts = async (main: HTMLElement) => {
      const parent = xpath('./div/section/div[2]/div/div/div[1]/ul', main) as Element

      const postList = parent.querySelectorAll(':scope > li')
      // eslint-disable-next-line no-console
      console.log(postList)

      // eslint-disable-next-line no-labels
      postLoop: for (let i = counter; i < postList.length; i++) {
        counter += 1
        const post: any = {}
        const postItem = postList[i]

        await timer(getRandomInt(1000, 3000))
        postItem.scrollIntoView({ behavior: 'smooth' })
        // eslint-disable-next-line no-console
        console.log(postItem)
        await timer(getRandomInt(1000, 3000))

        for (let j = 0; j < metadata.length; j++) {
          const pathItem = metadata[j]

          const item = xpath(pathItem.xpath, postItem)
          // eslint-disable-next-line no-console
          console.log(item)
          if (item instanceof HTMLElement) {
            switch (item.tagName) {
              case 'A': {
                const href = item.getAttribute('href')

                if (href && !post[pathItem.fieldname]) {
                  post[pathItem.fieldname] = href
                }

                break
              }
              case 'VIDEO':
              case 'IMG': {
                const src = item.getAttribute('src')

                if (src && !post[pathItem.fieldname]) {
                  post[pathItem.fieldname] = src
                }

                break
              }
              default: {
                const { textContent } = item

                if (textContent && !post[pathItem.fieldname]) {
                  if (pathItem.fieldname === 'post_date' && compareTimeString(textContent, '1w')) {
                    clearInterval(intervalId)
                    resolve(posts)
                    // eslint-disable-next-line no-labels
                    break postLoop
                  }
                  post[pathItem.fieldname] = textContent
                }

                break
              }
            }
          }
        }

        const comments = []
        const commentList = postItem.querySelectorAll('.comments-comment-item')

        await timer(getRandomInt(1000, 3000))

        for (let j = 0; j < commentList.length; j++) {
          const comment: { [key: string]: string } = {}

          for (let k = 0; k < commentData.length; k++) {
            comment[commentData[k].fieldname] = parseField(
              commentData[k],
              <HTMLElement>commentList[j]
            ).content
          }
          comments.push(comment)
        }

        post.comments = comments
        posts.push(post)
      }
      counter += 1
    }
  })
}

export const parseCommentsPost = async () => {
  const posts = await parse()
  return { posts }
}
