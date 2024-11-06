import { setState } from './state'

type EntityInfo = {
  status: 'processing' | 'success' | 'error' | 'edit' | 'added' | 'visible'
  content?: string
  credits?: number
  title?: string
  name?: string
}

export type AnalyzeData = {
  file?: EntityInfo
  specific_key?: EntityInfo
  description?: EntityInfo
  text?: EntityInfo
}

export type FindCandidates = {
  fields: Record<string, string>[]
  formState?: any
  name: string
  date: string
  lastExecution: number
}

export type Action = {
  title?: string
  date?: string
}

export type TStatusLike = 'like' | 'dislike'

export type TResult = {
  title: string
  letter?: string
  loading: boolean
  statusLike?: TStatusLike
  raiting: number
  feedback: boolean
  documentUrl?: string
}

export type JobBoard = {
  employerLinkedInUrl?: EntityInfo
  employerWebsiteUrl?: EntityInfo
  hiringManagerLinkedIn?: EntityInfo
  companyLinkedInUrl?: EntityInfo
}

export type Candidate = {
  candidateOtherProfiles?: EntityInfo
  file?: EntityInfo
}

export type AnalyzerData = JobBoard &
  Candidate & {
    specific_key?: EntityInfo
    instructions?: EntityInfo
    customData?: EntityInfo
    actions?: Record<string, Action>
    filters?: any
  }

export type AnalyzerDataKey = keyof Omit<AnalyzerData, 'actions'>
export type LinkAnalyzer = FindCandidates & {
  formState?: any
  results: TResult[]
  prompts?: Record<string, boolean>
  complete?: boolean
}

export const findCandidatesBg = () => {
  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'update_find_candidates') {
      setState([['findCandidates', request.value]])
    }
    if (request.action === 'update_link_analyzer') {
      setState([['linkAnalyzer', request.value]])
    }
    if (request.action === 'update_find_candidates_last_execution') {
      setState([['lastExecutionFindCandidates', request.value]])
    }
  })
}
