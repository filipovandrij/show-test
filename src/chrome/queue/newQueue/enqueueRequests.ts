import axios from 'axios'
import { getBaseUrl } from '../../../api/baseUrl'
import { getToken } from '../../../api/getToken'

type TQueueEntity =
  | 'company'
  | 'profile'
  | 'job'
  | 'parseContactsApollo'
  | 'parseCompaniesApollo'
  | 'parseZoomInfo'
  | 'job_description'

type TQueueSource = 'linkedin' | 'apollo' | 'indeed' | 'zoominfo'

type QueueItem = {
  url?: any
  entity?: TQueueEntity
  status?: 'added' | 'processing' | 'success' | 'error' | 'paused due to error' | 'planned' | 'done'
  source?: TQueueSource
  total_entities?: any
  planned_date?: any
  guid?: any
  importNumber?: any
  importId?: any
  count_processed?: any
  min_delay?: any
  max_delay?: any
  fingerprint?: string
  tag_ids?: string[]
  validate?: {
    method: string
    period: any
  }
  import_instance?: number
}

export const enqueueItemNew = async (queueItem: QueueItem): Promise<any> => {
  const baseUrl = await getBaseUrl()

  const token = await getToken()
  console.log('baseUrl', baseUrl)
  const endpoint = `${baseUrl}/api/queue_element/`
  try {
    const response = await axios.post(endpoint, queueItem, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message)
      throw error
    } else {
      console.error('Unexpected error:', error)
      throw error
    }
  }
}

export const fetchQueue = async () => {
  const baseUrl = await getBaseUrl()
  const url = `${baseUrl}/api/queue_element/`
  const token = await getToken()

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    console.log('Response:', data)
    return data
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

export const updateQueueItem = async (id: number, queueItem: QueueItem) => {
  const baseUrl = await getBaseUrl()
  const url = `${baseUrl}/api/queue_element/${id}/`
  const token = await getToken()

  try {
    const response = await axios.patch(url, queueItem, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log('Ответ от сервера:', response.data)
    return response.data
  } catch (error) {
    console.error('Ошибка при выполнении PATCH-запроса:', error)
    throw error
  }
}
