import { ChangeEvent, ReactElement, forwardRef, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Box, Button, Dialog, DialogActions, Slide, TextareaAutosize } from '@mui/material'
import axios from 'axios'
import { TransitionProps } from '@mui/material/transitions'
import { withAvailableInUrl } from '../../../utils/withAvailableInUrl'
import { getToken } from '../../../api/getToken'

type FormObj = {
  comments_author: string
  comment_time_dates: string
  comment_message: string
  base_url: string
  issue_key: string
}

const SeleryForm = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const StyledTextareaAutosize = styled(TextareaAutosize)({
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  borderColor: 'rgba(0, 0, 0, 0.23)',
  '&:focus': {
    borderColor: '#1976d2',
    outline: 'none',
    boxShadow: '0 0 0 2px #64b5f6',
  },
})

const Transition = forwardRef<
  unknown,
  TransitionProps & {
    children: ReactElement<any, any>
  }
>((props, ref) => <Slide direction='up' ref={ref} {...props} />)

const SeleryFormCheck = () => {
  const [formObj, setFormObj] = useState<FormObj>({
    comments_author: '',
    comment_time_dates: new Date().toISOString(),
    comment_message: '',
    base_url: '',
    issue_key: '',
  })

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    handleSubmit()
    setOpen(false)
  }
  const allFieldsFilled = Object.values(formObj).every((value) => value.trim() !== '')

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

    setFormObj((prevState: any) => ({
      ...prevState,
      comments_author: `${payload.first_name} ${payload.last_name}`,
    }))
  }

  const addCandidateToCase = async () => {
    const endpoint = 'https://hook.eu2.make.com/htcc98d65z0od77nmegl9ei6hxf8yvxj'

    try {
      const response = await axios.post(endpoint, formObj, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer Q:KRwWWv#{+1!&j',
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
    }
  }

  useEffect(() => {
    checkTokenName()
  }, [])

  useEffect(() => {
    const urlPattern = /^https:\/\/[\w-]+\.atlassian\.net\/browse\/([A-Z]+-\d+)\/?$/
    if (chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].url) {
          setFormObj((prevState: any) => ({
            ...prevState,
            base_url: tabs[0].url,
          }))
          const match = tabs[0].url.match(urlPattern)
          if (match && match[1]) {
            const keyString = match[1]
            setFormObj((prevState: any) => ({
              ...prevState,
              issue_key: keyString,
            }))
          }
        }
      })
    }
  }, [])

  const handleChangeComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormObj((prevState: any) => ({
      ...prevState,
      comment_message: event.target.value,
    }))
  }
  const handleSubmit = async () => {
    await addCandidateToCase()
    setFormObj({
      comments_author: '',
      comment_time_dates: new Date().toISOString(),
      comment_message: '',
      base_url: '',
      issue_key: '',
    })
  }

  return (
    <SeleryForm>
      <>
        <Button variant='outlined' onClick={handleClickOpen}>
          salary accounting
        </Button>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby='alert-dialog-slide-description'
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                fontFamily: 'Axiforma',
                color: 'text.secondary',
              }}
            >
              <span> Name: {formObj.comments_author}</span>
              <span> Url: {formObj.base_url}</span>
              <span> Task Id: {formObj.issue_key}</span>
              <span> Time now: {formObj.comment_time_dates}</span>
            </Box>
            <StyledTextareaAutosize
              minRows={10}
              placeholder='Describe what you did'
              value={formObj.comment_message}
              onChange={handleChangeComment}
            />
            <DialogActions sx={{ mt: 2, justifyContent: 'center' }}>
              <Button onClick={() => handleClose()} disabled={!allFieldsFilled}>
                Send Task
              </Button>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
          </Box>
        </Dialog>
      </>
    </SeleryForm>
  )
}

export const SeleryFormButton = withAvailableInUrl({
  url: String.raw`^https:\/\/[\w-]+\.atlassian\.net\/browse\/[A-Z]+-\d+\/?$`,
})(SeleryFormCheck)
