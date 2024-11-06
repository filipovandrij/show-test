import { gptFetcher } from '../gptFetcher'
import { ConversationSingle } from './model'

export const getConverSation = ({ id }: { id: string }): Promise<ConversationSingle> =>
  gptFetcher(`https://chat.openai.com/backend-api/conversation/${id}`, {
    method: 'get',
  }).then((r) => {
    if (r.ok && r.status === 200) {
      return r.json().then((r: ConversationSingle) => r)
    }
    throw Error()
  })
