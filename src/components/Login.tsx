import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { FormEvent } from 'react'
import { useInputHook } from '../hooks/useInput'

type LoginProps = {
  handleLogin: () => void
  handleLoginGoogle: () => void
  error: string
  email: useInputHook<string>
  password: useInputHook<string>
}

const Login = ({ handleLogin, handleLoginGoogle, email, password }: LoginProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    handleLogin()
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label='Username'
        variant='outlined'
        value={email.value}
        fullWidth
        onChange={email.onChange}
        margin='normal'
      />
      <TextField
        label='Password'
        type='password'
        variant='outlined'
        value={password.value}
        fullWidth
        onChange={password.onChange}
        margin='normal'
      />
      <Button type='submit' variant='contained' color='primary' fullWidth>
        Login
      </Button>
      <Button variant='contained' color='primary' fullWidth onClick={handleLoginGoogle}>
        Login with Google
      </Button>
    </form>
  )
}

export default Login
