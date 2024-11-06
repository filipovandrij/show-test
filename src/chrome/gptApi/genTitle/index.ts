import { gptFetcher } from '../gptFetcher'

export const genTitle = ({
  conversation_id,
  message_id,
}: {
  conversation_id: string
  message_id: string
}): Promise<{ title: string }> =>
  gptFetcher(`https://chat.openai.com/backend-api/conversation/gen_title/${conversation_id}`, {
    method: 'post',
    body: JSON.stringify({ message_id }),
  }).then((r) => {
    if (r.ok && r.status === 200) {
      return r.json().then((r: { title: string }) => r)
    }
    throw Error()
  })
