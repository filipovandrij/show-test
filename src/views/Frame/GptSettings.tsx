import React, { useContext, useEffect, useRef, useState } from 'react'
// import React, { useContext } from 'react'
import { Box, Button, Checkbox, Input } from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import axios from 'axios'
import { AppContext } from '../../app/appContext'
import { getBaseUrl } from '../../api/baseUrl'
import { getToken } from '../../api/getToken'
// import { AppContext } from '../../app/appContext'

type Props = {
  close: () => void
}
const GptSettings = ({ close }: Props) => {
  const createHandleLimit =
    (setState: (value: React.SetStateAction<number>) => void, localStoragekey: string) =>
    (limit: string) => {
      let newValue = parseInt(limit, 10)
      if (isNaN(newValue)) {
        newValue = 0
      }

      setState(newValue)
      localStorage.setItem(localStoragekey, newValue.toString())
    }
  const handleIsRes =
    (storageKey: string, setRes: React.Dispatch<React.SetStateAction<boolean>>, res: boolean) =>
    (value: (val: boolean) => boolean) => {
      console.log('res', res, typeof res)
      localStorage.setItem(storageKey, !res ? 'true' : '')
      setRes(value)
    }

  const { frameId } = useContext(AppContext)
  console.log('frameId', frameId)
  const [, , ...emailAll] = frameId.split('-')
  const email = emailAll.join('')

  const localStorageKeyIsUser = `gptSettings-${email}-isuser`
  const [isUser, setIsUser] = useState(!!(localStorage.getItem(localStorageKeyIsUser) ?? ''))
  const handleIsUser = handleIsRes(localStorageKeyIsUser, setIsUser, isUser)
  const [userLimit, setUserLimit] = useState(24)
  const localStorageKeyUser = `gptSettings-${email}-userlimit`
  const handleUserLimit = createHandleLimit(setUserLimit, localStorageKeyUser)

  const localStorageKeyIsOrg = `gptSettings-${email}-isorg`
  const [isOrg, setIsOrg] = useState(!!(localStorage.getItem(localStorageKeyIsOrg) ?? ''))
  const handleIsOrg = handleIsRes(localStorageKeyIsOrg, setIsOrg, isOrg)
  const [orgLimit, setOrgLimit] = useState(24)
  const localStorageKeyOrg = `gptSettings-${email}-orglimit`
  const handleOrgLimit = createHandleLimit(setOrgLimit, localStorageKeyOrg)

  const localStorageKeyIsPub = `gptSettings-${email}-ispub`
  const [isPub, setIsPub] = useState(!!(localStorage.getItem(localStorageKeyIsPub) ?? ''))
  const handleIsPub = handleIsRes(localStorageKeyIsPub, setIsPub, isPub)
  const [pubLimit, setPubLimit] = useState(24)
  const localStorageKeyPub = `gptSettings-${email}-publimit`
  const handlePubLimit = createHandleLimit(setPubLimit, localStorageKeyOrg)

  const [startPolling, setStartPolling] = useState<Dayjs | null>(dayjs('2024-04-13T09:00'))
  const localStorageKeyStartPolling = `gptSettings-${email}-startpoll`
  const [endPolling, setEndPolling] = useState<Dayjs | null>(dayjs('2024-04-13T09:00'))
  const localStorageKeyEndPolling = `gptSettings-${email}-endpoll`

  const handleStartPolling = (value: Dayjs | null) => {
    localStorage.setItem(
      localStorageKeyStartPolling,
      value?.toDate().toString() ?? dayjs('2024-04-13T09:00').toDate().toString()
    )
    setStartPolling(value)
  }
  const handleEndPolling = (value: Dayjs | null) => {
    localStorage.setItem(
      localStorageKeyEndPolling,
      value?.toDate().toString() ?? dayjs('2024-04-13T09:00').toDate().toString()
    )
    setEndPolling(value)
  }

  const getStorageData = () => ({
    isUser: localStorage.getItem(localStorageKeyIsUser) ?? '',
    isOrg: localStorage.getItem(localStorageKeyIsOrg) ?? '',
    isPub: localStorage.getItem(localStorageKeyIsPub) ?? '',
    user: localStorage.getItem(localStorageKeyUser) ?? '24',
    org: localStorage.getItem(localStorageKeyOrg) ?? '24',
    pub: localStorage.getItem(localStorageKeyPub) ?? '24',
    startPolling:
      localStorage.getItem(localStorageKeyStartPolling) ??
      dayjs('2024-04-13T09:00').toDate().toString(),
    endPolling:
      localStorage.getItem(localStorageKeyEndPolling) ??
      dayjs('2024-04-13T09:00').toDate().toString(),
  })
  const initialData = useRef(getStorageData())

  useEffect(() => {
    console.log('initialData.current')
    console.log(initialData.current)
    setIsUser(!!initialData.current.isUser)
    setIsOrg(!!initialData.current.isOrg)
    setIsPub(!!initialData.current.isPub)
    setUserLimit(parseInt(initialData.current.user, 10))
    setOrgLimit(parseInt(initialData.current.org, 10))
    setPubLimit(parseInt(initialData.current.pub, 10))
    setStartPolling(dayjs(new Date(initialData.current.startPolling)))
    setEndPolling(dayjs(new Date(initialData.current.endPolling)))
  }, [])

  const saveAnyChanges = async () => {
    const utcStartPolling = `${startPolling
      ?.toDate()
      .getUTCHours()
      .toString()
      .padStart(2, '0')}:${startPolling
      ?.toDate()
      .getUTCMinutes()
      .toString()
      .padStart(2, '0')}:${startPolling?.toDate().getUTCMinutes().toString().padStart(2, '0')}`
    const utcEndPolling = `${endPolling
      ?.toDate()
      .getUTCHours()
      .toString()
      .padStart(2, '0')}:${endPolling
      ?.toDate()
      .getUTCMinutes()
      .toString()
      .padStart(2, '0')}:${endPolling?.toDate().getUTCMinutes().toString().padStart(2, '0')}`
    const requestData = {
      gpt_email: email,
      run_user: isUser,
      run_organization: isOrg,
      run_public: isPub,
      user_prompt_limit: userLimit,
      organization_prompt_limit: orgLimit,
      public_prompt_limit: pubLimit,
      polling_start_time: utcStartPolling,
      polling_end_time: utcEndPolling,
    }
    // send data to server
    initialData.current = getStorageData()

    const baseUrl = await getBaseUrl()
    const token = await getToken()
    const url = `${baseUrl}/api/constructor/gptconfig/`

    try {
      const response = await axios({
        method: 'post',
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: requestData,
      })

      const data = response.data
      if (response.status === 202) {
        console.log('Send data accepted', data)
      } else {
        console.error('Failed to send data:', response)
      }
    } catch (error) {
      console.error('An error occurred:', error)
    }
    console.log('data')
    console.log(requestData)
    close()
  }

  const cancelChanges = () => {
    localStorage.setItem(localStorageKeyIsUser, initialData.current.isUser)
    localStorage.setItem(localStorageKeyIsOrg, initialData.current.isOrg)
    localStorage.setItem(localStorageKeyIsPub, initialData.current.isPub)
    localStorage.setItem(localStorageKeyUser, initialData.current.user)
    localStorage.setItem(localStorageKeyOrg, initialData.current.org)
    localStorage.setItem(localStorageKeyPub, initialData.current.pub)
    localStorage.setItem(localStorageKeyStartPolling, initialData.current.startPolling)
    localStorage.setItem(localStorageKeyEndPolling, initialData.current.endPolling)
    close()
  }
  const data = [
    {
      name: 'User',
      isRes: isUser,
      setIsRes: handleIsUser,
      limit: userLimit,
      handleLimit: handleUserLimit,
    },
    {
      name: 'Organization',
      isRes: isOrg,
      setIsRes: handleIsOrg,
      limit: orgLimit,
      handleLimit: handleOrgLimit,
    },
    {
      name: 'Public',
      isRes: isPub,
      setIsRes: handleIsPub,
      limit: pubLimit,
      handleLimit: handlePubLimit,
    },
  ]
  // const { frameId, frameType } = useContext(AppContext)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Axiforma',
          fontSize: 14,
          paddingLeft: '4px',
          paddingRight: '4px',
        }}
      >
        <span style={{ fontWeight: 700 }}>Permissions</span>
        <span style={{ fontSize: 12 }}>Choose the prompts that this account will manage.</span>
        {data.map(({ name, isRes, setIsRes, limit, handleLimit }) => {
          return (
            <Box
              sx={{ padding: '4px', display: 'flex', flexDirection: 'row', alignItems: 'start' }}
            >
              <Checkbox value={isRes} defaultChecked={isRes} onChange={() => setIsRes((u) => !u)} />
              <Box sx={{ paddingTop: '4px' }}>
                {name}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Input
                    type='number'
                    disabled={!isRes}
                    value={limit}
                    onChange={(e) => handleLimit(e.target.value)}
                    style={{
                      width: '40px',
                    }}
                  />
                  <span style={{ color: '#757575' }}>Limit of available prompts</span>
                </Box>
              </Box>
            </Box>
          )
        })}
        <span style={{ fontWeight: 700 }}>Polling schedule</span>
        <span style={{ fontSize: 12 }}>Please specify the polling time for the prompt queue.</span>
        <Box sx={{ padding: '4px' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              padding: '4px',
              justifyContent: 'start',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            Polling start
            <TimePicker
              sx={{
                padding: 0,
                width: '150px',
                '&.MuiInputBase-root': {
                  '&.MuiInputBase-input': {
                    padding: 0,
                  },
                },
              }}
              slotProps={{
                toolbar: {
                  sx: {
                    '&.MuiInputBase-root': {
                      '&.MuiInputBase-input': {
                        padding: 0,
                      },
                    },
                    '&.MuiInputBase-input': {
                      padding: 0,
                    },
                  },
                },
              }}
              value={startPolling}
              onChange={(value) => {
                console.log(value)
                handleStartPolling(value)
              }}
              views={['hours', 'minutes', 'seconds']}
              format='hh:mm:ss'
            />
            <span
              style={{ color: '#AB47BC', cursor: 'pointer' }}
              onClick={() => handleStartPolling(dayjs())}
            >
              Now
            </span>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              padding: '4px',
              justifyContent: 'start',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Polling end
            <TimePicker
              sx={{
                padding: 0,
                width: '150px',
                '& MuiInputBase-input': {
                  padding: 0,
                },
              }}
              value={endPolling}
              onChange={(value) => {
                console.log(value)
                handleEndPolling(value)
              }}
              views={['hours', 'minutes', 'seconds']}
              format='hh:mm:ss'
            />
            <span
              style={{ color: '#AB47BC', cursor: 'pointer' }}
              onClick={() => handleEndPolling(dayjs())}
            >
              Now
            </span>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Button onClick={saveAnyChanges} color='primary' variant='contained'>
            Save and add an account
          </Button>
          <Box
            onClick={cancelChanges}
            style={{
              fontFamily: 'Axiforma',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
              cursor: 'pointer',
            }}
          >
            Cancel
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  )
}

export default GptSettings
