import React, { useCallback, useContext, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { AppContext } from '../../app/appContext'
import { sendDestroyFrameAction } from '../../utils/frames/sendDestroyFrameAction'

const EditViewContent = styled('div')`
  padding-top: 10px;
  text-align: justify;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`

const MonitoringView = () => {
  const { frameId } = useContext(AppContext)
  const [info, setInfo] = useState('Parsing is in progress at the moment')
  const listener = useCallback((request: any) => {
    if(request.action === 'finishMonitoring') {
      setInfo('Parsing completed')
      setTimeout(() => sendDestroyFrameAction(frameId), 3000)
    }
  }, [])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [listener])

  return (
    <EditViewContent>
      {info}
    </EditViewContent>
  )
}

export default MonitoringView
