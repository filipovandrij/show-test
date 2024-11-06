import { gptFetcher } from '../gptFetcher'
import { ConversationsArgs, Conversations } from './model'

export const getConverSations = ({
  limit = 100,
  offset = 0,
}: ConversationsArgs): Promise<Conversations> =>
  gptFetcher(
    `https://chat.openai.com/backend-api/conversations?offset=${offset}&limit=${limit}&order=updated`,
    {
      method: 'get',
    }
  ).then((r) =>
    r.ok && r.status === 200
      ? r.json().then((r: Conversations) => r)
      : { items: [], has_missing_conversations: false, limit, offset, total: 0 }
  )
