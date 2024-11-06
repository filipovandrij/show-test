import { useContext, useState, useCallback, useEffect } from 'react'
import { styled } from '@mui/system'
import { IconButton, Typography } from '@mui/material'
import { AppContext } from '../../app/appContext'
import { Close } from '../../components/Icons/Close'
import { sendDestroyFrameAction } from '../../utils/frames/sendDestroyFrameAction'
import { Views, views } from './views'
import { isHostAccepted, viewByHost } from './hosts'

const FieldFrameContainer = styled('div')`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`

const FieldFrameHeader = styled('div')`
  height: 54px;
  background-color: #f2f6fc;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
`

const FieldFrameContent = styled('div')`
  flex-grow: 1;
  background-color: ${({ theme: { palette } }) => palette.colorBgContainer};
  position: relative;
  padding: 10px;
`

const ResizeAreaX = styled('div')`
  position: absolute;
  width: 10px;
  height: calc(80% - 54px);
  right: 20px;
  top: calc(10% + 54px);
  border-radius: 8px;
  cursor: col-resize;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`

const ResizeAreaY = styled('div')`
  position: absolute;
  height: 10px;
  width: 80%;
  left: 10%;
  bottom: 20px;
  border-radius: 8px;
  cursor: row-resize;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`

export const FieldFrame = () => {
  const { frameId } = useContext(AppContext)
  const [mode, setMode] = useState<'reposition' | 'resizeX' | 'resizeY' | 'inactive'>('inactive')
  const [tabId, setTabId] = useState<number>()
  const [view, setView] = useState<Views>()

  const activate = useCallback(() => setMode('reposition'), [])
  const deactivate = useCallback(() => setMode('inactive'), [])

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (mode === 'reposition' && tabId !== undefined) {
        chrome.tabs.sendMessage(tabId, {
          action: 'setFramePosition',
          meta: { top: e.movementY, left: e.movementX, frameId },
        })
      }

      if (mode === 'resizeX' && tabId !== undefined) {
        chrome.tabs.sendMessage(tabId, {
          action: 'setFrameSize',
          meta: {
            width: e.movementX > 0 ? e.movementX * 1.1 : e.movementX,
            frameId,
          },
        })
      }

      if (mode === 'resizeY' && tabId !== undefined) {
        chrome.tabs.sendMessage(tabId, {
          action: 'setFrameSize',
          meta: {
            height: e.movementY > 0 ? e.movementY * 1.1 : e.movementY,
            frameId,
          },
        })
      }
    },
    [frameId, mode, tabId]
  )

  const destroyFrame = useCallback(() => {
    sendDestroyFrameAction(frameId)
  }, [frameId])

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      setTabId(tab.id)
    })
  }, [])

  const Component = view ? views[view] : () => <div>NO VIEW FOR THIS DOMAIN</div>

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      const host = tab.url && new URL(tab.url).host
      isHostAccepted(host) && setView(viewByHost[host])
    })
  }, [])

  return (
    <FieldFrameContainer
      onMouseUp={deactivate}
      onMouseLeave={deactivate}
      onMouseMove={onMouseMove}
      style={{ cursor: mode === 'reposition' ? 'grabbing' : 'initial' }}
    >
      <FieldFrameHeader
        onMouseDown={activate}
        style={{ cursor: mode === 'reposition' ? 'grabbing' : 'grab' }}
      >
        <Typography variant='h5'>{frameId}</Typography>
        <IconButton onClick={destroyFrame}>
          <Close />
        </IconButton>
      </FieldFrameHeader>
      <FieldFrameContent>
        <Component />
      </FieldFrameContent>
      <ResizeAreaX onMouseDown={() => setMode('resizeX')} />
      <ResizeAreaY onMouseDown={() => setMode('resizeY')} />
    </FieldFrameContainer>
  )
}
