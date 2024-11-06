import { TQueueEntity } from '../../../../../chrome/queue/QueueManager'

export type TStatus =
  | 'planned'
  | 'in progress'
  | 'done'
  | 'static'
  | 'paused'
  | 'error'
  | 'success'
  | 'processing'
  | 'added'
  | 'paused due to error'

export type TEntity = 'profile' | 'company'

export type TSource = 'zoominfo' | 'apollo' | 'sales_navigator' | 'linkedin' | 'facebook'

export type TUpdatedImport = {
  name: string
  total_entities: number
  status: TStatus
  planned_date: string
  tag_ids?: string[]
  validate?: boolean
  filter_string?: string
  current_url: string
  count_processed: any
  entity: TQueueEntity
  last_timestamp?: any
}

export type TImport = {
  id: number
  name: string
  import_type: string
  related_instances: number
  created_at: string
  updated_at: string
  guid: string
  source: TSource
  entity: TEntity
  filter_string: string
  status?: TStatus
  total_entities: number
  import_number: number
  planned_date: string
  user: number
  created_individuals: number
  count_processed: number
  updated_individuals: number
  count_updated_company: number
  count_created_individual: number
  count_created_company: number
  count_updated_individual: number
  count_duplicate_individual: number
  count_duplicate_company: number
  count_errors: number
  execution_time: number
  tag_ids?: number[]
  validate: boolean
}
