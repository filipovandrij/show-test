import { setState } from '../state'
import { ParserConfig } from './model/ParserConfig'

const parsers = {
  [String.raw`https://www.linkedin.com/in/[\p{L}\p{N}\p{Pd}]+/$`]: {
    requestsUrls: ['https://www.linkedin.com/voyager/api/*'],
    types: ['other', 'xmlhttprequest'],
    mode: 'auto',
    config: [
      {
        fieldname: 'Profile',
        xpath: '/html/body/div[5]/div[3]/div/div/div[2]/div/div/main/section[1]',
        childNodes: [
          {
            fieldname: 'Name',
            xpath: './div[2]/div[2]/div[1]/div[1]/span/a/h1',
          },
          {
            fieldname: 'Description',
            xpath: './div[2]/div[2]/div[1]/div[2]',
          },
        ],
      },
      {
        fieldname: 'About',
        xpath: '/html/body/div[6]/div[3]/div/div/div[2]/div/div/main/section[1]',
        iterableCheckConditions: true,
        conditions: [
          {
            operation: 'like',
            value: 'About',
            containerType: 'parentNode',
            xpath: './div[2]/div/div[1]/div/h2/span[1]',
            next: {
              fieldname: 'About',
              xpath: './div[3]/div/div/div/span[1]',
            },
          },
        ],
      },
      {
        fieldname: 'Activity',
        xpath: '/html/body/div[6]/div[3]/div/div/div[2]/div/div/main/section[1]',
        iterableCheckConditions: true,
        conditions: [
          {
            operation: 'like',
            value: 'Activity',
            containerType: 'parentNode',
            xpath: './div[2]/div/div[1]/div/h2/span[1]',
            next: {
              fieldname: 'Activity',
              xpath: './div[4]/div/div/div[1]/ul/li[1]',
              isList: true,
              childNodes: [
                {
                  fieldname: 'Posted by',
                  xpath: './div/div/a/div/span/span[1]/strong',
                },
                {
                  fieldname: 'Description',
                  xpath: '.',
                  conditions: [
                    {
                      operation: 'not_nil',
                      containerType: 'parentNode',
                      xpath: './div/div/div[1]/a[2]/div/span[1]',
                      next: {
                        fieldname: 'Description',
                        xpath: './div/div/div[1]/a[2]/div/span[1]',
                      },
                    },
                    {
                      operation: 'not_nil',
                      containerType: 'parentNode',
                      xpath: './div/div/div/a/div',
                      next: {
                        fieldname: 'Description',
                        xpath: './div/div/div/a/div',
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  },
} as Record<string, ParserConfig>

export const quickParseState = () => {
  setState([['parsers', parsers]])
  chrome.runtime.onMessage.addListener((request, { tab }, sendResponse) => {
    if (request.action === 'update_quick_parse_state' && tab?.id !== undefined) {
      setState(
        [[`quickParse.${tab.id}` as any, { processing: request.processing, data: request.data }]],
        'bg'
      ).then(() => {
        sendResponse({ action: 'update_quick_parse_state_success' })
      })

      return true
    }

    if (request.action === 'toggle_parser_mode' && tab?.id !== undefined) {
      setState((state) => ({
        ...state,
        parsers: {
          ...state.parsers,
          [request.parserKey as string]: {
            requestsUrls: [],
            types: [],
            config: [],
            ...state.parsers?.[request.parserKey as string],
            mode: state.parsers?.[request.parserKey as string]?.mode === 'auto' ? 'manual' : 'auto',
          },
        },
      })).then(() => {
        sendResponse({ action: 'toggle_parser_mode_success' })
      })

      return true
    }
  })
}
