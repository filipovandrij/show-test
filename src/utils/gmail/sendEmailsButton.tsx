/* eslint-disable no-await-in-loop */
import React from 'react'
import { IconButton, Dialog, DialogTitle, DialogContent, Box } from '@mui/material'
import styled from '@emotion/styled'
import EmailIcon from '@mui/icons-material/Email'
import {
  getEmail,
  openGmail,
  sendMail,
  closeGmail,
  openNumberGmail,
  highlightGmail,
} from './sendEmails'
import { Close } from '../../components/Icons/Close'

const CommandCardContainer = styled(Box)`
  background-color: #ececec;
  border-radius: 4px;
  border: '1px red solid';
  padding: 8px;
  display: flex;
  flex-direction: column;
  transition: all 1s;
  color: '#212121';
  opacity: 1;
  pointer-events: 'all';
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  box-shadow: 0px 0px 2px 0px #868686;

  .descriptionContainer {
    font-family: Axiforma;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    transition: max-height 0.1s;
    max-height: 0;
    overflow: hidden;
  }

  .MuiSwitch-track {
    background-color: #c7b1dc !important;
    opacity: 1;
    border: 0;
  }

  svg {
    color: #ab47bc;
  }

  &:hover {
    gap: 8px;
    cursor: pointer;
    background-color: #790e8b;
    color: #fff;

    .descriptionContainer {
      transition: max-height 1s 0.3s;
      max-height: 300px;
    }

    svg {
      color: #fff;
    }

    .MuiSwitch-thumb {
      color: #fff;
    }
  }
`

type Mail = {
  guid: string
  date_time?: string
  sender_email: string
  email_content: string
  email_subject: string
  recepient_email: string
  status?: 'sent' | 'scheduled' | 'error'
}
export function SendEmailsButton() {
  const [message, setMessage] = React.useState<JSX.Element | null>(null)
  const setTextMessage = (text: string) => {
    setMessage(<span>{text}</span>)
  }

  // const setCountProcessed = (mails: Mail[]) => {
  //   if (mails) {
  //     setTextMessage(`${mails?.filter((m) => m.status).length} / ${mails?.length} mails processed.`)
  //   }
  // }

  const setCountProcessed = (mails: { [email: string]: Mail[] }) => {
    setMessage(
      <div>
        <div>Mails processing</div>
        <div>
          {Object.entries(mails).map(([email, mails]) => (
            <div>
              {mails?.filter((m) => m.status).length} / {mails?.length} mails processed for email{' '}
              {email}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const setGotEmails = (emails: (string | undefined)[], loading = true) => {
    setMessage(
      <div>
        {loading ? 'Getting emails info...' : 'Got emails: '}
        <br />
        {emails.map((email) => (
          <div>{email}</div>
        ))}
      </div>
    )
  }

  return (
    <>
      <CommandCardContainer
        onClick={async () => {
          try {
            setGotEmails([])
            await openGmail()
            let sender_emails = [await getEmail()]
            if (!sender_emails[0]) {
              console.log('Error due fetching email')
              setTextMessage('Error due fetching email')
              closeGmail()
              return
            }
            do {
              setGotEmails(sender_emails)
              await openNumberGmail(sender_emails.length)
              sender_emails.push(await getEmail())
            } while (
              new Set(sender_emails).size === sender_emails.length ||
              !sender_emails[sender_emails.length - 1]
            )
            sender_emails = Array.from(new Set(sender_emails)).filter((e) => e)
            setGotEmails(sender_emails, false)
            console.log('sender_emails', sender_emails)

            const response = await fetch(
              'https://hook.eu2.make.com/xsh1xpuzkyxm54oy86dd9hrbsnn3nwyo',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authentication: 'Bearer t~z;jVn\\C?5di(i#',
                },
                body: JSON.stringify({
                  sender_emails,
                }),
              }
            )
            const result = await response.json()
            console.log('result', result)
            if (!result.length || result.length === 0) {
              setTextMessage(`No mails for emails ${sender_emails.join(' ')}`)
              closeGmail()
              return
            }
            const mails = Object.fromEntries(
              sender_emails
                .map((email) => [email, result.filter((mail: Mail) => mail.sender_email === email)])
                .filter(([, mails]) => mails.length > 0)
            ) as { [key: string]: Array<any> }
            console.log('mails', mails)
            setMessage(
              <div>
                <div>Fetched {result.length} mails:</div>
                {Object.entries(mails).map(([email, mails]) => (
                  <div>
                    {mails.length} mails for {email}
                  </div>
                ))}
              </div>
            )
            await new Promise<void>((res) => setTimeout(() => res(), 3000))
            setCountProcessed(mails)
            // let promise = Promise.resolve()

            highlightGmail()
            for (const email in mails) {
              await openNumberGmail(sender_emails.findIndex((e) => e === email))
              const mailList = mails[email]
              for (const mail of mailList) {
                const timer: NodeJS.Timeout = setTimeout(() => highlightGmail(500), 25 * 1000)
                try {
                  const res = await sendMail(mail)
                  if (res) {
                    mail.status = mail.date_time ? 'scheduled' : 'sent'
                  } else {
                    mail.status = 'error'
                  }
                } catch (e) {
                  mail.status = 'error'
                } finally {
                  clearTimeout(timer)
                  setCountProcessed(mails)
                }
              }
            }
            const allMails = Object.values(mails).flat(1)
            console.log('allMails', allMails)
            await fetch('https://hook.eu2.make.com/coibxjxkp2mpia2iepmzggdup79v29nr', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authentication: 'Bearer t~z;jVn\\C?5di(i#',
              },
              body: JSON.stringify(
                allMails.reduce(
                  (acc, mail) => {
                    acc[mail.status].push(mail.guid)
                    return acc
                  },
                  {
                    scheduled: [],
                    sent: [],
                    error: [],
                  }
                )
              ),
            })
            setMessage(
              <div>
                Sending message completed:
                {Object.entries(mails).map(([email, mails]) => {
                  const sent = mails.filter((r: Mail) => r.status === 'sent')
                  const scheduled = mails.filter((r: Mail) => r.status === 'scheduled')
                  const error = mails.filter((r: Mail) => r.status === 'error')
                  return (
                    <>
                      <div>For email {email}</div>
                      <div>- {sent.length} sent</div>
                      <div>- {scheduled.length} scheduled</div>
                      <div>- {error.length} error fetched due processing</div>
                    </>
                  )
                })}
              </div>
            )
          } finally {
            closeGmail()
          }
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          <EmailIcon />
          <div style={{ flexGrow: 1 }}>Send Email</div>
        </div>
      </CommandCardContainer>
      <Dialog open={!!message}>
        <DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
          Email sending
          <IconButton onClick={() => setMessage(null)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div style={{ fontSize: '18px' }}>{message}</div>
        </DialogContent>
      </Dialog>
    </>
  )
}
