import { useCallback, useEffect, useRef, useState } from 'react'
import { styled } from '@mui/system'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Import from './Import'
import { getToken } from '../../../api/getToken'
import { getBaseUrl } from '../../../api/baseUrl'
import { TImport } from './Import/model'
import { checkTestingDev } from '../../../chrome/queue/checkTestingDev'
import { Tag } from './Import/CreateContent'
import { processQueueManagerApollo } from '../../../chrome/queue/newQueue/queueManager'

const Title = styled('div')`
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px ${({ theme: { palette } }) => palette.colorBorder} solid;
  background-color: ${({ theme: { palette } }) => palette.colorBgContainer};
  padding: 10px;
  gap: 12px;
  color: #bdbdbd;
  align-items: center;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`

const BackBtn = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  background-color: #ebebeb;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    cursor: pointer;
    background-color: #ab47bc;
    color: #fff;

    svg {
      color: #fff;
    }
  }
`

const Content = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px !important;
`

const getImports = async () => {
  const token = await getToken()
  const baseUrl = await getBaseUrl()

  if (token) {
    return fetch(`${baseUrl}/api/import/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  }
}

const getImport = async (id: number) => {
  const token = await getToken()
  const baseUrl = await getBaseUrl()

  if (token) {
    return fetch(`${baseUrl}/api/import/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  }
}

const ImportHistory = () => {
  const navigate = useNavigate()
  const [imports, setImports] = useState<TImport[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const activeTimeout = useRef<NodeJS.Timeout>()

  const location = useLocation()
  const { importNavigate } = location.state || {}

  useEffect(() => {
    getImports()
      .then((res) => res?.json())
      .then((data: TImport[]) => setImports(data.sort((a, b) => b.id - a.id)))
  }, [])

  async function fetchTags() {
    const token = await getToken()
    const baseUrl = await getBaseUrl()

    try {
      const response = await axios.get(`${baseUrl}/api/retrieve_tags/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setTags(response.data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message)
        if (error.response) {
          console.error('Response data:', error.response.data)
          console.error('Response status:', error.response.status)
          console.error('Response headers:', error.response.headers)
        } else if (error.request) {
          console.error('Request was made, but no response received:', error.request)
        } else {
          console.error('Error setting up request:', error.message)
        }
      } else {
        console.error('An error occurred:', error)
      }
    }
  }
  useEffect(() => {
    fetchTags()
  }, [])

  const pollingImport = useCallback(async (id: number) => {
    try {
      const res = await getImport(id)
      const data = await res?.json()

      setImports((prev) => {
        const tmp = [...prev]

        const idx = tmp.findIndex((imp) => imp.id === id)
        tmp[idx] = data

        return tmp
      })

      if (data.status === 'done' || data.status === 'paused') {
        clearTimeout(activeTimeout.current)
        return
      }

      activeTimeout.current = setTimeout(() => pollingImport(id), 5000)
    } catch (e) {
      clearTimeout(activeTimeout.current)
    }
  }, [])

  const polling = useCallback(() => {
    getImports()
      .then((res) => res?.json())
      .then((data: TImport[]) => setImports(data.sort((a, b) => b.id - a.id)))

    clearTimeout(activeTimeout.current)
    activeTimeout.current = setTimeout(() => polling(), 5000)
  }, [])

  useEffect(() => {
    polling()
  }, [])

  useEffect(() => {
    return () => clearTimeout(activeTimeout.current)
  }, [])

  const [devCheck, setDevCheck] = useState<boolean>(false)

  const checkTest = async () => {
    const checkTesting = await checkTestingDev()
    return setDevCheck(checkTesting)
  }

  useEffect(() => {
    checkTest()
    processQueueManagerApollo()
  }, [])

  const processApoll = async () => {
    processQueueManagerApollo()
  }
  return (
    <>
      <Title>
        <BackBtn onClick={() => navigate('/main')}>
          <ArrowBackIosIcon style={{ marginLeft: '9px' }} />
        </BackBtn>
        Import
      </Title>
      <Content>
        {imports.map((imp) => (
          <Import
            devCheck={devCheck}
            importNavigate={importNavigate}
            tags={tags
              .filter((tag: Tag) => imp.tag_ids?.includes(tag.tag_id))
              .map((tag: Tag) => tag.tag_name)}
            key={imp.id}
            timeout={activeTimeout}
            polling={pollingImport}
            {...imp}
          />
        ))}
      </Content>
      {devCheck && <button onClick={processApoll}>processApoll</button>}
    </>
  )
}

export default ImportHistory
