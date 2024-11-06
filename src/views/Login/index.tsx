import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { AppContext } from '../../app/appContext'
import api from '../../api'
import { getToken } from '../../api/getToken'
import { AppBar } from '../../app/appBar'

const ContentLogin = styled('div')`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme: { palette } }) => palette.colorBgContainer};
  padding-left: 24px;
  padding-right: 24px;
`

export const Login = () => {
  const {
    auth: { handleLogin, username, password, setIsAuth, serverUrl, error, getPrompts },
    setBalance,
  } = useContext(AppContext)

  const [pendingLogin, setPendingLogin] = useState(false)
  const [pendingVerify, setPendingVerify] = useState(true)
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setPendingLogin(true)
    event.preventDefault()

    handleLogin()
    setPendingLogin(false)
  }

  useEffect(() => {
    api
      .verifyToken()
      .then(() => {
        getToken().then(async (token) => {
          setIsAuth(!!token)
          setPendingVerify(!!token)

          const data = await getPrompts()
          setBalance(data.message.credits)
        })
      })
      .catch(() => setPendingVerify(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (pendingVerify)
    return (
      <ContentLogin>
        <CircularProgress />
      </ContentLogin>
    )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <AppBar tasksHidden />
      <ContentLogin>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin='normal' variant='outlined'>
            <InputLabel id='server-label'>Server</InputLabel>
            <Select
              labelId='server-label'
              id='server-select'
              value={serverUrl.value}
              onChange={serverUrl.onChange}
              label='Server'
              required
            >
              <MenuItem value='https://aide.ainsys.com'>Production</MenuItem>
              <MenuItem value='https://aiextension.ainsys.com'>Developer</MenuItem>
              <MenuItem value='http://127.0.0.1:8000'>Local</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label='Username'
            variant='outlined'
            value={username.value}
            fullWidth
            onChange={username.onChange}
            margin='normal'
            name='username'
            autoComplete='username'
            required
          />
          <TextField
            label='Password'
            type='password'
            variant='outlined'
            value={password.value}
            fullWidth
            onChange={password.onChange}
            margin='normal'
            name='password'
            autoComplete='current-password'
            required
          />
          {error && (
            <Typography variant='caption' display='block' color='red' gutterBottom>
              {error}
            </Typography>
          )}
          <Button type='submit' variant='contained' color='primary' fullWidth disabled={pendingLogin}>
            {pendingLogin ? 'Loading...' : 'Login'}
          </Button>
          <Button
            type='submit'
            variant='outlined'
            color='primary'
            fullWidth
            target={'_blank'}
            href={'https://www.ainsys.com/'}
            sx={{ marginTop: '8px' }}
          >
            Get access
          </Button>
        </form>
      </ContentLogin>
    </Box>
  )
}
