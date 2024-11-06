import styled from '@emotion/styled'
import StorageIcon from '@mui/icons-material/Storage'
import DoneIcon from '@mui/icons-material/Done'
import { Switch, Typography } from '@mui/material'

import { FC, memo, useCallback, useEffect, useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { CommandCard } from '../../../components/CommandCard'
import { copyTextToClipboard } from '../../../utils/copyTextToClipboard'
import { withAvailableInUrl } from '../../../utils/withAvailableInUrl'
import api from '../../../api'
import { GoogleSheet } from '../../../components/Icons/GoogleSheet'
import { loadNewTab } from '../../../utils/newTab'
import { Preloader } from '../../../components/Preloader'
import { useAppStateSelector } from '../../../hooks/useAppStateSelector'

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
`

const LinkedinQuickParseContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const QuickParseComponent: FC<{ url: string }> = memo(({ url }) => {
  const [loading, setLoading] = useState(true)
  const { processing = false, data: info } = useAppStateSelector(
    (state, tabId) =>
      state.quickParse?.[tabId] || ({} as Required<typeof state>['quickParse'][number]),
    'bg'
  )
  const parsers = useAppStateSelector((state) => state.parsers || {})

  const parserKey = Object.keys(parsers).find((parserKey) =>
    new RegExp(parserKey, 'u').test(decodeURIComponent(url))
  )
  const parser = parserKey ? parsers[parserKey] : undefined

  const isLoading = parser?.mode === 'auto' ? loading || processing : processing

  const startParse = useCallback(() => {
    chrome.runtime.sendMessage({ action: 'start_parse' })
  }, [])

  const onChangeAuto = useCallback(() => {
    parserKey &&
      chrome.runtime.sendMessage({
        action: 'toggle_parser_mode',
        parserKey,
      })
  }, [parserKey])

  const handleGoogleSheet = async () => {
    const res = await api.getGsheetsUrl()
    const urls = await res.json()
    await loadNewTab(urls.message.Linkedin_user_profile)
  }

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500)
  }, [])

  return (
    <LinkedinQuickParseContainer>
      <div style={{ flexGrow: 1 }}>
        <CommandCard
          title={
            <div style={{ display: 'flex', gap: '4px' }}>
              {isLoading ? (
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
              <div style={{ flexGrow: 1 }}>Quick Parse NEW</div>
              <SwitchContainer>
                <Switch
                  checked={parser?.mode === 'auto'}
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
          loading={isLoading}
          onClick={startParse}
        />
      </div>
    </LinkedinQuickParseContainer>
  )
})

export const quickParse = (url: string) =>
  withAvailableInUrl({
    url,
  })(QuickParseComponent)
