import axios from 'axios'
import { getBaseUrl } from '../../../../api/baseUrl'
import { getToken } from '../../../../api/getToken'

export const getEmailSettings = async () => {
    const baseUrl = await getBaseUrl()
    const token = await getToken()
    const url = `${baseUrl}/api/constructor/planner/settings/`
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