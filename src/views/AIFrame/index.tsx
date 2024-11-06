import { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { Box, IconButton } from '@mui/material'
import WorkIcon from '@mui/icons-material/Work'
import { EnhanceUI } from './componets/EnhanceUI'
import { LinkedinFullParse } from './LinkedinFullParse'
import { LinkedinJobQuickParse } from './LinkedinJobQuickParse'
import { IndeedJobQuickParse } from './IndeedQuickParse'
import { LinkedinQuickParse } from './LinkedinQuickParse'
import { LinkedinFullParseCompany } from './LinkedInFullParseCompany'
import { LinkedinQuickParseCompany } from './LinkedinQuickParseCompany'
import { AppBar } from '../../app/appBar'
import { DataImport } from './DataImport'
import { CsvContacts } from './CsvContacts'
import { Analyzer } from './Analyzer/Analyzer'
import { checkTestingDev } from '../../chrome/queue/checkTestingDev'
import IconSettings from '../../components/Icons/IconSettings'
import Footer from '../../app/footer/Footer'
import { SeleryFormButton } from './SeleryForm/SeleryForm'
import { getToken } from '../../api/getToken'
import { CommandCard } from '../../components/CommandCard'

const AIFrameContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ececec;
`

const TitleAcc = styled('span')`
  font-family: Axiforma;
  font-size: 16px;
  font-weight: 500;
`
export const AIFrame = () => {
  // This hook stores the states of the staff that can be modified in the database and is designed for developers
  const [checkTesting, setCheckTesting] = useState(false)

  const [fullName, setFullName] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    checkTestingDev().then((staff) => setCheckTesting(staff))
  }, [])

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

  return (
    <AIFrameContainer>
      <AppBar />
      <div
        style={{
          padding: '10px 10px 0 10px',
          gap: '8px',
          background: 'white',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: '15px',
          borderTop: '1px solid #0000001F',
        }}
      >
        <div
          style={{
            gap: '14px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Below are the commands that trigger various page components or parsing functions. */}
          <EnhanceUI />
          <DataImport />
          <Analyzer />
          <CsvContacts />
          <LinkedinQuickParse />
          <LinkedinJobQuickParse />
          <IndeedJobQuickParse />
          <LinkedinFullParse />
          {/* {checkTesting && <ConnectGpt />}
          {checkTesting && <FullBodyParse />}
          {checkTesting && (
            <button onClick={() => processQueueManagerLinkedIn()}>start Queue LinkedIn</button>
          )} */}
          <CommandCard
            title={
              <div style={{ display: 'flex', gap: '4px' }}>
                <WorkIcon />
                <div style={{ flexGrow: 1 }}>AI Business Consultant </div>
              </div>
            }
            description={''}
            onClick={() => {}}
          />

          <LinkedinQuickParseCompany />
          <LinkedinFullParseCompany />
          {/* <SendEmailsButton /> */}
          {checkTesting && <SeleryFormButton />}
        </div>
        <div>
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
              }}
            >
              <TitleAcc>{fullName}</TitleAcc>
              <IconButton
                onClick={() =>
                  location.pathname === '/settings' ? navigate('/main') : navigate('/settings')
                }
              >
                <IconSettings color='#BDBDBD' />
              </IconButton>
            </Box>
          </Box>
        </div>
      </div>
      <Footer />
    </AIFrameContainer>
  )
}
