import { FC, ReactNode, useState } from 'react'
import { GptContextProvider as GptContext } from './GptContextProvider'
import { gptViews } from '../views'

export const GptContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<keyof typeof gptViews>('History')
  const [conversationId, setConversationId] = useState<string>()
  return (
    <GptContext
      value={{
        setView,
        conversation_id: conversationId,
        setConversationId,
        view,
      }}
    >
      {children}
    </GptContext>
  )
}
