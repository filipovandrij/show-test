import { gptFetcher } from '../gptFetcher'
import { GptSession } from './model'

export const authSession = (): Promise<GptSession> =>
  gptFetcher(
    'https://chat.openai.com/api/auth/session',
    {
      method: 'get',
    },
    false
  ).then((r) => (r.ok && r.status === 200 ? r.json().then((r: GptSession) => r) : { user: {} }))
