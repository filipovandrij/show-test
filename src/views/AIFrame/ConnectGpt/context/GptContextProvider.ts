import { createContext } from 'react'
import { gptViews } from '../views'

export type TGptContext = {
  conversation_id?: string
  view: keyof typeof gptViews
  setView: React.Dispatch<React.SetStateAction<keyof typeof gptViews>>
  setConversationId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const GptContext = createContext<TGptContext>({
  view: 'Chat',
  setView: () => {},
  setConversationId: () => {},
})

export const GptContextProvider = GptContext.Provider
