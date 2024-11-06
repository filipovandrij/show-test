import { updateImport } from '../../../views/AIFrame/DataImport/Import'
import {
  processApollo,
  processLinkedInCompany,
  processLinkedInJob,
  processLinkedInProfile,
} from '../bgParsers'
import { fetchQueue, updateQueueItem } from './enqueueRequests'

export const processQueueManagerApollo = async () => {
  console.log('start ManagerApollo')
  const queue = await fetchQueue()

  if (queue && queue.length === 0) {
    return
  }

  if (
    queue.some((item: any) => item.import_instance && item.import_instance.status === 'processing')
  ) {
    console.log('An element in processing was detected. Stop.')
    return
  }

  const currentTime = Date.now()
  const processingItem = queue.find(
    (item: any) =>
      item.import_instance &&
      item.import_instance.status === 'processing' &&
      currentTime - item.import_instance.last_timestamp > 120000
  )
  if (processingItem) {
    console.log('An element in processing for more than 2 minutes was detected.')
    await updateImport(processingItem.import_instance.id, {
      status: 'done',
    })
    await processQueueManagerApollo()
  } else if (
    queue.some((item: any) => item.import_instance && item.import_instance.status === 'processing')
  ) {
    console.log('An element in processing was detected. Stop.')
    return
  }

  const itemToProcess = queue.find(
    (item: any) =>
      item.source === 'apollo' &&
      (item.import_instance.status === 'planned' ||
        item.import_instance.status === 'paused due to error' ||
        (item.import_instance.status === 'done' &&
          item.import_instance.count_processed < item.import_instance.total_entities))
  )
  if (!itemToProcess) {
    console.log('There are no items to process.')
    return
  }

  await updateImport(itemToProcess.import_instance.id, {
    status: 'processing',
  })

  let processingResult = 'error'
  if (
    itemToProcess.entity === 'parseContactsApollo' ||
    itemToProcess.entity === 'parseCompaniesApollo'
  ) {
    processingResult = await processApollo(
      itemToProcess.import_instance.current_url,
      itemToProcess.entity,
      itemToProcess.import_instance.total_entities,
      itemToProcess.minDelay,
      itemToProcess.maxDelay,
      itemToProcess.import_instance.guid,
      itemToProcess.import_instance.count_processed,
      itemToProcess.import_instance.import_number,
      itemToProcess.import_instance.id,
      itemToProcess.tag_ids,
      itemToProcess.validate
    )
  }
  const status =
    processingResult === 'error'
      ? 'error'
      : processingResult === 'processing'
      ? 'processing'
      : processingResult == 'paused due to error'
      ? 'paused due to error'
      : 'done'

  await updateImport(itemToProcess.import_instance.id, {
    status,
  })

  await processQueueManagerApollo()
}

export const processQueueManagerLinkedIn = async () => {
  const queue = await fetchQueue()
  if (!queue || queue.length === 0) {
    console.log('The queue is empty.')
    return
  }

  if (queue.some((item: any) => item.status === 'processing')) {
    console.log('An element in processing was detected. Stop.')
    return
  }

  const itemToProcess = queue.find(
    (item: any) => item.status === 'planned' && item.source === 'linkedin'
  )
  if (!itemToProcess) {
    console.log('There are no items to process.')
    return
  }

  await updateQueueItem(itemToProcess.id, { status: 'processing' })

  chrome.runtime.sendMessage({ type: 'UPDATE_DATA' })
  let processingResult = 'error'
  if (itemToProcess.entity === 'profile') {
    processingResult = await processLinkedInProfile(itemToProcess.url)
  }
  if (itemToProcess.entity === 'job_description') {
    processingResult = await processLinkedInJob(itemToProcess.url)
  } else if (itemToProcess.entity === 'company') {
    processingResult = (await processLinkedInCompany(itemToProcess.url)) as string
  }

  const status =
    processingResult === 'error'
      ? 'error'
      : processingResult === 'processing'
      ? 'processing'
      : 'done'
  chrome.runtime.sendMessage({ type: 'UPDATE_DATA' })

  await updateQueueItem(itemToProcess.id, { status })

  await processQueueManagerLinkedIn()
}
