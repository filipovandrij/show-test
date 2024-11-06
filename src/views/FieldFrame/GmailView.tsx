import { useCallback, useContext, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import api from '../../api'
import { AppContext } from '../../app/appContext'

const GmailViewContent = styled('div')`
  padding: 8px;
  text-align: justify;
  position: absolute;
  overflow: auto;
`

export const GmailView = () => {
  const { frameId } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [text, setText] = useState('')
  const listener = useCallback((request: any) => {
    request.action &&
      request.action === 'updateStorageSharedData' &&
      chrome.storage.local.get().then((storage) => {
        setEmail(storage?.ainEmail || '')
      })
  }, [])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [listener])

  useEffect(() => {
    chrome.storage.local.get().then((storage) => {
      setEmail(storage?.ainEmail || '')
    })
  }, [])

  useEffect(() => {
    email &&
      frameId &&
      api
        .gmailData({
          email,
          fields: { identifier: [frameId] },
        })
        .then((r) => {
          const v = r ? ('value' in r ? r.value : 'error' in r ? r.error : undefined) : undefined
          v && setText(String(v))
        })
  }, [email, frameId])

  return <GmailViewContent>{text}</GmailViewContent>
}
