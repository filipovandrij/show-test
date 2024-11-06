import { getBaseUrl } from '../../api/baseUrl'
import { getToken } from '../../api/getToken'
import { updateImport } from '../../views/AIFrame/DataImport/Import'
import { getState, setState } from '../state'

import {
  processLinkedInCompany,
  processLinkedInProfile,
  processApollo,
  // processZoomInfo,
} from './bgParsers'

interface SpecificKey {
  content: string
  status: string
}

interface Candidate {
  [key: string]: {
    content: string
    status: string
    specific_key?: SpecificKey
  }
}

interface ManagerAndCompany {
  [key: string]: {
    content: string
    status: string
    specific_key?: SpecificKey
  }
}

const getImport = async () => {
  try {
    const token = await getToken()
    const baseUrl = await getBaseUrl()

    const response = await fetch(`${baseUrl}/api/import/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting import data:', error)
    return null
  }
}

export type TQueueEntity =
  | 'company'
  | 'profile'
  | 'job'
  | 'parseContactsApollo'
  | 'parseCompaniesApollo'
  | 'parseZoomInfo'

export type TQueueSource = 'linkedin' | 'apollo' | 'indeed' | 'zoominfo'

export type QueueItem = {
  url: any
  entity: TQueueEntity
  status: 'added' | 'processing' | 'success' | 'error' | 'paused due to error'
  source: TQueueSource
  import_instance?: any
  total_entities?: any
  planned_date?: any
  guid?: any
  importNumber?: any
  importId?: any
  count_processed?: any
  minDelay?: any
  maxDelay?: any
  fingerprint: string
  tag_ids?: string[]
  validate?: {
    method: string
    period: any
  }
}

export async function enqueueItem(newItem: QueueItem, storage: any = 'localStorage') {
  const currentState = await getState(storage)

  const isUrlExists =
    newItem.source !== 'apollo' && currentState.queue?.find((item) => item.url === newItem.url)
  if (isUrlExists) {
    return
  }

  const newQueue = [...(currentState.queue || []), newItem]
  await setState({ ...currentState, queue: newQueue }, storage)
}

export async function enqueueItems(newItems: QueueItem[], storage: any = 'localStorage') {
  const currentState = await getState(storage)

  const filteredNewItems = newItems.filter(
    (newItem) =>
      newItem.source !== 'apollo' && !currentState.queue?.find((item) => item.url === newItem.url)
  )

  if (filteredNewItems.length === 0) {
    return
  }

  const newQueue = [...(currentState.queue || []), ...filteredNewItems]
  await setState({ ...currentState, queue: newQueue }, storage)
}

export async function processQueueItem(storage: any = 'localStorage') {
  let currentState = await getState(storage)
  if (!currentState.queue || currentState.queue.length === 0) {
    return
  }

  const currentItemIndex = currentState.queue.findIndex(
    (item) =>
      (item.status === 'added' || item.status === 'paused due to error') &&
      !currentState.queue?.some((i) => i.status === 'processing' && i.source === item.source)
  )

  if (currentItemIndex === -1) {
    return
  }

  await updateStatuses()
  currentState = await getState(storage)
  if (!currentState.queue || currentState.queue.length === 0) {
    return
  }

  const currentItem = currentState.queue[currentItemIndex]
  currentItem.status = 'processing'
  await setState({ ...currentState }, storage)

  try {
    if (currentItem.entity === 'company' && currentItem.source === 'linkedin') {
      const processingResult = await processLinkedInCompany(currentItem.url)

      if (processingResult === 'error') {
        currentItem.status = 'error'
      } else if (processingResult === 'processing') {
        currentItem.status = 'processing'
      } else {
        currentItem.status = 'success'
      }
      await updateStatuses()
    }

    if (currentItem.entity === 'profile' && currentItem.source === 'linkedin') {
      const processingResult = await processLinkedInProfile(currentItem.url)

      if (processingResult === 'error') {
        currentItem.status = 'error'
      } else if (processingResult === 'processing') {
        currentItem.status = 'processing'
      } else {
        currentItem.status = 'success'
      }
      await updateStatuses()
    }

    // if (currentItem.entity === 'parseZoomInfo' && currentItem.source === 'zoominfo') {
    //   const processingResult = await processZoomInfo(
    //     currentItem.url,
    //     currentItem.entity,
    //     currentItem.total_entities,
    //     currentItem.minDelay,
    //     currentItem.maxDelay,
    //     currentItem.guid,
    //     currentItem.importNumber,
    //     currentItem.importId
    //   )

    //   if (processingResult === 'error') {
    //     currentItem.status = 'error'
    //     await updateImport(currentItem.importId, {
    //       status: 'in progress',
    //     })
    //   } else if (processingResult === 'success') {
    //     currentItem.status = 'success'
    //     await updateImport(currentItem.importId, {
    //       status: 'done',
    //     })
    //   } else {
    //     currentItem.status = 'processing'
    //     await updateImport(currentItem.importId, {
    //       status: 'in progress',
    //     })
    //   }
    // }
  } catch (error) {
    console.error('Error processing item:', error)
    currentItem.status = 'error'
    await updateStatuses()
  }

  currentState = await getState(storage)
  if (!currentState.queue || currentState.queue.length === 0) {
    return
  }
  currentState.queue[currentItemIndex] = currentItem
  await setState({ ...currentState }, storage)
  const remainingItems = currentState.queue.filter(
    (item) => item.status === 'added' || item.status === 'paused due to error'
  )
  if (remainingItems.length) {
    await processQueueItem(storage)
  }
}

export async function processApolloQueueItem(storage: any = 'localStorage') {
  await updateLink()
  await updateStatuses()
  let currentState = await getState(storage)
  console.log('СТЕЙТ В НАЧАЛЕ ', currentState)
  if (!currentState.queue || currentState.queue.length === 0) {
    return
  }

  const apolloItemsIndex = currentState.queue.findIndex(
    (item) =>
      item.source === 'apollo' &&
      (item.status === 'added' ||
        item.status === 'paused due to error' ||
        item.status === 'success') &&
      !currentState.queue?.some((i) => i.status === 'processing' && i.source === item.source) &&
      item.count_processed < item.total_entities
  )

  if (apolloItemsIndex === -1) {
    return
  }

  await updateLink()
  await updateStatuses()
  currentState = await getState(storage)
  if (!currentState.queue || currentState.queue.length === 0) {
    return
  }

  const currentItem = currentState.queue[apolloItemsIndex]
  currentItem.status = 'processing'
  await setState({ ...currentState }, storage)

  try {
    if (
      currentItem.entity === 'parseContactsApollo' ||
      currentItem.entity === 'parseCompaniesApollo'
    ) {
      const processingResult = await processApollo(
        currentItem.url,
        currentItem.entity,
        currentItem.total_entities,
        currentItem.minDelay,
        currentItem.maxDelay,
        currentItem.guid,
        currentItem.count_processed,
        currentItem.importNumber,
        currentItem.importId,
        currentItem.tag_ids,
        currentItem.validate
      )
      if (processingResult === 'error') {
        currentItem.status = 'error'
        await updateImport(currentItem.importId, {
          status: 'error',
        })
        await updateLink()
      } else if (processingResult === 'paused due to error') {
        currentItem.status = 'paused due to error'
        await updateImport(currentItem.importId, {
          status: 'paused due to error',
        })
        await updateLink()
      } else if (processingResult === 'success') {
        currentItem.status = 'success'
        await updateImport(currentItem.importId, {
          status: 'done',
        })
        await updateLink()
      } else {
        currentItem.status = 'processing'
        await updateImport(currentItem.importId, {
          status: 'in progress',
        })
        await updateLink()
      }
      await updateLink()
      await updateStatuses()
    }
  } catch (error) {
    console.error('Error processing Apollo item:', error)
    currentItem.status = 'error'
    await updateLink()
    await updateStatuses()
  }

  await updateLink()
  await updateStatuses()
  currentState = await getState(storage)
  if (!currentState.queue || currentState.queue.length === 0) {
    return
  }

  currentState.queue[apolloItemsIndex] = currentItem
  await setState({ ...currentState }, storage)

  await updateLink()
  const remainingApolloItems = currentState.queue.filter(
    (item) =>
      (item.source === 'apollo' &&
        (item.status === 'added' || item.status === 'paused due to error')) ||
      (item.source === 'apollo' &&
        item.status === 'success' &&
        item.count_processed < item.total_entities)
  )

  if (remainingApolloItems.length) {
    await processApolloQueueItem(storage)
  }
}

export async function removeProcessedItems(storage: any = 'localStorage') {
  const currentState = await getState(storage)
  if (!currentState.queue || currentState.queue.length === 0) {
    return
  }

  const updatedQueue = currentState.queue.filter((item) => item.status !== 'processing')

  await setState({ ...currentState, queue: updatedQueue }, storage)
}

export async function updateStatuses(storage: any = 'localStorage') {
  const currentState = await getState(storage)
  if (currentState.queue && currentState.linkAnalyzer) {
    currentState.queue.forEach((queueItem) => {
      if (currentState.linkAnalyzer) {
        currentState.linkAnalyzer.forEach((analyzerItem: any) => {
          Object.entries(analyzerItem.formState).forEach(([key, value]) => {
            if (key.startsWith('candidate')) {
              const candidate: Candidate = value as Candidate
              if (candidate.specific_key && candidate.specific_key.content === queueItem.url) {
                candidate.specific_key.status = queueItem.status
              }
            }
            if (key.startsWith('jobDescription')) {
              const jobAdds: ManagerAndCompany = value as ManagerAndCompany

              if (
                jobAdds.companyLinkedInUrl.content &&
                jobAdds.companyLinkedInUrl.content === queueItem.url
              ) {
                jobAdds.companyLinkedInUrl.status = queueItem.status
              }
              if (
                jobAdds.hiringManagerLinkedIn &&
                jobAdds.hiringManagerLinkedIn.content &&
                jobAdds.hiringManagerLinkedIn.content === queueItem.url
              ) {
                jobAdds.hiringManagerLinkedIn.status = queueItem.status
              }
            }
          })
        })
      }
    })

    await setState({ ...currentState }, storage)
  }
}

export async function updateLink(storage: any = 'localStorage') {
  const importsData = await getImport()

  const currentState = await getState(storage)

  if (!currentState.queue) {
    return
  }

  for (const queueItem of currentState.queue) {
    const importDataItem = importsData.find((item: any) => item.id === queueItem.importId)
    if (importDataItem.current_url) {
      queueItem.url = importDataItem.current_url

      queueItem.count_processed = importDataItem.count_processed
    }
  }

  await setState({ ...currentState }, storage)
}
