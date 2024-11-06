import { styled } from '@mui/system'
import { Button as MuiButton, Tooltip, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Add, Close } from '@mui/icons-material'
import Logo from '../../components/Icons/Logo'
import { LinkAnalyzer } from '../findCandidatesState'
import { getState } from '../state'
import { takeToQueue } from '../queue/AnalyzerQueueManager'
import { Bot } from '../../components/Icons/Bot'
import { DescriptionTooltip, LoadingIndicator } from '../linkedinJob/LinkedinJobButton'
import { fetchCaseById } from '../../views/AIFrame/Analyzer/Requests/requestsCase'
import {
  addCandidateToCase,
  deleteCandidateFromCase,
} from '../../views/AIFrame/Analyzer/Requests/candidates'

type Props = {
  url: string
  token?: string
  caseId?: number
}
const Container = styled('div')`
  display: flex;
  gap: 16px;

  @media (max-width: 991px) {
    flex-direction: column-reverse;
    margin: 0 0 32px 60px;
  }

  @media (max-width: 768px) {
    margin: 0;
    flex-direction: row;
  }
`

const Button = styled(MuiButton)`
  background-color: white;
  border: 1.5px solid #ab47bc;
  border-radius: 2.4rem;

  &:hover {
    border: 1.5px solid #ab47bc;
  }
`

const LoadingButton = styled(Button)<{ loading: boolean; activeIndex: boolean }>`
  border-radius: 2.4rem;
  gap: 8px;
  min-height: 40px;
  text-transform: none;

  &:hover,
  &:focus {
    background-color: ${({ activeIndex }) => (activeIndex ? 'white' : '#790E8B')};
    border-color: #790e8b;
  }

  background-color: ${({ activeIndex }) => (activeIndex ? 'white' : '#AB47BC')};
  color: ${({ activeIndex }) => (activeIndex ? '#AB47BC' : 'white')};

  ${({ loading }) =>
    loading
      ? `
    background-color: rgb(239, 226, 242);
    color: rgba(0, 0, 0, 0.38);
    border: none;
  `
      : ''}
`

export const deleteCandidate = (index: number, url: string) => {
  getState().then((state) => {
    const findCandidates = [...(state.linkAnalyzer || [])]
    const findCandidate = { ...findCandidates[index] }

    if (findCandidate) {
      const indexField = findCandidate.fields.findIndex(
        (field) => findCandidate?.formState?.[field.name]?.specific_key?.content === url
      )

      if (indexField !== -1) {
        delete findCandidate?.formState?.[findCandidate.fields[indexField].name]

        findCandidate.fields.splice(indexField, 1)
        findCandidates[index] = findCandidate

        chrome.runtime.sendMessage({
          action: 'update_link_analyzer',
          value: findCandidates,
        })
      }
    }
  })
}

export const addCandidate = async (
  index: number,
  url: string
): Promise<{ added: boolean; name?: string; fieldsLength?: number }> => {
  let added = false
  let name
  let fieldsLength
  const state = await getState()

  const findCandidates = [...(state.linkAnalyzer || [])]
  const findCandidate = { ...findCandidates[index] }

  if (findCandidate) {
    fieldsLength = findCandidate.fields.length
    if (fieldsLength === 12) {
      return {
        added,
      }
    }

    name = `candidate_${fieldsLength}`

    findCandidate.fields.push({
      name,
      placeholder: 'Enter the link to the LinkedIn candidate profile',
      title: 'Candidate',
      label: 'Link to linkedin candidate profile',
    })

    if (!findCandidate.formState) {
      findCandidate.formState = {}
    }

    findCandidate.formState[name] = {
      specific_key: {
        status: 'added',
        content: url,
      },
    }

    findCandidates[index] = findCandidate
    chrome.runtime.sendMessage({
      action: 'update_link_analyzer',
      value: findCandidates,
    })
    added = true
  }

  setTimeout(async () => {
    await takeToQueue()
  }, 200)

  return {
    added,
    name,
    fieldsLength,
  }
}

export const isExistingCandidate = (url: string, findCandidate?: LinkAnalyzer) => {
  const fields = findCandidate?.fields
  return !!fields?.find(
    (field) => findCandidate?.formState?.[field.name]?.specific_key?.content === url
  )
}

