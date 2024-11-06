import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { styled } from '@mui/system'
import SendIcon from '@mui/icons-material/Send'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import { Box, MenuItem, Select, TextareaAutosize, TextField } from '@mui/material'
import { gptApiCall } from '../../../../../utils/gptApiCall'
import { LeftMessage, RightMessage } from '../../../../../components/Messages'
import { GptContext } from '../../context/GptContextProvider'
import { Role } from '../../../../../chrome/gptApi/getConversation/model'
import { mapConversation } from './mapConversation'

const ChatWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 8px;
  background-color: #fff;
`

const MessagesListContainer = styled(Box)`
  position: relative;
  flex-grow: 1;
`

const MessagesList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`

const ButtonsContainer = styled(Box)`
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  height: 100%;
  cursor: pointer;
`

export const Chat = memo(() => {
  const [value, setValue] = useState<string>()
  const messagesListRef = useRef<HTMLDivElement | null>(null)
  const port = useRef<chrome.runtime.Port>()
  const disconectListenerRef = useRef<(port: chrome.runtime.Port) => void>()
  const { conversation_id, setConversationId } = useContext(GptContext)
  const [messages, setMessages] = useState<
    { author: Extract<Role, 'assistant' | 'user'>; text: string; id: string }[]
  >([])
  const [currentNode, setCurrentNode] = useState<string>()
  const [tmpMessge, setTmpMessage] = useState<{
    author: Extract<Role, 'assistant' | 'user'>
    text: string
    id: string
  }>()
  const [processing, setProcessing] = useState(false)
  const [needScroll, setNeedScroll] = useState(false)

  const [
      selectedModel,
      setSelectedModel
  ] = useState<'text-davinci-002-render-sha' | 'gpt-4'>('text-davinci-002-render-sha')

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event?.currentTarget?.value)
  }, [])

  const scrollToView = useCallback(() => {
    if (
      !!messagesListRef.current &&
      messagesListRef.current.scrollTop ===
        messagesListRef.current.scrollHeight - messagesListRef.current.offsetHeight
    ) {
      setTimeout(() => {
        messagesListRef.current?.scrollTo(0, messagesListRef.current.scrollHeight)
      }, 10)
    }
    setNeedScroll(false)
  }, [])

  const onMessageListener = useCallback(
    (msg: any) => {
      const messages = msg?.messages

      if (msg.userMessage) {
        setMessages((prev) => {
          const userMessageAdded = prev.at(-1)?.id === msg.userMessage.id
          !userMessageAdded && setValue('')
          return userMessageAdded ? prev : [...prev, msg.userMessage]
        })
        setValue('')
        setTimeout(() => {
          messagesListRef.current?.scrollTo(0, messagesListRef.current.scrollHeight)
        }, 10)
      }

      if (Array.isArray(messages)) {
        if (conversation_id && messages.length === 1) {
          setTmpMessage({
            id: messages[0].id,
            author: 'assistant',
            text: messages[0].content?.parts?.join(''),
          })
          setCurrentNode(messages[0].id)
          scrollToView()
        } else if (messages.length === 3 && messages[2].author?.role === 'assistant') {
          setTmpMessage({
            id: messages[2].id,
            author: 'assistant',
            text: messages[2].content?.parts?.join(''),
          })
          setCurrentNode(messages[2].id)
          scrollToView()
        }
      }
    },
    [conversation_id, scrollToView]
  )

  const onConnectListener = useCallback(
    (_port: chrome.runtime.Port) => {
      const disconectListener = (p: chrome.runtime.Port) => {
        chrome.runtime.onConnect.removeListener(onConnectListener)
        p.onMessage.removeListener(onMessageListener)
        p.onDisconnect.removeListener(disconectListener)
        port.current = undefined
        disconectListenerRef.current = undefined
        setTmpMessage((tmpMessge) => {
          tmpMessge && setMessages((prev) => [...prev, tmpMessge])
          scrollToView()
          setProcessing(false)
          return undefined
        })
      }
      disconectListenerRef.current = disconectListener
      port.current = _port
      _port.onMessage.addListener(onMessageListener)
      _port.onDisconnect.addListener(disconectListener)
    },
    [onMessageListener, scrollToView]
  )

  const sendMessage = useCallback(() => {
    chrome.runtime.onConnect.addListener(onConnectListener)
    setProcessing(true)
    value &&
      gptApiCall('ask')({
        text: value,
        parentMessageId: currentNode,
        conversation_id,
        model: selectedModel
      }).then(
        ({ chatId, messages }) => {
          setTmpMessage((tmpMessge) => {
            tmpMessge && setMessages((prev) => [...prev, tmpMessge])
            scrollToView()
            setProcessing(false)

            return undefined
          })
          if (conversation_id === undefined && chatId) {
            setConversationId(chatId)
            messages[1]?.id &&
              gptApiCall('genTitle')({
                conversation_id: chatId,
                message_id: messages[1].id
              })
          }
        }
      )
  }, [conversation_id, currentNode, onConnectListener, scrollToView, setConversationId, value])

  useEffect(() => {
    return () => {
      disconectListenerRef.current && port.current && disconectListenerRef.current(port.current)
    }
  }, [])

  useEffect(() => {
    if (!conversation_id) {
      setMessages([])
      setCurrentNode(undefined)
    }
  }, [conversation_id])

  useEffect(() => {
    if (conversation_id) {
      gptApiCall('getConverSation')({ id: conversation_id }).then((r) => {
        setMessages(mapConversation(r))
        setCurrentNode(r.current_node)
        setTimeout(() => {
          messagesListRef.current?.scrollTo(0, messagesListRef.current.scrollHeight)
        }, 10)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (needScroll) {
      setTimeout(scrollToView, 10)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needScroll])

  const renderMessages = useMemo(
    () =>
      messages.map(({ author, id, text }) =>
        author === 'assistant' ? (
          <LeftMessage key={id} text={text} />
        ) : (
          <RightMessage key={id} text={text} />
        )
      ),
    [messages]
  )

  return (
    <ChatWrapper>
      <MessagesListContainer>
        <MessagesList ref={messagesListRef}>
          {renderMessages}
          {processing && <LeftMessage text={tmpMessge?.text || '...'} />}
        </MessagesList>
      </MessagesListContainer>
      <Select
          id="selectedModel"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value as 'text-davinci-002-render-sha' | 'gpt-4')}
      >
        <MenuItem value="text-davinci-002-render-sha">GPT 3.5</MenuItem>
        <MenuItem value="gpt-4">GPT 4</MenuItem>
      </Select>
      <TextField
        multiline
        variant={'outlined'}
        value={value}
        onChange={onChange}
        style={{ width: '100%', maxWidth: '100%' }}
        InputProps={{
          inputComponent: TextareaAutosize,
          inputProps: {
            maxRows: 4,
            minRows: 4,
          },
          endAdornment: (
            <ButtonsContainer>
              {processing ? <StopCircleIcon /> : <SendIcon onClick={sendMessage} />}
            </ButtonsContainer>
          ),
        }}
      />
    </ChatWrapper>
  )
})
