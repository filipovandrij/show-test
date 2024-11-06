import { parse } from '../parseLinkedinProfile/parse'

const metadata = [
  { type: 'single', fieldname: 'link', section: 'msg', xpath: './header/div[3]/div[2]/h2/a' },
  {
    type: 'nested_list',
    fieldname: 'msgs',
    section: 'msgs',
    xpath: './div[2]/div/div[3]/div[1]/ul',
    li_selector: ':scope > li[class*="msg-s-message-list__event"]',
    path_list: [
      { attribute_name: 'date', path: './time' },
      { attribute_name: 'author', path: './div/div[1]/a/span' },
      { attribute_name: 'time', path: './div/div[1]/time' },
      { attribute_name: 'content', path: './div/div[2]/div/div/p' },
    ],
  },
]

export const parseChats = () => {
  const chats = document.querySelectorAll('.msg-convo-wrapper') as NodeListOf<HTMLElement>

  if (chats.length > 0) {
    const parsedChats = []

    for (let i = 0; i < chats.length; i++) {
      const chat: any = {}
      for (let j = 0; j < metadata.length; j++) {
        chat[metadata[j].fieldname] = parse(chats[i], metadata[j])
      }
      parsedChats.push(chat)
    }

    // eslint-disable-next-line no-console
    console.log(parsedChats)
  }
}
