import { useCallback, useContext, useEffect, useState } from 'react'
import {
  Dialog as MUIDialog,
  DialogTitle as MUIDialogTitle,
  DialogContent as MUIDialogContent,
} from '@mui/material'
import { styled } from '@mui/system'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import HistoryIcon from '@mui/icons-material/History'
import { useAppStateSelector } from '../../../hooks/useAppStateSelector'
import { CommandCard } from '../../../components/CommandCard'
import { gptViews } from './views'
import { GptContextProvider } from './context'
import { GptContext } from './context/GptContextProvider'

const Dialog = styled(MUIDialog)`
  .MuiDialog-paper {
    position: relative;
    background-color: ${({ theme: { palette } }) => palette.colorBgContainer};
  }
`

const Btn = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  background-color: #ebebeb;
  border-radius: 4px;
  cursor: pointer;
`

const DialogTitle = styled(MUIDialogTitle)`
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

const DialogContent = styled(MUIDialogContent)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 !important;
`

const ConnectGptComponent = () => {
  const { setView, view, setConversationId } = useContext(GptContext)
  const gptSession = useAppStateSelector((state) => state.gptSession)
  const [gptModalOpen, setGptModalOpen] = useState(false)
  const [windowId, setWindowId] = useState<number>()
  const View = gptViews[view]

  const openGptAuthWindow = useCallback(() => {
    chrome.windows.create(
      {
        type: 'panel',
        url: 'https://chat.openai.com/',
      },
      (window) => {
        setWindowId(window?.id)
      }
    )
  }, [])

  const openGptModal = useCallback(() => {
    setGptModalOpen(true)
  }, [])

  const openHistoryView = useCallback(() => {
    setView('History')
  }, [setView])

  const openChatView = useCallback(() => {
    setConversationId(undefined)
    setView('Chat')
  }, [setConversationId, setView])

  const onCommandClick = useCallback(() => {
    gptSession?.accessToken && openGptModal()
    !gptSession?.accessToken && openGptAuthWindow()
  }, [gptSession?.accessToken, openGptAuthWindow, openGptModal])

  useEffect(() => {
    if (gptSession?.accessToken && windowId) {
      chrome.windows.remove(windowId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gptSession?.accessToken])

  useEffect(() => {
    chrome.runtime.sendMessage({
      action: 'update_gpt_session',
    })
  }, [])

  useEffect(() => {
    const listener = (id: number) => {
      setWindowId((windowId) => (id === windowId ? undefined : windowId))
    }
    chrome.windows.onRemoved.addListener(listener)
  }, [])

  return (
    <>
      <Dialog open={gptModalOpen} fullScreen>
        <DialogTitle>
          <Btn onClick={() => setGptModalOpen(false)}>
            <ArrowBackIosIcon style={{ marginLeft: '9px' }} />
          </Btn>
          <Btn
            onClick={openHistoryView}
            style={{ backgroundColor: 'rgb(171, 71, 188)', color: '#fff' }}
          >
            <HistoryIcon />
          </Btn>
          <Btn
            onClick={openChatView}
            style={{ backgroundColor: 'rgb(171, 71, 188)', color: '#fff' }}
          >
            Chat
          </Btn>
        </DialogTitle>
        <DialogContent>
          <View />
        </DialogContent>
      </Dialog>
      <CommandCard
        title={'GPT (Alpha)'}
        description={`${gptSession?.accessToken ? 'Start' : 'Connect to'} GPT`}
        onClick={onCommandClick}
        // ready={!!windowId || gptModalOpen}
      />
    </>
  )
}

export const ConnectGpt = () => {
  return (
    <GptContextProvider>
      <ConnectGptComponent />
    </GptContextProvider>
  )
}
