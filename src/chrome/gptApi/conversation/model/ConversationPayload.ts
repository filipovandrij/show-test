export type ConversationPayload = {
  conversation_id?: string
  parentMessageId?: string
  signal?: unknown // AbortController types
  model?: 'text-davinci-002-render-sha' | 'gpt-4'
  text: string
}
