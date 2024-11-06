import { uuid } from '../../../utils/uuid'
import { gptFetcher } from '../gptFetcher'
import { ConversationPayload } from './model'


/**
 * Injects citations into a given string based on specified metadata.
 *
 * @param text - The text to inject citations into.
 * @param citations - An array of citation metadata, including start and end indices and the URL/title.
 * @returns The text with citations injected.
 */
const injectCitations = (
    text: string,
    citations?: { start_ix?: number; end_ix?: number; metadata: { url?: string; title: string } }[]
): string => {
  const filteredCitations = (citations || [])
      .filter(
          citation =>
              citation.start_ix !== undefined && citation.end_ix !== undefined && citation.metadata?.url
      )
      .sort((a, b) => (a.start_ix || 0) - (b.start_ix || 0))

  if (!filteredCitations.length) {
    return text
  }

  let offset = 0
  filteredCitations.forEach((citation, index) => {
    const { url, title } = citation.metadata
    const citationText = `[${index + 1}](${url}){: title="${title}"}`
    text = text.slice(0, citation.start_ix! + offset) + citationText + text.slice(citation.end_ix! + offset)
    offset += citationText.length - (citation.end_ix! - citation.start_ix!)
  })

  return text
}

/**
 * Parses a chunk of data from a conversation, updates the conversation state, and identifies when the conversation is complete.
 *
 * @param chunk - The binary data chunk received.
 * @param state - The current state of the conversation, including messages and other metadata.
 * @returns An updated state with new messages parsed from the chunk and a flag indicating if the conversation is done.
 */
export const parseAskChunk = async (
    chunk: Uint8Array | undefined,
    state: {
      chatId: null | string;
      messages: {
        id: string;
        author?: { role?: string; name?: string };
        content?: { content_type?: string; text?: string; parts: string[] };
        recipient?: string;
        metadata?: {
          timestamp_?: string;
          finish_details?: {
            type?: string;
          };
          citations?: {
            start_ix?: number;
            end_ix?: number;
            metadata: { url?: string; title: string };
          }[];
        };
      }[];
      carryOver: string;
    }
): Promise<{ done: boolean; data: any }> => {
  const result = {
    done: false,
    data: null as any,
  }

  let text = ''
  try {
    text = new TextDecoder().decode(chunk).trim()
  } catch (error) {
    console.error(`Failed to decode chunk. ${error}`)
    return result
  }

  if (state.carryOver) {
    text = `${state.carryOver}${text}`
  }

  const lines = text.split('\n')
  result.done = lines.includes('data: [DONE]')
  let parseError = null
  const dataLines = lines.filter(line => line.startsWith('data: {'))

  dataLines.forEach(line => {
    try {
      const dataText = line.replace('data: ', '').trim()
      const data = JSON.parse(dataText)
      const message = data.message
      const chatId = data.conversation_id || state.chatId
      if (!message || !message.id || !chatId) return

      state.chatId = chatId
      state.messages = state.messages.filter(msg => msg.id !== message.id)
      state.messages.push(message)
    } catch (error) {
      if ((error as any)?.name === 'SyntaxError') {
        parseError = error
      }
    }
  })

  if (dataLines.length > 0 && !parseError) {
    state.carryOver = ''
  } else if (text.startsWith('data: {')) {
    state.carryOver = text
  }

  if (!state.chatId) {
    return result
  }

  result.data = {
    id: null,
    text: '',
    chatId: state.chatId,
    finishDetails: null,
  }

  state.messages.forEach(message => {
    if (message.author && message.content && (message.recipient === 'all' || !message.recipient)) {
      if (message.author.role !== 'assistant' || message.content.content_type !== 'text') {
        if (message.author.role === 'assistant' && message.content.content_type === 'code') {
          result.data.id = result.data.id || message.id
          const text = message.content.text?.startsWith('# ') ? message.content.text.slice(2) : message.content.text
          result.data.text += `\n\`\`\`text\n🤔 ${text}\n\`\`\`\n`
        }
      } else {
        result.data.id = message.id
        result.data.finishDetails = message.metadata?.finish_details?.type
        result.data.text += injectCitations(message.content.parts.join(''), message.metadata?.citations)
      }
    }
  })

  return result
}

/**
 * Initiates a conversation with the GPT model, sending text and handling the response.
 *
 * @param payload - The initial parameters for the conversation, including the text and model to use.
 * @returns The state of the conversation after processing the response.
 */
export const ask = async (
    {
      text,
      conversation_id,
      model = 'text-davinci-002-render-sha',
      parentMessageId,
    }: ConversationPayload = { text: '' }
) => {
  let continueConversation = true
  let finishDetail = null
  let previousText = ''
  let combinedText = ''
  let attemptCount = 0
  const port = chrome.runtime.connect({ name: 'knockknock' })

  // eslint-disable-next-line no-unreachable-loop
  do {
    const userMessageId = uuid()
    port.postMessage({
      messages: [],
      userMessage: { id: userMessageId, text, author: 'user' },
    })

    const payload = {
      model,
      parent_message_id: parentMessageId || uuid(),
      timezone_offset_min: new Date().getTimezoneOffset(),
      action: finishDetail === 'max_tokens' ? 'continue' : 'next',
      arkose_token: null,
      messages: finishDetail !== 'max_tokens'
          ? [{
            id: uuid(),
            author: { role: 'user' },
            content: { content_type: 'text', parts: [text] },
          }]
          : undefined,
      conversation_mode: { kind: 'primary_assistant' },
      force_paragen: false,
      force_rate_limit: false,
      history_and_training_disabled: false,
      ...(conversation_id ? { conversation_id } : {}),
    }

    // eslint-disable-next-line no-await-in-loop
    const response = await gptFetcher('https://chat.openai.com/backend-api/conversation', {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'text/event-stream',
      },
    })

    const status = response.status

    if (status !== 200) {
      let error = 'Something went wrong'
      if (status === 413) error = 'Message too long'
      if (status === 429) error = 'Too many requests'
      // eslint-disable-next-line no-unused-vars
      if (status === 404) error = 'Chat not found'
      port.disconnect()
      return {
        chatId: null,
        messages: [] as { id: string }[],
        carryOver: '',
      }
    }

    const reader = response.body?.getReader()!
    const conversationState = {
      chatId: null as string | null,
      messages: [] as { id: string }[],
      carryOver: '',
    }

    for (;;) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        // eslint-disable-next-line no-await-in-loop
        const chunkResult = await parseAskChunk(value, conversationState)
        port.postMessage({
          messages: conversationState.messages,
        })

        if (chunkResult?.data) {
          conversation_id = chunkResult.data.chatId
          finishDetail = chunkResult.data.finishDetails
          parentMessageId = chunkResult.data.id
          if (chunkResult.data.text) {
            combinedText = previousText + chunkResult.data.text
            chunkResult.data.text = combinedText
          }
          // eslint-disable-next-line no-unused-vars
          continueConversation = false
        }

        if (chunkResult?.done) {
          break
        }
      } catch (error) {
        port.disconnect()
        if ((error as any).message?.includes('aborted')) {
          break
        }

        console.error('Failed to read response')
      }
    }

    reader.releaseLock()
    previousText = combinedText
    attemptCount++
    port.disconnect()
    return conversationState
  } while (finishDetail === 'max_tokens' && attemptCount <= 5)
}
