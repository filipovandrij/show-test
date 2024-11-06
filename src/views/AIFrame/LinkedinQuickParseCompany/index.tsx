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

const LinkedinQuickParseCompanyContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const LinkedinQuickParseCompanyComponent = () => {
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
        action: 'parseSimpleLinkedinCompany',
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
      const mode = storage?.linkedinQuickParse === 'auto' ? 'manual' : 'auto'
      chrome.storage.local.set({ linkedinQuickParse: mode }).then(() => {
        setAuto(mode === 'auto')
      })
    })
  }, [])

  const handleGoogleSheet = async () => {
    const res = await api.getGsheetsUrl()
    const urls = await res.json()
    await loadNewTab(urls.message.Linkedin_user_profile)
  }

  useEffect(() => {
    chrome.storage.local.get().then((storage) => {
      if (storage?.linkedinQuickParse === 'auto') {
        setAuto(true)
        const linkedinQuickParseInfo = storage.linkedinQuickParseInfo
        setTimeout(() => {
          setLoading(false)
          setInfo(linkedinQuickParseInfo)
        }, 500)
      } else {
        setLoading(false)
      }
    })
  }, [])

  useEffect(() => {
    const listener = (request: any) => {
      if (request.action === 'parseSimpleLinkedinProfileFinished') {
        chrome.storage.local.get().then((storage) => {
          const linkedinQuickParseInfo = storage.linkedinQuickParseInfo
          linkedinQuickParseInfo && setInfo(linkedinQuickParseInfo)
          setLoading(false)
        })
      }

      if (request.action === 'parseSimpleLinkedinProfileReset') {
        setLoading(false)
        setInfo(undefined)
      }

      if (request.action === 'parseSimpleLinkedinProfileInit') {
        setLoading(true)
        setInfo(undefined)
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  return (
    <LinkedinQuickParseCompanyContainer>
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
    </LinkedinQuickParseCompanyContainer>
  )
}

export const LinkedinQuickParseCompany = withAvailableInUrl({
  url: String.raw`^https:\/\/www\.linkedin\.com\/company\/[a-zA-Z0-9-]+\/?$`,
})(LinkedinQuickParseCompanyComponent)
