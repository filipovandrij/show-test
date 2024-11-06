import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import CachedIcon from '@mui/icons-material/Cached'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SettingsIcon from '@mui/icons-material/Settings'
import axios from 'axios'
import styled from 'styled-components'
import gmailLogo from '../../../img/gmailLogo.svg'
import outlookLogo from '../../../img/outlookLogo.svg'
import chatGptLogo from '../../../img/chatGptLogo.svg'
import { getBaseUrl } from '../../../api/baseUrl'
import { getToken } from '../../../api/getToken'
import ChatGPTLogo from '../../../img/accountsImg/ChatGPTLogo.svg'
import GmailLogo from '../../../img/accountsImg/GmailLogo.svg'
import OutlookLogo from '../../../img/accountsImg/OutlookLogo.svg'
import { chekActiveGptAcc, getLinkGptAccount } from './addGptAccount'
import { EditDialog } from './EditDialog/EditDialog'
import { checkTestingDev } from '../../../chrome/queue/checkTestingDev'
import { getEmailSettings } from './EditDialog/getEmailSettings'
import { BrowserStatusChip } from './BrowserStatusChip/BrowserStatusChip'
import { getSessionGmails } from './getSessionGmails'
import { ApiStatusChip } from './ApiStatusChip/ApiStatusChip'
import { getEmails } from './getEmails'
import { Email, EmailSettings } from './types'
import SettingsGpt from '../../Settings/SettingsGpt'
import Statistics from './Statistics/Statistics'

interface SpinningIconProps {
  isLoading: boolean
}

