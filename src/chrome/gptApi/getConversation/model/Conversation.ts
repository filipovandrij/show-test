export type ConversationSingle = {
  mapping: ConversationMapping
  conversation_id: string
  /** @example 1683924082.94164 */
  create_time: number
  current_node: string
  is_archived: boolean
  title: string
  /** @example 1683924363 */
  update_time: number
}

type ConversationMapping = {
  [k: string]: {
    children: string[]
    id: string
    parent?: string
    message?: Message
  }
}

type Message = {
  id: string
  author: Author
  create_time: number
  content: Content
  status: string
  end_turn: boolean
  weight: number
  metadata: Metadata
  recipient: string
}

export type Role = 'assistant' | 'user' | 'system' // etc
type Author = {
  role: Role
  metadata: Record<string, unknown>
}

type Content = {
  content_type: string
  parts: string[]
}
