import axios from 'axios'
import { getBaseUrl } from '../../../../api/baseUrl'
import { getToken } from '../../../../api/getToken'

const baseUrl = await getBaseUrl()
const token = await getToken()

export const createCsvFile = async (send_type: string) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/csv_individuals/`,
      {
        content_type: `apollo_${send_type}`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    console.log(response.data)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data)
    } else {
      console.error('Unexpected error:', error)
    }
  }
}

export const downloadCsvFile = async (fileId: number) => {
  try {
    const response = await axios.get(`${baseUrl}/api/csv_export/${fileId}/`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'file.csv')
    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)
  } catch (error: any) {
    console.error('Error downloading file:', error)
  }
}

export const fetchFileList = async () => {
  const baseUrl1 = await getBaseUrl()
  const token1 = await getToken()
  try {
    const response = await axios.get(`${baseUrl1}/api/csv_export/`, {
      headers: {
        Authorization: `Bearer ${token1}`,
      },
    })
    console.log(response)
    return response.data
  } catch (error: any) {
    console.error('Error fetching file list:', error)
  }
}

export const deleteCsvFile = async (fileId: number) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/csv_export/${fileId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log('File deleted successfully:', response.data)
  } catch (error: any) {
    console.error('Error deleting file:', error)
  }
}
