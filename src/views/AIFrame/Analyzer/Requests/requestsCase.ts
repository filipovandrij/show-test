import axios from 'axios'
import { getBaseUrl } from '../../../../api/baseUrl'
import { getToken } from '../../../../api/getToken'
import { CaseData, JobDescription } from '../models/CaseData'

export const fetchCases = async () => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()
  const url = `${baseUrl}/api/analyzer_case/`

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('Response:', response.data)
    return response.data
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

export const fetchCaseById = async (id: number) => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()
  const url = `${baseUrl}/api/analyzer_case/${id}/`

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('Response:', response.data)
    return response.data
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

export const addNewCase = async (caseData: CaseData = {}) => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()
  const endpoint = `${baseUrl}/api/analyzer_case/`

  const job_description: JobDescription = {}
  if (caseData.job_url) {
    job_description.url = caseData.job_url
  }
  if (caseData.hr_url) {
    job_description.hr_url = { url: caseData.hr_url }
  }
  if (caseData.company_url) {
    job_description.organization_url = { url: caseData.company_url }
  }

  const data = { job_description }
  try {
    const response = await axios.post(endpoint, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response.data)
    return response.data
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

export const updateCase = async (id: number, caseData: CaseData = {}) => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()

  const endpoint = `${baseUrl}/api/analyzer_case/${id}/`

  const job_description: JobDescription = {}
  if (caseData.job_url) {
    job_description.url = caseData.job_url
  }
  if (caseData.job_url === null) {
    job_description.url = caseData.job_url
    job_description.status = caseData.job_url
  }
  if (caseData.hr_url || caseData.hr_url === null) {
    job_description.hr_url = { url: caseData.hr_url }
  }
  if (caseData.hr_url === '1') {
    job_description.hr_url = {}
  }
  if (caseData.hr_url === null) {
    job_description.hr_url = { url: caseData.hr_url, status: caseData.hr_url }
  }
  if (caseData.company_url) {
    job_description.organization_url = { url: caseData.company_url }
  }
  if (caseData.company_url === null) {
    job_description.organization_url = { url: caseData.company_url, status: caseData.company_url }
  }
  if (caseData.custom_data) {
    job_description.custom_data = caseData.custom_data
  }
  if (caseData.custom_data === null) {
    job_description.custom_data = { title: caseData.custom_data, text: caseData.custom_data }
  }
  if (caseData.instructions) {
    job_description.instructions = caseData.instructions
  }
  if (caseData.instructions === null) {
    job_description.instructions = { title: caseData.instructions, text: caseData.instructions }
  }
  if (caseData.history_linkedin) {
    job_description.history_linkedin = caseData.history_linkedin
  }
  if (caseData.history_linkedin === null) {
    job_description.history_linkedin = {
      date: caseData.history_linkedin,
    }
  }

  const data = { job_description }
  try {
    const response = await axios.patch(endpoint, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response.data)
    return response.data
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

export const deleteAnalyzerCase = async (caseId: number) => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  try {
    await axios.delete(`${baseUrl}/api/analyzer_case/${caseId}/`, { headers })
    console.log('Delete successful')
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
