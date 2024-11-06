import { ChangeEvent, useEffect, useState } from 'react'
import { Box, FormControlLabel, Switch } from '@mui/material'
import { chekActiveGptAcc } from '../GoogleAccounts/addGptAccount'

export const AskGpt = () => {
  const [checked, setChecked] = useState(false)
  const [msg, setMsg] = useState('')

  // эта функция для кнопки которая запустит обработку промптов

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setMsg('')
    const isChecked = event.target.checked
    setChecked(isChecked)
    chrome.storage.session.set({ runPromptQueue: isChecked })
    if (isChecked) {
      await chekActiveGptAcc()
      chrome.runtime.sendMessage({ action: 'startPromptQueue' }).then((resp) => {
        if (resp) {
          setMsg(resp)
          setChecked(false)
          chrome.storage.session.set({ runPromptQueue: false })
        }
      })
    } else {
      chrome.runtime.sendMessage({ action: 'stopPromptQueue' })
    }
  }

  useEffect(() => {
    chrome.storage.session.get(['runPromptQueue']).then((r) => {
      setChecked(r.runPromptQueue || false)
    })
  }, [])

  return (
    <>
      <FormControlLabel
        sx={{
          marginTop: '8px',
        }}
        control={<Switch checked={checked} onChange={handleChange} />}
        label={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontFamily: 'Axiforma',
                fontSize: '14px',
                fontWeight: '700',
              }}
            >
              Run prompt queue
            </span>
            <span
              style={{
                fontFamily: 'Axiforma',
                fontSize: '12px',
                fontWeight: '500',
                color: '#757575',
              }}
            >
              Execute queued prompts to streamline your workflow
            </span>
          </Box>
        }
      />
      <div style={{ color: 'red', fontSize: '16px' }}>{msg}</div>
    </>
  )
}
