import { Conversation } from './Conversation'

export type Conversations = {
  total: number
  limit: number
  offset: number
  has_missing_conversations: boolean
  items: Conversation[]
}
