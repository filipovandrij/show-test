import axios from 'axios'
import { getBaseUrl } from '../../../api/baseUrl'
import { getToken } from '../../../api/getToken'

export const getEmails = async () => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()
  const url = `${baseUrl}/api/email-accounts/`

  try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error: any) {
      console.error('An error occurred:', error)
    }
}