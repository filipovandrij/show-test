import * as gptApi from './gptApi'
import { isGptApiKey } from './gptApi/utils'
import { setState } from './state'

export const backgroundGpt = () => {
  gptApi.authSession().then((session) => setState([['gptSession', session]]))

  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action === 'update_gpt_session') {
      gptApi.authSession().then((session) => {
        setState([['gptSession', session]]).then(() => {
          sendResponse({ action: 'update_gpt_session_success' })
        })
      })
      return true
    }

    if (request.action === 'gpt_api_call') {
      const key = request.apiKey
      isGptApiKey(key) &&
        gptApi[key](request.args).then((response) => {
          sendResponse(response)
        })
      return true
    }
  })
}
