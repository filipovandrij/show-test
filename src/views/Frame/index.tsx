import { useCallback, useContext, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { IconButton, Typography } from '@mui/material'
import { AppContext } from '../../app/appContext'
import { Close } from '../../components/Icons/Close'
import { sendDestroyFrameAction } from '../../utils/frames/sendDestroyFrameAction'
import { Views, views } from './views'

const FieldFrameContainer = styled('div')`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`

const FieldFrameHeader = styled('div')`
  height: 54px;
  background-color: #ffffff;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
`

const FieldFrameContent = styled('div')`
  flex-grow: 1;
  background-color: #ffffff;
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

export const Frame = () => {
  const { frameId, frameType } = useContext(AppContext)
  const [mode, setMode] = useState<'reposition' | 'resizeX' | 'resizeY' | 'inactive'>('inactive')
  const [tabId, setTabId] = useState<number>()
  const [view] = useState<Views>(frameType.split('/')[1] as Views)

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

  const Component = view ? views[view] : () => <div>NO VIEW</div>
  const [, name] = frameId.split('-')

  return (
    <FieldFrameContainer
      onMouseUp={deactivate}
      onMouseLeave={deactivate}
      onMouseMove={onMouseMove}
      style={{ cursor: mode === 'reposition' ? 'grabbing' : 'initial', backgroundColor: '#ffffff' }}
    >
      <FieldFrameHeader
        onMouseDown={activate}
        style={{
          cursor: mode === 'reposition' ? 'grabbing' : 'grab',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{ textAlign: 'center', fontSize: 16, fontFamily: 'Axiforma', fontWeight: 600 }}
          color='text.secondary'
          gutterBottom
        >
          {name === 'custom_data' ? 'Custom Data' : 'Instructions'}
        </Typography>
        <IconButton onClick={destroyFrame}>
          <Close />
        </IconButton>
      </FieldFrameHeader>
      <FieldFrameContent>
        <Component close={destroyFrame} />
      </FieldFrameContent>
      <ResizeAreaX onMouseDown={() => setMode('resizeX')} />
      <ResizeAreaY onMouseDown={() => setMode('resizeY')} />
    </FieldFrameContainer>
  )
}
