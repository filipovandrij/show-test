import axios from 'axios'
import { getBaseUrl } from '../../../../api/baseUrl'
import { getToken } from '../../../../api/getToken'

export const startJobFilter = async (case_id: number) => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()

  try {
    const response = await axios.post(
      `${baseUrl}/api/generate_filters/`,
      {
        case_id,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    console.log('Response:', response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message)
    } else {
      console.error('Unexpected error:', error)
    }
  }
}
