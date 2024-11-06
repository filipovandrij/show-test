import { Button as MuiButton, styled } from '@mui/material'
import { useEffect, useState } from 'react'
import Logo from '../../components/Icons/Logo'

type Props = {
  caseId?: number
  url?: string
  token?: string
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

const SalesNavigatorSearchButton = ({ caseId, url, token }: Props) => {
  const [frame, setFrame] = useState<Element | null>(null)
  console.log(caseId)
  console.log(url)
  console.log(token)

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

  const openFrame = (id: number) => {
    if (!frame) {
      console.log('createMainFrame')
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
    console.log('find frame', currentFrame)
    setFrame(currentFrame)
    caseId && openFrame(caseId)
  }, [])

  return (
    <Container>
      <Button activeIndex existing auth>
        Candidate
      </Button>
      <MuiButton
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
        Aide
      </MuiButton>
    </Container>
  )
}

export default SalesNavigatorSearchButton
