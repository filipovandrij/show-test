import {
  Button,
  IconButton,
  Dialog as MUIDialog,
  DialogTitle as MUIDialogTitle,
  DialogContent as MUIDialogContent,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { Close } from '../../../../components/Icons/Close'
import { EnhanceUIViews, views } from './views'
import { viewByHost, isHostAccepted } from './hosts'
import { withAvailableInUrl } from '../../../../utils/withAvailableInUrl'

const Dialog = styled(MUIDialog)`
  .MuiDialog-paper {
    position: relative;
    background-color: ${({ theme: { palette } }) => palette.colorBgContainer};
  }
`

const DialogTitle = styled(MUIDialogTitle)`
  display: flex;
  justify-content: flex-end;
`

const DialogContent = styled(MUIDialogContent)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px !important;
`

const EnhanceUIComponent = () => {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<EnhanceUIViews>()

  const Component = view ? views[view] : () => <div>NO VIEW FOR THIS DOMAIN</div>

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      const host = tab.url && new URL(tab.url).host
      isHostAccepted(host) && setView(viewByHost[host])
    })
  }, [])
  return view ? (
    <>
      <Dialog open={open} fullScreen>
        <DialogTitle>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Component />
        </DialogContent>
      </Dialog>
      <Button onClick={() => setOpen(true)} variant='contained' color='primary'>
        ENHANCE UI
      </Button>
    </>
  ) : null
}

export const EnhanceUI = withAvailableInUrl({
  url: String.raw`https://mail.google.com/mail/.*`,
})(EnhanceUIComponent)
