import { styled } from '@mui/system'
import { Button, CircularProgress, Tooltip, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Add, Work } from '@mui/icons-material'
import { LinkAnalyzer } from '../findCandidatesState'
import Logo from '../../components/Icons/Logo'
import { Bot } from '../../components/Icons/Bot'
import { addNewCase, fetchCases } from '../../views/AIFrame/Analyzer/Requests/requestsCase'

const Container = styled('div')`
  display: flex;
  gap: 16px;

  @media (max-width: 991px) {
    flex-direction: column-reverse;
    margin: 8px 0 40px 8px;
  }

  @media (max-width: 768px) {
    margin: 0;
    flex-direction: row;
  }
`

const LoadingButton = styled(Button)<{ loading: boolean; existing: boolean }>`
  border-radius: 2.4rem;
  gap: 8px;
  min-height: 40px;

  ${({ existing }) =>
    existing
      ? `
    background-color: white;
    color:  #ab47bc;
    border: 1.50px solid #ab47bc;
    
    &:hover {
        background-color: white;
      }

    &:focus {
      background-color: white;
    }

    &:svg {
      color:  #ab47bc;
    }
  `
      : `
    background-color: #ab47bc;
    color: white;
    
    &:focus,
     &:hover {
        background-color: #790E8B;
     }
     
    &:svg {
      color: white;
    }
  `}

  ${({ loading }) =>
    loading
      ? `
    background-color: rgb(239, 226, 242);
    color: rgba(0, 0, 0, 0.38);
    border: none;
  `
      : ''}
`

export const LoadingIndicator = () => {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <CircularProgress color='inherit' size={16} />
      Processing job info
    </div>
  )
}

export const DescriptionTooltip = () => {
  return (
    <div style={{ margin: '4px' }}>
      <Typography variant='h5' sx={{ color: 'white' }}>
        Log in to access AI assisted automation for Staffing and Recruitment.
      </Typography>
    </div>
  )
}

type Props = {
  url: string
  chat?: LinkAnalyzer
  token?: string
  managerUrl: string
  companyUrl: string
}

const openFrame = (id: number) => {
  const frame = document.querySelector('#ain-frame')
  if (!frame) {
    chrome.runtime.sendMessage({
      action: 'createMainFrame',
    })
  }
  setTimeout(
    () =>
      chrome.runtime.sendMessage({
        action: 'navigate',
        url: `/analyzer/${id}`,
      }),
    2000
  )
}

export const LinkedinJobButton = ({ managerUrl, companyUrl, url, chat, token }: Props) => {
  const [isExisting, setIsExisting] = useState(!!chat)
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState<number | undefined>(undefined)
  const [hovered, setHovered] = useState(false)

  const findCase = async () => {
    const allCases = await fetchCases()
    for (const item of allCases) {
      if (item.job_description.url === url) {
        setId(item.id)
        setIsExisting(true)
        break
      }
    }
  }

  useEffect(() => {
    findCase()
  }, [])
  const handleIsExisting = () => {
    console.log('вот я ис', id)
    if (id) {
      openFrame(id)
    }
  }

  // useCallback(
  //   (state: State) => {
  //     if (id !== null) {
  //       openFrame(id)
  //       return
  //     }
  //     const index = state?.linkAnalyzer?.findIndex(
  //       (findCandidate) => findCandidate?.formState?.jobDescription?.specific_key?.content === url
  //     ) as number
  //     openFrame(index)
  //     // setId(index)
  //   },
  //   [id]
  // )

  const handleNotExisting = useCallback(async () => {
    setIsExisting(true)

    const res = await addNewCase({
      job_url: url,
      hr_url: managerUrl,
      company_url: companyUrl,
    })

    // setTimeout(() => {
    //   chrome.runtime.sendMessage({ type: 'processQueue' })
    // }, 3000)

    if (res.id) {
      openFrame(res.id)
    }
  }, [])

  const handleClick = useCallback(async () => {
    isExisting ? handleIsExisting() : handleNotExisting()
  }, [isExisting])

  useEffect(() => {
    const listener = (request: any) => {
      if (request.action === 'parseLinkedinJobFinished') {
        setLoading(false)
      }

      if (request.action === 'parseLinkedinJobInit') {
        setLoading(true)
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

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

  const handleOpenLogin = useCallback(() => {
    const frame = document.querySelector('#ain-frame')
    if (!frame) {
      chrome.runtime.sendMessage({
        action: 'createMainFrame',
      })
    }
  }, [])

  const handleClickAutomations = useCallback(() => {
    chrome.runtime.sendMessage({
      action: 'openSelectAutomations',
      name: 'jobDescription',
      index: 0,
    })
  }, [])

  const getTooltipContent = useMemo(() => {
    if (loading) {
      return (
        <Typography sx={{ color: 'white' }} variant='h6'>
          Gathering job info. Please wait...
        </Typography>
      )
    }

    if (isExisting) {
      return (
        <>
          <Typography sx={{ color: 'white' }} variant='h6'>
            Recruitment Case Overview
          </Typography>
          <Typography sx={{ color: 'white' }} variant='body1'>
            View the current status of this recruitment case.
            <br />
            Last worked on: {chat?.date || new Date().toLocaleString()}.<br />
            Candidates found: {(chat?.fields?.length || 1) - 1}.<br />
            Click to review detailed case history, manage candidates, or update the employer on the
            progress.
          </Typography>
        </>
      )
    }

    return (
      <>
        <Typography sx={{ color: 'white' }} variant='h6'>
          Initiate Recruitment Process
        </Typography>
        <Typography sx={{ color: 'white' }} variant='body1'>
          Clicking this button will create a new recruitment case for this position. You will be
          able to add candidates, track progress, and facilitate communication between candidates
          and the employer. Get started now to find the perfect fit for this role!
        </Typography>
      </>
    )
  }, [loading, chat, isExisting])

  return (
    <Container>
      {token && (
        <Tooltip title={getTooltipContent}>
          <LoadingButton
            variant='contained'
            onClick={handleClick}
            loading={loading}
            existing={isExisting}
          >
            {loading ? (
              <LoadingIndicator />
            ) : isExisting ? (
              <>
                <Work />
                Review case status
              </>
            ) : (
              <>
                <Add />
                Initiate Recruitment
              </>
            )}
          </LoadingButton>
        </Tooltip>
      )}
      {isExisting ? (
        <Button
          onClick={handleClickAutomations}
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
              <>
                <Logo />
                AIDE
              </>
            )}
          </Button>
        </Tooltip>
      )}
    </Container>
  )
}
