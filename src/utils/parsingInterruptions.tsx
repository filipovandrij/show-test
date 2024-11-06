import { useEffect, useState } from 'react'
import { Box, FormControlLabel, Switch } from '@mui/material'

export const ParsingIntrerruptions = () => {
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    chrome.storage.local.get().then((storage) => {
      setChecked(storage.carefulParsing || false)
    })
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked
    setChecked(isChecked)
    chrome.storage.local.set({ carefulParsing: isChecked })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <FormControlLabel
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
              Use careful parsing
            </span>
            <span
              style={{
                fontFamily: 'Axiforma',
                fontSize: '12px',
                fontWeight: '500',
                color: '#757575',
              }}
            >
              By resetting the tab once the memory consumption reaches certain threshold.
            </span>
          </Box>
        }
      />
    </Box>
  )
}

const getIsCarefulParsing = async () => {
  const storage = await chrome.storage.local.get()
  return storage.carefulParsing || false
}

const CAREFUL_PARSING_COUNT = 400

export const isCountExceeded = async (count: number) => {
  if (count < CAREFUL_PARSING_COUNT) return false

  return getIsCarefulParsing()
}
