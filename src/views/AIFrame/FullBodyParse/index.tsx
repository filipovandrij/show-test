import { useState } from 'react'
import StorageIcon from '@mui/icons-material/Storage'
import DoneIcon from '@mui/icons-material/Done'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { CommandCard } from '../../../components/CommandCard'
import { copyTextToClipboard } from '../../../utils/copyTextToClipboard'
import api from '../../../api'

export const FullBodyParse = () => {
  const [info, setInfo] = useState<string>()
  const [hasError, setHasError] = useState(false)

  const parse = async () => {
    setHasError(false)
    setInfo(undefined)

    try {
      const tab = await (await chrome.tabs.query({ active: true, currentWindow: true }))[0]

      if (tab.id === undefined) throw Error()

      const res = await chrome.tabs.sendMessage(tab.id, {
        action: 'fullBodyParse',
        url: tab.url,
      })
      setInfo(res)

      const r = await api.savingData({ fullPageText: res })

      if (!r.ok) throw Error()
    } catch (error) {
      console.error(error)
      setHasError(true)
    }
  }

  return (
    <CommandCard
      title={
        <div style={{ display: 'flex', gap: '4px' }}>
          {info ? <DoneIcon style={{ color: 'green' }} /> : <StorageIcon />}
          <div style={{ flexGrow: 1 }}>Full page text parse</div>
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
          Extract page text data
        </div>
      }
      onClick={parse}
      hasError={hasError}
    />
  )
}
