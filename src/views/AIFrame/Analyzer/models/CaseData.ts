export interface CaseData {
  url?: string | null
  job_url?: string | null
  hr_url?: string | null
  company_url?: string | null
  custom_data?: { title: string | null; text?: string | null } | string | null
  instructions?: { title: string | null; text?: string | null } | string | null
  extracted_pdf?: { title?: string | null; text?: string | null } | string | null
  history_linkedin?: {
    date: string | null
  } | null
}
export interface JobDescription {
  url?: string | null
  status?: string | null
  hr_url?: { url: string | null; status?: string | null } | {}
  organization_url?: { url: string | null; status?: string | null }
  custom_data?: { title: string | null; text?: string | null } | string | null
  instructions?: { title: string | null; text?: string | null } | string | null
  history_linkedin?: {
    date: string | null
  } | null
}

export interface CandidateDescription {
  url?: string | null
  custom_data?: { title: string | null; text?: string | null } | string | null
  instructions?: { title: string | null; text?: string | null } | string | null
  extracted_pdf?: { title?: string | null; text?: string | null } | string | null
}

export type Option = {
  value: string
  title: string
  content: string
}
