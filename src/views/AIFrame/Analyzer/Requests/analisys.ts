import axios from 'axios'
import { getBaseUrl } from '../../../../api/baseUrl'
import { getToken } from '../../../../api/getToken'

export const analisys = async (case_id: number) => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()
  const endpoint = `${baseUrl}/api/case/candidate_linkedin_analysis/`
  const start_date = String(Date.now())
  const data = { case_id, start_date }
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

export const updateAnalyze = async (id: number, updateCase: any) => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()
  const endpoint = `${baseUrl}/api/analyzer_feedback/${id}/`
  try {
    const response = await axios.patch(endpoint, updateCase, {
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
