import StorageIcon from '@mui/icons-material/Storage'
import { useCallback, useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import styled from '@emotion/styled'
import DoneIcon from '@mui/icons-material/Done'
import { copyTextToClipboard } from '../../../utils/copyTextToClipboard'
import { CommandCard } from '../../../components/CommandCard'
import { withAvailableInUrl } from '../../../utils/withAvailableInUrl'
import api from '../../../api'
import { GoogleSheet } from '../../../components/Icons/GoogleSheet'
import { loadNewTab } from '../../../utils/newTab'
import { enqueueItemNew } from '../../../chrome/queue/newQueue/enqueueRequests'
import { processQueueManagerLinkedIn } from '../../../chrome/queue/newQueue/queueManager'

const LinkedinFullParseContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const LinkedinFullParseComponent = () => {
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [info, setInfo] = useState<string>()

  const collectProfile = useCallback(async () => {
    setLoading(true)
    setHasError(false)
    setInfo(undefined)

    const currentTab: any = await (
      await chrome.tabs.query({ active: true, currentWindow: true })
    )[0]

    enqueueItemNew({
      url: currentTab.url,
      entity: 'profile',
      status: 'planned',
      source: 'linkedin',
      fingerprint: '123',
    })
    setTimeout(() => {
      processQueueManagerLinkedIn()
    }, 1000)
  }, [])

  const handleGoogleSheet = async () => {
    const res = await api.getGsheetsUrl()
    const urls = await res.json()
    await loadNewTab(urls.message.Linkedin_user_profile)
  }

  return (
    <LinkedinFullParseContainer>
      <div style={{ flexGrow: 1 }}>
        <CommandCard
          title={
            <div style={{ display: 'flex', gap: '4px' }}>
              {info ? <DoneIcon style={{ color: 'green' }} /> : <StorageIcon />}
              <div style={{ flexGrow: 1 }}>Full Parse</div>
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
              takes control of your browser, navigates page and collects all data about the profile
            </div>
          }
          loading={loading}
          onClick={collectProfile}
          hasError={hasError}
        />
      </div>
    </LinkedinFullParseContainer>
  )
}

export const LinkedinFullParse = withAvailableInUrl({
  url: String.raw`^https:\/\/www\.linkedin\.com\/in\/[^\/]+\/?$`,
})(LinkedinFullParseComponent)
