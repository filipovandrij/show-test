import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Switch,
  TextField,
} from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

type Props = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const SettingsGpt = ({ open, setOpen }: Props) => {
  const handleClose = () => setOpen(false)

  const [dontCloseWindow, setDontCloseWindow] = useState(false)
  const [dontShowOverlay, setDontShowOverlay] = useState(false)
  const [dontDisplayLogs, setDontDisplayLogs] = useState(false)
  const [recordLogs, setRecordLogs] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [breakFrequency, setBreakFrequency] = useState(50)
  const [breakDuration, setBreakDuration] = useState(5)
  const [pauseMinutes, setPauseMinutes] = useState(0)
  const [pauseSeconds, setPauseSeconds] = useState(0)

  const endTime1 = '21:00'

  function calculateBreakIntervals(
    startTime: any,
    workDuration: any,
    breakDuration: any,
    endTime: any
  ) {
    const [startHours, startMinutes] = startTime.split(':').map(Number)
    const endMinutesOfDay = endTime
      .split(':')
      .map(Number)
      .reduce((hours: any, minutes: any) => hours * 60 + minutes)

    const intervals = []

    let currentTimeInMinutes = startHours * 60 + startMinutes

    while (currentTimeInMinutes < endMinutesOfDay) {
      const breakStart = currentTimeInMinutes + workDuration
      const breakEnd = breakStart + breakDuration

      if (breakEnd > endMinutesOfDay) break

      const formattedBreakStart = `${Math.floor(breakStart / 60)}:${String(
        breakStart % 60
      ).padStart(2, '0')}`
      const formattedBreakEnd = `${Math.floor(breakEnd / 60)}:${String(breakEnd % 60).padStart(
        2,
        '0'
      )}`

      intervals.push({ start: formattedBreakStart, end: formattedBreakEnd })

      currentTimeInMinutes = breakEnd
    }

    return intervals
  }

  const workDuration = 40
  const breakDuration1 = 10

  const breakIntervals = calculateBreakIntervals('10:00', workDuration, breakDuration1, endTime1)
  console.log(breakIntervals)

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings')
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      setStartTime(parsedSettings.startTime || '')
      setEndTime(parsedSettings.endTime || '')
      setDontCloseWindow(parsedSettings.dontCloseWindow || false)
      setDontShowOverlay(parsedSettings.dontShowOverlay || false)
      setDontDisplayLogs(parsedSettings.dontDisplayLogs || false)
      setRecordLogs(parsedSettings.recordLogs || false)
      setBreakFrequency(parsedSettings.breakFrequency || 50)
      setBreakDuration(parsedSettings.breakDuration || 5)
    }
  }, [])

  const saveSettings = () => {
    const settings = {
      startTime,
      endTime,
      dontCloseWindow,
      dontShowOverlay,
      dontDisplayLogs,
      recordLogs,
      breakFrequency,
      breakDuration,
      pauseBetweenMessages: pauseMinutes + pauseSeconds,
    }

    chrome.storage.local.set({ settings: JSON.stringify(settings) }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving settings to chrome.storage.local:', chrome.runtime.lastError)
      } else {
        console.log('Settings saved to chrome.storage.local:', settings)
      }
    })
  }

  const clearSettings = () => {
    setStartTime('')
    setEndTime('')
    setDontCloseWindow(false)
    setDontShowOverlay(false)
    setDontDisplayLogs(false)
    setRecordLogs(false)
    setBreakFrequency(50)
    setBreakDuration(5)
    console.log('Settings cleared from localStorage')

    chrome.storage.local.clear(() => {
      if (chrome.runtime.lastError) {
        console.error('Error clearing chrome.storage.local:', chrome.runtime.lastError)
      } else {
        console.log('All data cleared from chrome.storage.local')
      }
    })
  }

  const handleStartTimeChange = (event: any) => {
    const value = event.target.value
    setStartTime(value)
    console.log('Время дня для запуска очереди:', value)
  }

  const handleEndTimeChange = (event: any) => {
    const value = event.target.value
    setEndTime(value)
    console.log('Время для остановки:', value)
  }

  const handleDontCloseWindowChange = (event: any) => {
    const value = event.target.checked
    setDontCloseWindow(value)
    console.log('Не закрывать окно:', value)
  }

  const handleDontShowOverlayChange = (event: any) => {
    const value = event.target.checked
    setDontShowOverlay(value)
    console.log('Не выводить оверлей:', value)
  }

  const handleDontDisplayLogsChange = (event: any) => {
    const value = event.target.checked
    setDontDisplayLogs(value)
    console.log('Не выводить логи в оверлее:', value)
  }

  const handleRecordLogsChange = (event: any) => {
    const value = event.target.checked
    setRecordLogs(value)
    console.log('Записывать логи:', value)
  }

  const handleBreakFrequencyChange = (event: any) => {
    const value = event.target.value
    setBreakFrequency(value)
    console.log('Частота перерывов (минуты):', value)
  }

  const handleBreakDurationChange = (event: any) => {
    const value = event.target.value
    setBreakDuration(value)
    console.log('Длительность перерывов (минуты):', value)
  }

  const handlePauseMinutesChange = (event: any) => {
    const value = event.target.value
    if (value !== 0) {
      setPauseMinutes(value * 60000)
    } else {
      setPauseMinutes(0)
    }
  }
  const handlePauseSecondsChange = (event: any) => {
    const value = event.target.value
    if (value !== 0) {
      setPauseSeconds(value * 1000)
    } else {
      setPauseSeconds(0)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        sx={{
          borderRadius: '10px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 350,
          backgroundColor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <IconButton
          sx={{
            width: '10%',
            alignSelf: 'flex-end',
          }}
          color='error'
          onClick={handleClose}
        >
          <CancelIcon />
        </IconButton>
        <TextField
          label='Время дня для запуска очереди'
          type='time'
          value={startTime}
          onChange={handleStartTimeChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300,
          }}
        />
        <TextField
          label='Время для остановки'
          type='time'
          value={endTime}
          onChange={handleEndTimeChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300,
          }}
        />
        <Box>
          <p
            style={{
              textAlign: 'center',
              margin: '0 0 10px 0',
            }}
          >
            Пауза между сообщениями
          </p>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <TextField
              sx={{
                width: '50%',
              }}
              label='минуты'
              type='number'
              onChange={handlePauseMinutesChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: 0,
                max: 5,
              }}
            />
            <TextField
              sx={{
                width: '50%',
              }}
              label='секунды'
              type='number'
              onChange={handlePauseSecondsChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: 0,
                max: 59,
              }}
            />
          </Box>
        </Box>
        <FormControl>
          <InputLabel id='break-frequency-label'>Частота перерывов (минуты)</InputLabel>
          <Select
            labelId='break-frequency-label'
            value={breakFrequency}
            onChange={handleBreakFrequencyChange}
          >
            {Array.from({ length: 31 }, (_, i) => i + 30).map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id='break-duration-label'>Длительность перерывов (минуты)</InputLabel>
          <Select
            labelId='break-duration-label'
            value={breakDuration}
            onChange={handleBreakDurationChange}
          >
            {Array.from({ length: 15 }, (_, i) => i + 1).map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={<Switch checked={dontCloseWindow} onChange={handleDontCloseWindowChange} />}
          label='Не закрывать окно'
        />
        <FormControlLabel
          control={<Switch checked={dontShowOverlay} onChange={handleDontShowOverlayChange} />}
          label='Не выводить оверлей'
        />
        <FormControlLabel
          control={<Switch checked={dontDisplayLogs} onChange={handleDontDisplayLogsChange} />}
          label='Не выводить логи в оверлее'
        />
        <FormControlLabel
          control={<Switch checked={recordLogs} onChange={handleRecordLogsChange} />}
          label='Записывать логи'
        />
        <Button variant='contained' color='primary' onClick={saveSettings}>
          Сохранить настройки
        </Button>
        <Button variant='contained' color='secondary' onClick={clearSettings}>
          Очистить настройки
        </Button>
      </Box>
    </Modal>
  )
}

export default SettingsGpt