const SpinningIcon = styled.div<SpinningIconProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${(props) => (props.isLoading ? 'spin 1s linear infinite' : 'none')};

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const GoogleAccounts = () => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [menuAnchorE2, setMenuAnchorE2] = useState(null)
  const [open, setOpen] = useState(false)

  const [selectedAccount, setSelectedAccount] = useState<any>(null)

  const [showStatsFor, setShowStatsFor] = useState(null)

  const [emails, setEmails] = useState<Email[]>([])

  const [gptList, setGptList] = useState<any>([])

  const [isLoading, setIsLoading] = useState(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const [isTestingDev, setIsTestingDev] = useState(false)

  const [emailSettings, setEmailSettings] = useState<EmailSettings[]>([])

  const [sessionGmails, setSessionGmails] = useState<string[]>([])

  const [userId, setUserId] = useState<number>()

  console.log('isLoading', isLoading)

  function base64UrlDecode(input: any) {
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/')
    switch (base64.length % 4) {
      case 0:
        break
      case 2:
        base64 += '=='
        break
      case 3:
        base64 += '='
        break
      default:
        throw new Error('Некорректная строка в base64url')
    }
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    )
  }

  const checkTokenName = async () => {
    const token = await getToken()

    if (!token) {
      console.error('Токен не получен.')
      return false
    }
    const parts = token.split('.')

    const decodedPayload = base64UrlDecode(parts[1])
    const payload = JSON.parse(decodedPayload)
    console.log('payload', payload)

    setUserId(payload.user_id)
  }

  const gptSettings = async () => {
    const baseUrl = await getBaseUrl()
    const token = await getToken()
    const endpoint = `${baseUrl}/api/constructor/planner/settings/`

    const gptAccMail = await getLinkGptAccount()

    const data = {
      account_id: gptAccMail,
      account_type: 'openAI',
      account_status: 'active',
      settings: {
        process_prompts_from_other_users: 10000,
        max_prompts_per_hour: 1000,
        max_prompts_per_day: 5000,
        max_prompts_per_week: 8000,
      },
    }
    try {
      const response = await axios.post(endpoint, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message)
        throw error
      } else {
        console.error('Unexpected error:', error)
        throw error
      }
    } finally {
      chekActiveGptAcc()
    }
  }

  const fetchEmails = async () => {
    const baseUrl = await getBaseUrl()
    const token = await getToken()
    const url = `${baseUrl}/api/link/gmail/`

    try {
      const response = await axios.post(
        url,
        {
          jwt_token: token,
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.status === 200) {
        console.log('Emails fetched successfully:')

        const newTab = await chrome.tabs.create({
          url: response.data.url,
          active: true,
        })
        const newTabId = newTab.id

        console.log('New tab created with ID:', newTabId)

        chrome.runtime.onMessage.addListener((mes) => {
          if (mes.action == 'gmail connected') {
            getEmails().then((res) => setEmails(res))
            getEmailSettings().then((res) => setEmailSettings(res))
          }
        })

        chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
          if (tabId === newTabId && changeInfo.status === 'complete') {
            console.log('Tab updated and ready for script reinjection:', tabId, changeInfo)

            chrome.scripting.executeScript({
              target: { tabId: newTabId },
              func: () => {
                const xpath =
                  "//body[contains(text(), 'Your Gmail account has been successfully linked')]"
                const matchingElement = document.evaluate(
                  xpath,
                  document,
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue

                if (matchingElement) {
                  console.log('Callback processed, closing tab...')

                  chrome.runtime.sendMessage({ action: 'gmail connected' })

                  setTimeout(() => {
                    chrome.runtime.sendMessage({
                      action: 'createMainFrame',
                    })
                  }, 1000)
                }
              },
            })
          }
        })
      } else {
        console.error('Failed to fetch emails:', response.data)
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  const linkOutlook = async () => {
    setIsDialogOpen(false)

    const baseUrl = await getBaseUrl()
    const token = await getToken()
    const url = `${baseUrl}/api/link/outlook/`

    try {
      const response = await axios.post(
        url,
        {
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      console.log('response', response)

      if (response.status === 200) {
        console.log('Emails fetched successfully:')
        const newTab = await chrome.tabs.create({ url: response.data.url })
        const newTabId = newTab.id

        console.log('New tab created with ID:', newTabId)

        chrome.runtime.onMessage.addListener((mes) => {
          if (mes.action == 'outlook connected') {
            getEmails().then((res) => setEmails(res))
            getEmailSettings().then((res) => setEmailSettings(res))
          }
        })

        chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
          if (tabId === newTabId && changeInfo.status === 'complete') {
            console.log('Tab updated and ready for script reinjection:', tabId, changeInfo)

            chrome.scripting.executeScript({
              target: { tabId: newTabId },
              func: () => {
                const xpath =
                  "//body[contains(text(), 'Your Outlook account has been successfully linked')]"
                const matchingElement = document.evaluate(
                  xpath,
                  document,
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue

                if (matchingElement) {
                  console.log('Callback processed, closing tab...')

                  chrome.runtime.sendMessage({ action: 'outlook connected' })

                  setTimeout(() => {
                    chrome.runtime.sendMessage({
                      action: 'createMainFrame',
                    })
                  }, 1000)
                }
              },
            })
          }
        })
      } else {
        console.error('Failed to fetch emails:', response.data)
      }
    } catch (error: any) {
      console.error('An error occurred:', error)
      if (error.response && error.response.status === 302) {
        const redirectUrl = error.response.headers.location
        chrome.tabs.create({ url: redirectUrl })
      }
    }
  }

  // const getEmails = () => {
  //   chrome.storage.local.get('emails', (result) => {
  //     setEmailsList(result.emails)
  //     console.log('Saved emails:', result.emails)
  //   })
  // }

  // const checkLoading = () => {
  //   chrome.storage.local.get('isLoading', (result) => {
  //     setIsLoading(result.isLoading)
  //     console.log('Check Loading:', result.isLoading)
  //   })
  // }

  const deleteAccounts = async (accId: any) => {
    const baseUrl = await getBaseUrl()
    const token = await getToken()
    const headers = {
      Authorization: `Bearer ${token}`,
    }
    try {
      await axios.delete(`${baseUrl}/api/email-accounts/${accId}/`, { headers })
      console.log('Delete successful')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message)
        throw error
      } else {
        console.error('Unexpected error:', error)
        throw error
      }
    }
  }

  const handleMenuClick = (event: any, account: any) => {
    setMenuAnchorEl(event.currentTarget)
    setSelectedAccount(account)
  }
  const handleMenuClickGpt = (event: any, account: any) => {
    setMenuAnchorE2(event.currentTarget)
    setSelectedAccount(account)
  }
  const handleClose = () => {
    setMenuAnchorEl(null)
    setMenuAnchorE2(null)
  }
  const handleDelete = (id: string) => {
    console.log('Deleting:', selectedAccount)
    if (selectedAccount) {
      deleteAccounts(id)
    }
    getEmails().then((res) => setEmails(res))
    handleClose()
  }

  const handleDialogOpen = () => {
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
  }

  const linkGmail = () => {
    fetchEmails()
    setIsDialogOpen(false)
  }

  const handleStatsClick = (account: any) => {
    setShowStatsFor(showStatsFor === account.id ? null : account.id)
    handleClose()
  }
  useEffect(() => {
    checkTokenName()
    checkTestingDev().then((res) => setIsTestingDev(res))
    getEmailSettings().then((res : EmailSettings[]) => {
      setEmailSettings(res)
      setGptList(res.filter(x => x.account_type == 'openAI'))
    })
    setIsLoading(true)
    getEmails()
      .then((res) => {
        setEmails(res)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleEditDialogOpen = () => {
    setIsEditDialogOpen(true)
  }

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false)
  }

  useEffect(() => {
    const handleMessages = (message: any) => {
      if (message.dataUpdated) {
        chrome.storage.local.get(['accGpts'], (result) => {
          if (result.accGpts) {
            setGptList(result.accGpts)
          }
        })
      }
    }

    chrome.runtime.onMessage.addListener(handleMessages)

    chrome.storage.local.get(['accGpts'], (result) => {
      if (result.accGpts) {
        setGptList(result.accGpts)
      }
    })

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessages)
    }
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkTokenName()
      console.log('Polling functions are called')
    }, 30000)

    return () => {
      clearInterval(intervalId)
      console.log('Interval is cleared')
    }
  }, [])

  // const loookLocal = () => {
  //   chrome.storage.local.get(['accGpts'], (result) => {
  //     if (result.accGpts) {
  //       console.log('looooaooooasdoa', result.accGpts)
  //     }
  //   })
  // }

  const onSettingsUpdated = () => {
    getEmailSettings().then((res) => setEmailSettings(res))
  }

  const updateAccountInfo = () => {
    getSessionGmails().then((res) => setSessionGmails(res))
    getEmails().then((res) => setEmails(res))
    getEmailSettings().then((res : EmailSettings[]) => {
      setEmailSettings(res)
      setGptList(res.filter(x => x.account_type == 'openAI'))
    })
  }

  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <ListItem sx={{ justifyContent: 'space-between' }}>
          <Typography
            sx={{
              fontFamily: 'Axiforma',
              fontSize: '16px',
              fontWeight: '700',
              lineHeight: '24px',
            }}
          >
            Accounts
          </Typography>
          <IconButton disabled={isLoading} onClick={updateAccountInfo}>
            <SpinningIcon isLoading={isLoading}>
              <CachedIcon />
            </SpinningIcon>
          </IconButton>
          <IconButton
            sx={{
              background: '#F3E9F5',
              color: '#AB47BC',
              '&:hover': {
                background: '#AB47BC',
                color: 'white',
              },
              '&:active': {
                background: '#790E8B',
                color: 'white',
              },
            }}
            aria-label='add'
            onClick={handleDialogOpen}
          >
            <AddIcon />
          </IconButton>
        </ListItem>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px' }}>
          <Typography sx={{
            color: '#868686',
            fontWeight: 500,
            fontSize: '14px',
          }}>
            Email accounts
          </Typography>
          <Typography sx={{
            color: '#868686',
            fontWeight: 500,
            fontSize: '11px',
          }}>
            Automation
          </Typography>
        </Box>
        {emails &&
          emails.map((account: any, index: any) => (
            <Box key={index}
            sx={{ border: showStatsFor === account.id ? '1px solid #CAC4D0' : 'none',
              borderRadius: '4px',
              padding: showStatsFor === account.id ? '6px' : '0'
              }}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge='end'
                    aria-label='more'
                    onClick={(e) => handleMenuClick(e, account)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
                disablePadding
                // disabled={!account.active}
                // sx={{
                //   opacity: account.active ? 1 : 0.5,
                // }}
              >
                <ListItem
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: showStatsFor === account.id ? '0.375rem' : '0.5rem'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      margin: showStatsFor === account.id ? '0.375rem' : '0',
                      width: '100%'
                    }}
                  >
                    {account.service === 'gmail' ? (
                      <img src={gmailLogo} alt='gmail' />
                    ) : (
                      <img src={outlookLogo} alt='outlook' />
                    )}
                    <Box sx={{ marginLeft: '14px', overflow: 'hidden' }}>
                      <ListItemText
                        sx={{
                          fontFamily: 'Axiforma',
                          fontSize: '12px',
                          fontWeight: '500',
                          lineHeight: '24px',
                          textAlign: 'left',
                          '.MuiListItemText-primary': {
                            fontSize: '12px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }
                        }}
                        primary={account.email}
                      />
                      <ApiStatusChip email={account} />
                    </Box>
                    <BrowserStatusChip
                      emailSettings={emailSettings?.find((x) => x.account_id == account.email)}
                      sessionLoggedIn={sessionGmails.includes(account.email)}
                    />
                  </Box>
                </ListItem>
              </ListItem>
              {showStatsFor === account.id && (
                    <Statistics
                      email={account}
                      onClose={() => setShowStatsFor(null)}
                    />
                  )}
            </Box>
          ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px' }}>
          <Typography sx={{
            color: '#868686',
            fontWeight: 500,
            fontSize: '14px',
          }}>
            Other accounts
          </Typography>
          <Typography sx={{
            color: '#868686',
            fontWeight: 500,
            fontSize: '11px',
          }}>
            Automation
          </Typography>
        </Box>
        {gptList &&
          gptList.map((gptAccount: EmailSettings) => (
            <ListItem
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px'
              }}
              secondaryAction={
                <IconButton
                  edge='end'
                  aria-label='more'
                  onClick={(e) => handleMenuClickGpt(e, gptAccount)}
                >
                  <MoreVertIcon />
                </IconButton>
              }
              disablePadding
            >
              <img src={chatGptLogo} alt='chat gpt logo' style={{ borderRadius: '50%' }} />
              <ListItemText
                sx={{
                  marginLeft: '14px',
                  fontFamily: 'Axiforma',
                  fontSize: '12px',
                  fontWeight: '500',
                  lineHeight: '24px',
                  textAlign: 'left',
                  '.MuiListItemText-primary': {
                    fontSize: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }
                }}
                primary={gptAccount.account_id}
              />
              <BrowserStatusChip
                emailSettings={gptAccount}
                sessionLoggedIn
              />
            </ListItem>
          ))}
      </List>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: '48px * 4.5',
              width: '20ch',
            },
          },
        }}
      >
        <MenuItem onClick={() => handleStatsClick(selectedAccount)}>
          <TrendingUpIcon sx={{ marginRight: '8px', color: '#757575' }} /> Statistics
        </MenuItem>
        {isTestingDev && (
          <MenuItem onClick={() => handleEditDialogOpen()}>
            <SettingsIcon sx={{ marginRight: '8px', color: '#757575' }} /> Settings
          </MenuItem>
        )}
        <MenuItem onClick={() => handleDelete(selectedAccount.id)}>
          <DeleteIcon sx={{ marginRight: '8px', color: '#757575' }} /> Delete
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={menuAnchorE2}
        open={Boolean(menuAnchorE2)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: '48px * 4.5',
            width: '20ch',
          },
        }}
      >
        <MenuItem onClick={() => setOpen(true)}>
          <SettingsIcon sx={{ marginRight: '8px', color: '#757575' }} /> Settings
        </MenuItem>
        {/* <MenuItem onClick={() => handleDelete(selectedAccount.account_id)}>
          <DeleteIcon sx={{ marginRight: '8px', color: '#757575' }} /> Delete
        </MenuItem> */}
      </Menu>

      <EditDialog
        open={isEditDialogOpen}
        onClose={handleEditDialogClose}
        account={selectedAccount}
        emailSettings={emailSettings}
        onUpdated={onSettingsUpdated}
      />

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: 'Axiforma',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Connect accounts
          </DialogTitle>
          <CloseIcon
            sx={{
              marginRight: '12px',
              cursor: 'pointer',
            }}
            onClick={handleDialogClose}
          />
        </Box>
        <DialogActions
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Button
            sx={{
              width: '40%',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={linkGmail}
          >
            <img src={GmailLogo} alt='gpt logo' />
            <DialogContentText
              sx={{
                textTransform: 'none',
              }}
            >
              Gmail
            </DialogContentText>
          </Button>
          <Button
            sx={{
              width: '40%',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={linkOutlook}
          >
            <img src={OutlookLogo} alt='Outlook logo' />
            <DialogContentText
              sx={{
                textTransform: 'none',
              }}
            >
              Outlook
            </DialogContentText>
          </Button>
          <Button
            sx={{
              width: '40%',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={gptSettings}
          >
            <img src={ChatGPTLogo} alt='ChatGPT logo' />
            <DialogContentText
              sx={{
                textTransform: 'none',
              }}
            >
              ChatGPT
            </DialogContentText>
          </Button>
        </DialogActions>
      </Dialog>
      <SettingsGpt open={open} setOpen={setOpen} />
    </>
  )
}

export default GoogleAccounts
