import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Box, IconButton, Typography } from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SettingsIcon from '@mui/icons-material/Settings'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { Fingerprint } from '@mui/icons-material'
import axios from 'axios'
import { TSource } from '../DataImport/Import/model'
import { Apollo } from '../../../components/Icons/apollo'
import { Linkedin } from '../../../components/Icons/Linkedin'
import { QueueItem } from '../../../chrome/queue/QueueManager'
import Status from '../DataImport/Import/Status'
import TaskSettings from './TaskSettings'
import { fetchQueue } from '../../../chrome/queue/newQueue/enqueueRequests'
import { getBaseUrl } from '../../../api/baseUrl'
import { getToken } from '../../../api/getToken'
import { checkTestingDev } from '../../../chrome/queue/checkTestingDev'

interface ContainerInfoAnimatedProps {
  isOpen: boolean
}

const Container = styled('div')`
  display: flex;
  padding: 8px;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  border-radius: 4px;
  background: #ebebeb;
  font-family: Axiforma;
  font-style: normal;
  line-height: 150%;
`

const Content = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px;
`

const Header = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`

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

const ContainerInfo = styled('div')`
  margin-right: 8px;
  height: 26px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  background-color: white;
  border-radius: 4px;
`

const TextLabel = styled('span')`
  font-family: Axiforma;
  font-size: 13px;
  font-weight: 600;
  line-height: 17px;
  letter-spacing: 0em;
  text-align: left;
`

const ScrollContainer = styled('div')<ContainerInfoAnimatedProps>`
  transition: max-height 2s ease-out, opacity 2s ease-out;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  max-height: ${({ isOpen }) => (isOpen ? '500px' : '0')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};

  ${({ isOpen }) =>
    isOpen &&
    `
  overflow-y: auto;
  max-height: 500px;
  &::-webkit-scrollbar {
    width: 10px; 
  }

  &::-webkit-scrollbar-track {
    background: #e0e0e0; 
    border-radius: 12px; 
  }

  &::-webkit-scrollbar-thumb {
    background-color: #AB47BC; 
    border-radius: 10px; 
    border: 2px solid #e0e0e0;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
`}
`

export const deleteQueueElement = async (caseId: number) => {
  const baseUrl = await getBaseUrl()
  const token = await getToken()
  const headers = {
    Authorization: `Bearer ${token}`,
  }
  try {
    await axios.delete(`${baseUrl}/api/queue_element/${caseId}/`, { headers })
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

const groupByFingerPrint = (data: QueueItem[]) => {
  return data.reduce((acc, currentValue) => {
    ;(acc[currentValue.fingerprint] = acc[currentValue.fingerprint] || []).push(currentValue)
    return acc
  }, {} as Record<string, QueueItem[]>)
}
const TaskPlanner = () => {
  const [queueState, setQueueStateNew] = useState<[]>([])

  const [devCheck, setDevCheck] = useState<boolean>(false)

  const checkTest = async () => {
    const checkTesting = await checkTestingDev()
    return setDevCheck(checkTesting)
  }
  const loadData = async () => {
    const queueData = await fetchQueue()
    setQueueStateNew(queueData || [])
  }
  useEffect(() => {
    checkTest()
    loadData()
  }, [])
  console.log('queueStateNew', queueState)
  const navigate = useNavigate()
  const [activeFingerPrint, setActiveFingerPrint] = useState<string | null>(null)

  const toggleFingerPrint = (fingerPrint: string) => {
    setActiveFingerPrint((active) => (active === fingerPrint ? null : fingerPrint))
  }

  const [iconStates, setIconStates] = useState<{
    [key: string]: { fingerprint: boolean; settings: boolean }
  }>({})

  const toggleIconState = (fingerPrint: string, icon: 'fingerprint' | 'settings') => {
    setIconStates((prev) => ({
      ...prev,
      [fingerPrint]: {
        ...prev[fingerPrint],
        [icon]: !prev[fingerPrint]?.[icon],
      },
    }))
  }

  const icons: Partial<Record<TSource, JSX.Element>> = {
    apollo: <Apollo />,
    sales_navigator: <Linkedin />,
    linkedin: <Linkedin />,
  }

  return (
    <>
      <Title>
        <BackBtn onClick={() => navigate('/main')}>
          <ArrowBackIosIcon style={{ marginLeft: '9px' }} />
        </BackBtn>
        Task Planner
      </Title>
      <Content>
        {Object.entries(groupByFingerPrint(queueState)).map(([fingerprint, sources]) => {
          console.log(sources)
          console.log('fingerPrint', fingerprint)

          const isApollo = sources[0].source === 'apollo'

          const sourceIcon = icons[sources[0].source as TSource]
          const isOpen = activeFingerPrint === fingerprint

          const isSettingsOpen = iconStates[fingerprint]?.settings

          return (
            <Container key={fingerprint}>
              <Header onClick={() => toggleFingerPrint(fingerprint)}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      margin: '0 8px',
                    }}
                  >
                    {sourceIcon}
                  </Box>
                  <Typography>{sources[0].source}</Typography>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleIconState(fingerprint, 'fingerprint')
                    }}
                    sx={{
                      color: iconStates[fingerprint]?.fingerprint
                        ? '#AB47BC'
                        : 'rgb(189, 189, 189)',
                    }}
                  >
                    <Fingerprint />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleIconState(fingerprint, 'settings')
                    }}
                    sx={{
                      color: iconStates[fingerprint]?.settings ? '#AB47BC' : 'rgb(189, 189, 189)',
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Box>
                {activeFingerPrint === fingerprint ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Header>
              {activeFingerPrint === fingerprint && (
                <ScrollContainer isOpen={isOpen}>
                  {sources.map((source: any, index) => (
                    <ContainerInfo
                      key={index}
                      onClick={() => {
                        // Используем isApollo для определения, какой guid использовать при навигации
                        const navigateGuid = isApollo ? source.import_instance.guid : source.guid
                        navigate('/data-import', { state: { importNavigate: navigateGuid } })
                      }}
                    >
                      <TextLabel>{source.entity}</TextLabel>
                      <Status status={isApollo ? source.import_instance.status : source.status} />
                      {devCheck && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteQueueElement(source.id)
                            loadData()
                          }}
                        >
                          delete
                        </button>
                      )}
                    </ContainerInfo>
                  ))}
                </ScrollContainer>
              )}
              {isSettingsOpen && <TaskSettings />}
            </Container>
          )
        })}
      </Content>
    </>
  )
}

export default TaskPlanner