export const LinkedinProfileButton = ({ caseId, url, token }: Props) => {
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isExisting, setIsExisting] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [frame, setFrame] = useState<Element | null>(null)

  const [disabledCandidates, setDisabledCandidates] = useState<boolean>(false)
  console.log(caseId)

  const callback = function (mutationsList: any) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const currentFrame = document.querySelector('#ain-frame')
        if (currentFrame) {
          setFrame(currentFrame)
        } else {
          setFrame(null)
        }
      }
    }
  }

  const observer = new MutationObserver(callback)

  const config = {
    childList: true,
    subtree: true,
  }

  observer.observe(document.documentElement, config)

  const handleOpenLogin = useCallback(() => {
    if (!frame) {
      chrome.runtime.sendMessage({
        action: 'createMainFrame',
      })
    }
  }, [frame])

  const handleNewCandidate = (caseId: number | undefined, url: string) => {
    caseId && addCandidateToCase(caseId, url)
  }

  const handleClick = useCallback(async () => {
    handleOpenLogin()

    if (activeIndex === null) {
      return
    }

    if (isExisting) {
      const checkToDeleteCandidate = async () => {
        if (!caseId) return
        try {
          const innerCase = await fetchCaseById(caseId)
          if (innerCase && innerCase.candidates) {
            for (const item of innerCase.candidates) {
              if (item.url === url) {
                deleteCandidateFromCase(item.id)
                chrome.runtime.sendMessage({ type: 'UPDATE_DATA' })
                chrome.runtime.sendMessage({ type: 'CHECK_BUTTONS' })
                break
              }
            }
          }
        } catch (error) {
          console.error('Ошибка при получении данных кейса:', error)
        }
      }
      checkToDeleteCandidate()

      setIsExisting(false)
      return
    }

    handleNewCandidate(caseId, url)
    chrome.runtime.sendMessage({ type: 'UPDATE_DATA' })
    chrome.runtime.sendMessage({ type: 'CHECK_BUTTONS' })
    checkCandidate()
    setIsExisting(true)
  }, [activeIndex, isExisting])

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'getIdFindCandidates' })
    const listener = (request: any) => {
      if (request.action === 'parseSimpleLinkedinProfileFinished') {
        setLoading(false)
      }
      if (request.action === 'idFindCandidates') {
        setActiveIndex(request.id)
      }
      if (request.action === 'parseSimpleLinkedinProfileInit') {
        setLoading(true)
      }
    }

    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  const getTooltipContent = useMemo(() => {
    let title = 'Add this candidate to a current job case.'

    if (loading) {
      title = 'Gathering job info. Please wait...'
    } else if (activeIndex === null) {
      title = 'Open a job case'
    } else if (isExisting) {
      title = 'Remove this candidate from a current job case.'
    }

    return (
      <Typography sx={{ color: 'white' }} variant='h6'>
        {title}
      </Typography>
    )
  }, [loading, isExisting, activeIndex])

  const checkCandidate = async () => {
    if (!caseId) return

    try {
      const innerCase = await fetchCaseById(caseId)

      if (innerCase && innerCase.candidates) {
        if (innerCase.candidates.length >= 12) {
          setDisabledCandidates(true)
        }
        for (const item of innerCase.candidates) {
          if (item.url === url) {
            setIsExisting(true)
            break
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при получении данных кейса:', error)
    }
  }

  const handleMouseEnter = useCallback(() => {
    if (!token) {
      setHovered(true)
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!token) {
      setHovered(false)
    }
  }, [])

  useEffect(() => {
    checkCandidate()
  }, [caseId, url])

  useEffect(() => {
    frame && caseId ? setActiveIndex(caseId) : setActiveIndex(null)
  }, [caseId, frame])

  // const handleClickAutomations = useCallback(() => {
  //   chrome.runtime.sendMessage({
  //     action: 'openSelectAutomations',
  //     name,
  //     index,
  //   })
  // }, [name, index])

  return (
    <Container>
      {token && (
        <Tooltip title={getTooltipContent}>
          <LoadingButton
            variant='contained'
            loading={loading}
            onClick={handleClick}
            activeIndex={activeIndex === null}
            disabled={disabledCandidates}
          >
            {loading ? (
              <LoadingIndicator />
            ) : (
              <>
                {isExisting ? <Close /> : <Add />}
                Candidate
              </>
            )}
          </LoadingButton>
        </Tooltip>
      )}
      {isExisting ? (
        <Button
          sx={{
            backgroundColor: '#AB47BC',
            borderRadius: '2.4rem',
            '&:hover': {
              backgroundColor: '#790E8B',
            },
            color: 'white',
            gap: '8px',
            minHeight: '40px',
          }}
        >
          <Bot />
          Automations
        </Button>
      ) : (
        <Tooltip title={<DescriptionTooltip />}>
          <Button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleOpenLogin}
            variant='outlined'
            sx={{
              backgroundColor: hovered ? '#AB47BC' : 'white',
              border: '1.5px solid #AB47BC',
              borderRadius: '2.4rem',
              '&:hover': {
                border: '1.5px solid #AB47BC',
                backgroundColor: hovered ? '#790E8B' : 'white',
              },
              color: hovered ? 'white' : '#AB47BC',
              gap: '8px',
              minHeight: '40px',
              minWidth: '90px',
            }}
          >
            {hovered ? (
              'Login'
            ) : (
              <div>
                <Logo />
                AIDE
              </div>
            )}
          </Button>
        </Tooltip>
      )}
    </Container>
  )
}
