import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button as MuiButton, styled, Tooltip, Typography } from '@mui/material'
import { Add, Close } from '@mui/icons-material'
import { Bot } from '../../components/Icons/Bot'
import Logo from '../../components/Icons/Logo'
import {
  addCandidateToCase,
  deleteCandidateFromCase,
} from '../../views/AIFrame/Analyzer/Requests/candidates'
import { fetchCaseById } from '../../views/AIFrame/Analyzer/Requests/requestsCase'

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

type Props = {
  url: string
  token?: string
  caseId?: number
}

const Button = styled(MuiButton)<{ activeIndex: boolean; existing: boolean; auth: boolean }>`
  border-radius: 2.4rem;
  gap: 8px;
  min-height: 40px;
  min-width: 90px;
  text-transform: none;
  border: 1px solid #ab47bc;

  &:hover,
  &:focus {
    background-color: ${({ activeIndex, auth }) => (activeIndex && auth ? 'white' : '#790E8B')};
    border-color: #790e8b;
    color: ${({ activeIndex, auth }) => (auth ? (activeIndex ? '#AB47BC' : 'white') : 'white')};
  }

  background-color: ${({ activeIndex, existing, auth }) =>
    auth && (activeIndex || existing) ? 'white' : '#AB47BC'};
  color: ${({ activeIndex, existing, auth }) =>
    (activeIndex || existing) && auth ? '#AB47BC' : 'white'};
`

const LinkedinSearchButton = ({ url, token, caseId }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isExisting, setIsExisting] = useState(false)
  const [frame, setFrame] = useState<Element | null>(null)
  const [disabledCandidates, setDisabledCandidates] = useState<boolean>(false)

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

  const handleNewCandidate = (caseId: number | undefined, url: string) => {
    caseId && addCandidateToCase(caseId, url)
  }

  const openFrame = (id: number) => {
    const frame = document.querySelector('#ain-frame')
    if (!frame) {
      chrome.runtime.sendMessage({
        action: 'createMainFrame',
      })
    }
    setTimeout(() => {
      chrome.runtime.sendMessage({
        action: 'navigate',
        url: `/analyzer/${id}`,
      })
    }, 2000)
  }

  useEffect(() => {
    const currentFrame = document.querySelector('#ain-frame')
    setFrame(currentFrame)
    caseId && openFrame(caseId)
  }, [])

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
    chrome.runtime.sendMessage({ type: 'processQueue' })
    chrome.runtime.sendMessage({ type: 'UPDATE_DATA' })
    chrome.runtime.sendMessage({ type: 'CHECK_BUTTONS' })
    checkCandidate()
    setIsExisting(true)
  }, [activeIndex, isExisting])

  useEffect(() => {
    checkCandidate()
  }, [caseId, url])

  useEffect(() => {
    frame && caseId ? setActiveIndex(caseId) : setActiveIndex(null)
  }, [caseId, frame])

  const getTooltipContent = useMemo(() => {
    let title = 'Add this candidate to a current job case.'

    if (!token) {
      title = 'login'
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
  }, [isExisting, activeIndex])

  const handleOpenLogin = useCallback(() => {
    if (!token) {
      if (!frame) {
        chrome.runtime.sendMessage({
          action: 'createMainFrame',
        })
      }
    }
  }, [frame])

  // const handleClickAutomations = useCallback(() => {
  //   chrome.runtime.sendMessage({
  //     action: 'openSelectAutomations',
  //     name,
  //     index,
  //   })
  // }, [name, index])

  const handleOpenPlugin = useCallback(() => {
    if (!frame) {
      chrome.runtime.sendMessage({
        action: 'createMainFrame',
      })
    }
  }, [])

  return (
    <Container>
      {frame && token ? (
        <Tooltip title={getTooltipContent}>
          {isExisting ? (
            <Button
              variant='contained'
              onClick={handleClick}
              activeIndex={activeIndex === null}
              existing={isExisting}
              auth={!!token}
            >
              <Close />
              Candidate
            </Button>
          ) : (
            <Button
              variant='contained'
              onClick={handleClick}
              activeIndex={activeIndex === null}
              existing={isExisting}
              auth={!!token}
              disabled={disabledCandidates}
            >
              <Add />
              Candidate
            </Button>
          )}
        </Tooltip>
      ) : !token ? (
        <Tooltip title={getTooltipContent}>
          <Button
            variant='contained'
            onClick={handleClick}
            activeIndex={activeIndex === null}
            existing={isExisting}
            auth={!!token}
          >
            Log in
          </Button>
        </Tooltip>
      ) : null}
      {isExisting && token && frame && (
        <MuiButton
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
        </MuiButton>
      )}

      {!frame && token ? (
        <MuiButton
          onClick={handleOpenPlugin}
          variant='outlined'
          sx={{
            backgroundColor: 'white',
            border: '1.5px solid #AB47BC',
            borderRadius: '2.4rem',
            '&:hover': {
              border: '1.5px solid #AB47BC',
            },
            color: '#AB47BC',
            gap: '8px',
            minHeight: '40px',
            minWidth: '90px',
          }}
        >
          <Logo />
          AIDE
        </MuiButton>
      ) : null}
    </Container>
  )
}

export default LinkedinSearchButton
