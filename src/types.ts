export enum Sender {
  React,
  Content,
}

export interface AnalyzeEntity {
  specific_key: string
}

export interface PromptQueueItem {
  queue_element_id: number
  prompt: {
    prompt_text: string
    gpt_model_permalink: string
    agent_name: string | null
    required_answer_format: string
    prompt_id: number
  }
  delete_chat: boolean
  chat_name: string | null
  list_id: string
  order: number
}

export interface PromptQueueAnswer {
  queue_element_id: number
  gpt_answer: string
  gpt_chat_id: string
  status: string
  error_message: string
  list_id: string
  order: number
}
