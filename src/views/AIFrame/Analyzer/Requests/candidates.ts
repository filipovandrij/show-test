import axios from 'axios'
import { getBaseUrl } from '../../../../api/baseUrl'
import { getToken } from '../../../../api/getToken'
import { CandidateDescription, CaseData } from '../models/CaseData'

export const addCandidateToCase = async (id: number, candidate_url: string) => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()
  const endpoint = `${baseUrl}/api/candidate_element/`
  const data = {
    case: id,
    url: candidate_url,
  }

  try {
    const response = await axios.post(endpoint, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
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
export const deleteCandidateFromCase = async (candidateId: number) => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  try {
    await axios.delete(`${baseUrl}/api/candidate_element/${candidateId}/`, { headers })
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
export const updateCandidate = async (id: number, caseData: CaseData = {}) => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()
  const endpoint = `${baseUrl}/api/candidate_element/${id}/`

  const candidate_description: CandidateDescription = {}
  if (caseData.url) {
    candidate_description.url = caseData.url
  }
  if (caseData.custom_data) {
    candidate_description.custom_data = caseData.custom_data
  }
  if (caseData.instructions) {
    candidate_description.instructions = caseData.instructions
  }
  if (caseData.extracted_pdf) {
    candidate_description.extracted_pdf = caseData.extracted_pdf
  }

  try {
    const response = await axios.patch(endpoint, candidate_description, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
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
export const fetchCandidateById = async (id: number) => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()
  const url = `${baseUrl}/api/candidate_element/${id}/`

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
