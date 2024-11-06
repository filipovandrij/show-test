import { Alert, Box, Button, Dialog, DialogActions, DialogTitle, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getBaseUrl } from '../../../../api/baseUrl'
import { getToken } from '../../../../api/getToken'
import { Email, AccountStatus, EmailSettings } from '../types'

interface Props {
    open: boolean,
    onClose: () => void,
    account: Email,
    emailSettings: EmailSettings[],
    onUpdated: () => void
}

export const EditDialog = ({ open, onClose, account, emailSettings, onUpdated } : Props) => {
    const [settings, setSettings] = useState('{}')
    const [isFirstSetting, setIsFirstSetting] = useState(true)
    const [status, setStatus] = useState<AccountStatus>('logged out')
    const [error, setError] = useState('')
    const [isRestoreOpen, setIsRestoreOpen] = useState(false)

    useEffect(() => {
      const info = emailSettings?.find(x => x.account_id === account?.email)
      const oldSettings = info?.settings
      if (oldSettings) {
        setSettings(JSON.stringify(oldSettings, null, 2))
        setIsFirstSetting(false)
        setStatus(info.account_status)
      }
    }, [account, emailSettings, open])

    const checkJSON = (json: string) => {
      try {
        JSON.parse(json)
      } catch (e) {
        return false
      }
      return true
    }

    const save = () => {
        const valid = checkJSON(settings)
        if (!valid) {
            setError('Invalid json detected - settings wil not be updated')
            return
        }
        setError('')
        sendSettings()
    }

    const sendSettings = async () => {
      const baseUrl = await getBaseUrl()
      const token = await getToken()
      const url = `${baseUrl}/api/constructor/planner/settings/`
      const jsonSettings = JSON.parse(settings)
      const data : EmailSettings = {
          account_id: account.email,
          account_type: account.service,
          account_status: status,
          settings: jsonSettings
      }
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }

      try {
        let response
        if (isFirstSetting) {
          response = await axios.post(url, data, headers)
        } else {
          response = await axios.patch(url, data, headers)
        }
        onUpdated()
        onClose()
        return response.data
      } catch (error: any) {
        setError(JSON.stringify(error.response.data.errors))
        console.error('An error occurred:', error)
      }
    }

    const openRestore = () => {
      setIsRestoreOpen(true)
    }

    const closeRestore = () => {
      setIsRestoreOpen(false)
    }

    const sendRestore = async () => {
      const baseUrl = await getBaseUrl()
      const token = await getToken()
      const url = `${baseUrl}/api/constructor/planner/settings/reset/`
      const data = {
        account_id: account.email,
        account_type: account.service,
        account_status: status,
        settings: {}
      }
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
      try {
        const response = await axios.post(url, data, headers)
        onUpdated()
        closeRestore()
        onClose()
        return response.data
      } catch (error: any) {
        console.error('An error occurred:', error)
      }
    }

    return (
      <>
        <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        >
          <Box sx={{ padding: '8px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <DialogTitle
                sx={{
                  fontFamily: 'Roboto',
                  fontSize: '16px',
                  fontWeight: '300',
                  lineHeight: '24px',
                  padding: '0',
                  marginBottom: '4px'
                }}
              >
                Settings
              </DialogTitle>
              <CloseIcon
                sx={{
                  cursor: 'pointer',
                }}
                onClick={onClose}
              />
            </Box>
            <Typography sx={{
                  fontFamily: 'Roboto',
                  fontSize: '14px',
                  fontWeight: '400',
                  lineHeight: '20px',
                  color: '#757575',
                  marginBottom: '16px'
                }}>
              Set limit settings for the account
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <TextField
                id="outlined-multiline-static"
                label="Settings"
                multiline
                rows={16}
                value={settings}
                onChange={e => setSettings(e.target.value)}
                sx={{ marginBottom: '24px' }}
              />
              {
                error && <Alert severity="error">{error}</Alert>
              }
              <Button variant="contained" sx={{ marginBottom: '8px', fontWeight: '300' }} onClick={save}>
                Save
              </Button>
              <Button variant="outlined" onClick={openRestore} sx={{ fontWeight: '300' }}>
                Restore default settings
              </Button>
            </Box>
          </Box>
        </Dialog>
        <Dialog open={isRestoreOpen} onClose={closeRestore}>
          <Box sx={{
            padding: '8px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '340px'
          }}>
          <CloseIcon
            sx={{
              cursor: 'pointer',
              alignSelf: 'flex-end',
              fontSize: '18px',
              color: '#757575'
            }}
            onClick={closeRestore}
          />
          <DialogTitle sx={{
            fontFamily: 'Roboto',
            fontSize: '16px',
            fontWeight: 300,
            lineHeight: '24px',
            letterSpacing: '0.15',
            color: '#212121',
            padding: '8px 0'
          }}>
            Restore default settings
          </DialogTitle>
          <Typography sx={{
            fontFamily: 'Roboto',
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.25',
            color: '#757575',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            Restoring default settings means that the quotas you assigned yourself will be cancelled
          </Typography>
          <DialogActions sx={{ padding: '0' }}>
            <Button variant="text" onClick={ sendRestore } sx={{ fontWeight: '300' }}>
              Restore
            </Button>
            <Button variant="contained" onClick={ closeRestore } sx={{ fontWeight: '300' }}>
              Keep custom settings
            </Button>
          </DialogActions>
          </Box>
        </Dialog>
      </>
    )
}