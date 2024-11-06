import styled from '@emotion/styled'
import StorageIcon from '@mui/icons-material/Storage'
import DoneIcon from '@mui/icons-material/Done'
import { Switch, Typography } from '@mui/material'

import { useCallback, useEffect, useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { CommandCard } from '../../../components/CommandCard'
import { copyTextToClipboard } from '../../../utils/copyTextToClipboard'
import { withAvailableInUrl } from '../../../utils/withAvailableInUrl'
import api from '../../../api'
import { GoogleSheet } from '../../../components/Icons/GoogleSheet'
import { loadNewTab } from '../../../utils/newTab'
import { Preloader } from '../../../components/Preloader'

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
`

const LinkedinJobQuickParseContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const LinkedinJobQuickParseComponent = () => {
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [info, setInfo] = useState<string>()
  const [auto, setAuto] = useState(false)

  const collectSimpleProfile = useCallback(async () => {
    setLoading(true)
    setHasError(false)
    setInfo(undefined)

    try {
      const tab = await (await chrome.tabs.query({ active: true, currentWindow: true }))[0]

      if (tab.id === undefined) throw Error()

      const res = await chrome.tabs.sendMessage(tab.id, {
        action: 'parseLinkedinJob',
        url: tab.url,
      })

      const r = await api.savingData(res.parsedInfo)

      if (!r.ok) throw Error()

      setInfo(JSON.stringify(res.parsedInfo, null, 2))
    } catch (error) {
      console.error(error)
      setHasError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const onChangeAuto = useCallback(() => {
    chrome.storage.local.get().then((storage) => {
      const mode = storage?.linkedinJobQuickParse === 'auto' ? 'manual' : 'auto'
      chrome.storage.local.set({ linkedinJobQuickParse: mode }).then(() => {
        setAuto(mode === 'auto')
      })
    })
  }, [])

  useEffect(() => {
    chrome.storage.local.get().then((storage) => {
      if (storage?.linkedinJobQuickParse === 'auto') {
        setAuto(true)
        const linkedinJobQuickParseInfo = storage.linkedinJobQuickParseInfo
        setTimeout(() => {
          setLoading(false)
          setInfo(linkedinJobQuickParseInfo)
        }, 500)
      } else {
        setLoading(false)
      }
    })
  }, [])

  useEffect(() => {
    const listener = (request: any) => {
      if (request.action === 'parseLinkedinJobFinished') {
        chrome.storage.local.get().then((storage) => {
          const linkedinJobQuickParseInfo = storage.linkedinJobQuickParseInfo
          linkedinJobQuickParseInfo && setInfo(linkedinJobQuickParseInfo)
          setLoading(false)
        })
      }

      if (request.action === 'parseLinkedinJobInit') {
        setLoading(true)
        setInfo(undefined)
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  const handleGoogleSheet = async () => {
    const res = await api.getGsheetsUrl()
    const urls = await res.json()
    await loadNewTab(urls.message.Job_description)
  }

  useEffect(() => {
    chrome.storage.local.get().then(async (storage) => {
      setAuto(storage?.linkedinJobQuickParse === 'auto')
      setInfo(storage?.linkedinJobQuickParseInfo)
    })
  }, [])

  return (
    <LinkedinJobQuickParseContainer>
      <div style={{ flexGrow: 1 }}>
        <CommandCard
          title={
            <div style={{ display: 'flex', gap: '4px' }}>
              {loading ? (
                <div
                  style={{
                    position: 'relative',
                    width: '24px',
                    height: '24px',
                  }}
                >
                  <Preloader opacity={1} size={12} backgroundColor='inherit' />
                </div>
              ) : info ? (
                <DoneIcon style={{ color: 'green' }} />
              ) : (
                <StorageIcon />
              )}
              <div style={{ flexGrow: 1 }}>Quick Parse</div>
              <SwitchContainer>
                <Switch
                  checked={auto}
                  size='small'
                  onChange={onChangeAuto}
                  onClick={(e) => e.stopPropagation()}
                />
                <Typography variant='body1'>Auto</Typography>
              </SwitchContainer>
              <GoogleSheet
                onClick={async (e) => {
                  e.stopPropagation()
                  await handleGoogleSheet()
                }}
              />
              {info && (
                <ContentCopyIcon
                  onClick={(e) => {
                    e.stopPropagation()
                    copyTextToClipboard(info)
                  }}
                />
              )}
            </div>
          }
          description={
            <div
              style={{
                display: 'flex',
                gap: '4px',
                flexDirection: 'column',
                alignItems: 'baseline',
              }}
            >
              just quickly extracts data from this website
            </div>
          }
          loading={loading}
          onClick={collectSimpleProfile}
          hasError={hasError}
        />
      </div>
    </LinkedinJobQuickParseContainer>
  )
}

export const LinkedinJobQuickParse = withAvailableInUrl({
  url: String.raw`https://www.linkedin.com/jobs/view/\d+\/`,
})(LinkedinJobQuickParseComponent)
