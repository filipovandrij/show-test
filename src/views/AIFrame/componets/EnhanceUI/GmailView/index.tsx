import { Button, TextField as MUITextField, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useCallback, useEffect, useState } from 'react'
import { storagePutFrame } from '../../../../../utils/frames/storagePutFrame'
import { Switch } from '../../../../../components/Switcher'
import { sendToggleFramesAction } from '../../../../../utils/frames/sendToggleFramesAction'

const TextField = styled(MUITextField)``

type GmailViewFormState = {
  email?: string
  field_id?: string
}

const SwitchContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
`

export const GmailView = () => {
  const [{ field_id }, setValue] = useState<GmailViewFormState>({})
  const [autoShowFrames, setAutoShowFrames] = useState(false)

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const name = event?.currentTarget?.name
      const value = event?.currentTarget?.value
      name &&
        setValue((prev) => ({
          ...prev,
          [name]: value,
        }))
    },
    []
  )

  const onChangeShowFrames = useCallback(() => {
    chrome.storage.local.get().then((storage) => {
      const mode = storage?.framesToggleMode === 'auto' ? 'manual' : 'auto'
      chrome.storage.local.set({ framesToggleMode: mode }).then(() => {
        setAutoShowFrames(mode === 'auto')
      })
    })
  }, [])

  const onFrameCreate = useCallback(() => {
    field_id &&
      storagePutFrame({
        id: field_id,
        title: field_id,
      })
  }, [field_id])

  useEffect(() => {
    chrome.storage.local.get().then((storage) => {
      setAutoShowFrames(storage?.framesToggleMode === 'auto')
    })
  }, [])

  return (
    <>
      <SwitchContainer>
        <Typography variant='body1'>Auto show frames</Typography>
        <Switch checked={autoShowFrames} onChange={onChangeShowFrames} />
      </SwitchContainer>
      <TextField
        variant='outlined'
        id='field_id'
        name='field_id'
        value={field_id}
        onChange={onChange}
        label={'Field ID'}
      />
      <Button variant='contained' color='primary' disabled={!field_id} onClick={onFrameCreate}>
        CREATE FRAME
      </Button>
      <Button variant='contained' color='primary' onClick={sendToggleFramesAction}>
        TOGGLE FRAMES
      </Button>
    </>
  )
}
