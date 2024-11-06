import { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import { Box, Button, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
import { AppBar } from '../../app/appBar'
import { AskGpt } from '../AIFrame/AskGpt'
import { ParsingIntrerruptions } from '../../utils/parsingInterruptions'
import GoogleAccounts from '../AIFrame/GoogleAccounts/GoogleAccounts'
import Footer from '../../app/footer/Footer'
import IconSettings from '../../components/Icons/IconSettings'
import { getToken } from '../../api/getToken'
import { sendFingerprint } from '../../utils/sendLinkedinFingerprint'
import { checkTestingDev } from '../../chrome/queue/checkTestingDev'
// import { getBaseUrl } from '../../api/baseUrl'

const SettingContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ececec;
`

const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TitleAcc = styled('span')`
  font-family: Axiforma;
  font-size: 16px;
  font-weight: 500;
`
const LinkSupportsContainer = styled('a')`
  background-color: rgb(236, 236, 236);
  text-decoration: none;
  border-radius: 4px;
  padding: 8px;
  gap: 8px;
  display: flex;
  transition: all 1s ease 0s;
  color: #212121;
  opacity: 1;
  pointer-events: all;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  box-shadow: rgb(134, 134, 134) 0px 0px 2px 0px;
  svg {
    color: #757575;
  }
  :hover {
    cursor: pointer;
    background-color: rgb(121, 14, 139);
    color: rgb(255, 255, 255);
    svg {
      color: rgb(255, 255, 255);
    }
  }
`

export const Settings = () => {
  const navigate = useNavigate()
  const [checkTesting, setCheckTesting] = useState(false)
  useEffect(() => {
    checkTestingDev().then((staff) => setCheckTesting(staff))
  }, [])
  const [fullName, setFullName] = useState<string>('')

  // const addQueue = async () => {
  //   const baseUrl = await getBaseUrl()
  //   const token = await getToken()
  //   const endpoint = `${baseUrl}/api/constructor/planner/add_list/`
  //   const data = [
  //     {
  //       prompt: 'напиши 2 кейса',
  //       gpt_chat_link:
  //         'https://chatgpt.com/g/g-Cd18IvAkf-filters-to-apollo-company-search-link-transformer',
  //       agent_name: '',
  //       user_bound: true,
  //       chat_name: 'Вопросики',
  //       delete_chat: false,
  //       required_answer_format: 'any',
  //     },
  //     {
  //       prompt: 'напиши 2 кейса',
  //       gpt_chat_link:
  //         'https://chatgpt.com/g/g-Cd18IvAkf-filters-to-apollo-company-search-link-transformer',
  //       agent_name: '',
  //       user_bound: true,
  //       chat_name: 'Вопросики',
  //       delete_chat: false,
  //       required_answer_format: 'any',
  //     },
  //     {
  //       prompt: 'напиши 10 кейсов',
  //       gpt_chat_link:
  //         'https://chatgpt.com/g/g-Cd18IvAkf-filters-to-apollo-company-search-link-transformer',
  //       agent_name: '',
  //       user_bound: true,
  //       chat_name: 'Вопросики',
  //       delete_chat: false,
  //       required_answer_format: 'any',
  //     },
  //   ]

  //   try {
  //     const response = await axios.post(endpoint, data, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     return response.data
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error('Axios error:', error.message)
  //       throw error
  //     } else {
  //       console.error('Unexpected error:', error)
  //       throw error
  //     }
  //   }
  // }

  // const getPromptQueueItem = async () => {
  //   const baseUrl = await getBaseUrl()
  //   const token = await getToken()
  //   const url = `${baseUrl}/api/constructor/planner/run_list/`

  //   try {
  //     const response = await axios.post(
  //       url,
  //       JSON.stringify({
  //         available_models: ['text-davinci-002-render-sha', 'gpt-4'],
  //         openai_account_id: 'andrijfilipov73@gmail.com',
  //       }),
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     )
  //     return console.log('response', response)
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error('Axios error:', error.message)
  //       throw error
  //     } else {
  //       console.error('Unexpected error:', error)
  //       throw error
  //     }
  //   }
  // }

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

    if (payload.first_name || payload.last_name) {
      setFullName(`${payload.first_name} ${payload.last_name}`)
      return
    }
      setFullName('User')
  }

  useEffect(() => {
    checkTokenName()
  }, [])

  // const getSettings = async () => {
  //   return new Promise((resolve, reject) => {
  //     chrome.storage.local.get(['settings'], (result) => {
  //       if (chrome.runtime.lastError) {
  //         reject(new Error(chrome.runtime.lastError.message))
  //       } else if (result.settings) {
  //         console.log(JSON.parse(result.settings))
  //         resolve(JSON.parse(result.settings))
  //       } else {
  //         reject(new Error('Settings not found in chrome.storage.local'))
  //       }
  //     })
  // })
  // }

  return (
    <SettingContainer>
      <AppBar />
      {/* <button onClick={() => addQueue()}>add queue</button>
      <button onClick={() => getPromptQueueItem()}>check queue</button> */}
      <div
        style={{
          padding: '10px',
          gap: '8px',
          background: 'white',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '15px',
          borderTop: '1px solid #0000001F',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #0000001F',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              svg: {
                color: '#AB47BC',
              },
            }}
          >
            <TitleAcc>{fullName}</TitleAcc>
            <IconButton onClick={() => navigate('/main')}>
              <IconSettings color='#BDBDBD' />
            </IconButton>
          </Box>
        </Box>
        <LinkSupportsContainer href='https://www.ainsys.com/aide-support' target='_blank'>
          <ContactSupportIcon />
          <span>Technical support</span>
        </LinkSupportsContainer>
        <LinkSupportsContainer href='https://www.ainsys.com/aide-feature-request' target='_blank'>
          <OfflineBoltIcon />
          <span>Request new features</span>
        </LinkSupportsContainer>
        <Container
          style={{
            marginTop: '12px',
          }}
        >
          <ParsingIntrerruptions />
        </Container>
        <Container>
          <AskGpt />
        </Container>
        {checkTesting && (
          <Button onClick={async () => console.log(await sendFingerprint())}>
            Send linkedin fingerprint Data
          </Button>
        )}
        <GoogleAccounts />
      </div>
      <Footer />
    </SettingContainer>
  )
}
