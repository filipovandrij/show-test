import { ConversationSingle, Role } from '../../../../../chrome/gptApi/getConversation/model'

export const mapConversation = (conversation: ConversationSingle) => {
  const messages = [] as {
    author: Extract<Role, 'assistant' | 'user'>;
    text: string;
    id: string
  }[]

  let current_node = conversation.current_node

  while (current_node) {
    const node = conversation?.mapping?.[current_node]
    current_node = node?.parent!
    const message = node?.message
    if (
      message &&
      (
          message.author?.role === 'assistant' || message.author?.role === 'user') &&
          message.content?.content_type === 'text' &&
          message.content.parts?.length
    ) {
      messages.push({
        author: message.author.role,
        id: message.id,
        text: message.content.parts.join(''),
      })
    }
  }
  messages.reverse()
  return messages
}
