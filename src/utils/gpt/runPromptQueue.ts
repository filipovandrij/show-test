import api from '../../api'
import { PromptQueueAnswer, PromptQueueItem } from '../../types'
import { getRandomInt } from '../getRandomInt'
import { createGptTab } from './askGpt'
import { getAvailableGptModels } from './getAvailableGptModels'

let running = false,
  isUserEnabled = false
const delayBetweenRuns = getRandomInt(5, 10) * 1000
const checkYourGptLoginMessage = 'Please check your GPT login'

// Here begins the processing of prompts from a queue formed on the backend. The runPromptQueue function starts by checking if the user is authenticated in the GPT chat account. If authenticated, it proceeds with processing the prompt through the createGptTab function.

// эта функция берет промпты из очереди
export async function runPromptQueue() {
  if (!running) {
    isUserEnabled = true
    running = true
    const models = await getAvailableGptModels()
    if (models.length === 0) {
      isUserEnabled = false
      running = false
      return checkYourGptLoginMessage
    }
    return run(models, delayBetweenRuns)
  }
}
// эта функция останавливает обработку промптов
export function stopPromptQueue() {
  isUserEnabled = false
}
// эта функция запускает обработку промптов
async function run(models: string[], delayMs: number): Promise<string | void> {
  const saveMessages = (messages: any) => {
    chrome.storage.local.set({ userMessages: messages }, () => {
      if (chrome.runtime.lastError) {
        console.error('Ошибка при сохранении сообщений:', chrome.runtime.lastError)
      } else {
        console.log('Сообщения успешно сохранены')
        setTimeout(() => {
          chrome.runtime.sendMessage({ action: 'messagesUpdated' })
        }, 1000)
      }
    })
  }

  const addMessage = (newMessage: any) => {
    chrome.storage.local.get(['userMessages'], (result) => {
      const currentMessages = result.userMessages || []
      const messageObject = {
        date: new Date().toISOString(),
        message: newMessage,
      }
      const updatedMessages = [...currentMessages, messageObject]
      saveMessages(updatedMessages)
    })
  }
  const deleteMessages = () => {
    chrome.storage.local.remove('userMessages', () => {
      if (chrome.runtime.lastError) {
        console.error('Ошибка при удалении сообщений:', chrome.runtime.lastError)
      } else {
        console.log('Сообщения успешно удалены')

        chrome.runtime.sendMessage({ action: 'messagesUpdated' })
      }
    })
  }

  await new Promise((resolve) => setTimeout(resolve, delayMs))
  if (!isUserEnabled) {
    running = false
    return
  }

  const queueItems = await api.getPromptQueueItem(models)
  if (typeof queueItems === 'number') {
    return run(models, Math.ceil(queueItems) * 1000)
  }

  if (queueItems.length === 0) {
    console.log('No items in queue, stopping the queue...')
    return run(models, 30000)
  }

  const firstItem = queueItems[0]
  const gptTab = await createGptTab(firstItem.prompt.gpt_model_permalink)
  const answers: PromptQueueAnswer[] = []

  for (const item of queueItems) {
    if (!isUserEnabled) {
      running = false
      break
    }

    console.log('Processing item:', item)
    /* eslint-disable no-await-in-loop */
    const result = await processItem(gptTab, item)
    /* eslint-enable no-await-in-loop */

    if (result === checkYourGptLoginMessage) {
      isUserEnabled = false
      running = false
      break
    }

    answers.push(result as PromptQueueAnswer)
  }

  try {
    await api.sendPromptQueueAnswer(answers)
    console.log('All answers sent successfully')
  } catch (e) {
    console.error('Error sending answers', e)
  } finally {
    addMessage('Вкладка закроется через 3 секунды')

    setTimeout(() => {
      deleteMessages()
      gptTab.removeTab()
    }, 3000)
  }

  return run(models, delayBetweenRuns)
}
// эта функция передает даные по каждому промпту
async function processItem(
  gptTab: Awaited<ReturnType<typeof createGptTab>>,
  item: PromptQueueItem
): Promise<PromptQueueAnswer | string> {
  try {
    const { answer, chatId } = await gptTab.askGpt(
      item.prompt.prompt_text,
      item.delete_chat,
      item.chat_name,
      item.prompt.agent_name,
      item.prompt.required_answer_format,
      item.prompt.prompt_id
    )

    return {
      queue_element_id: item.queue_element_id,
      gpt_answer: answer,
      gpt_chat_id: chatId,
      status: 'success',
      error_message: '',
      list_id: item.list_id,
      order: item.order,
    }
  } catch (e: any) {
    console.error('Error processing item', e)
    if (e.message === checkYourGptLoginMessage) {
      return checkYourGptLoginMessage
    }
    return {
      queue_element_id: item.queue_element_id,
      gpt_answer: '-',
      gpt_chat_id: '-',
      status: 'error',
      error_message: e.message ?? 'something went wrong in processItem method',
      list_id: item.list_id,
      order: item.order,
    }
  }
}
