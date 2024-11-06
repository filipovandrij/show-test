import { useContext, useState } from 'react'
import api from '../api'
import { useInput } from './useInput'
import { setToken } from '../api/setToken'
import { getBaseUrl, setBaseUrl } from '../api/baseUrl'
import { getToken } from '../api/getToken'
import { AppContext } from '../app/appContext'

export const useLogin = () => {
  const GOOGLE_URI_ENDPOINT = 'https://accounts.google.com/o/oauth2/auth?'
  const CLIENT_SECRET = encodeURIComponent('')
  const CLIENT_ID = encodeURIComponent('')
  const REDIRECT_URI = encodeURIComponent(
    'https://lhgmbjplellacbpelijfmonooallgmbd.chromiumapp.org/'
  )

  const url =
    `${GOOGLE_URI_ENDPOINT}scope=email` +
    '&access_type=offline' +
    '&include_granted_scopes=true' +
    '&state=state_parameter_passthrough_value' +
    `&redirect_uri=${REDIRECT_URI}` +
    `&response_type=code&client_id=${CLIENT_ID}`

  let oauthUrl =
    'https://oauth2.googleapis.com/token?' +
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${REDIRECT_URI}` +
    '&grant_type=authorization_code' +
    `&client_secret=${CLIENT_SECRET}`

  const password = useInput('')
  const username = useInput('')
  const serverUrl = useInput('https://aide.ainsys.com')

  const [isAuth, setIsAuth] = useState(false)
  const [error, setError] = useState('')
  const { setBalance } = useContext(AppContext)

  const extractCode = (redirectUri: string) => {
    const params = redirectUri.match(/[#?](.*)/)

    if (!params || params.length < 1) return null

    const newParams = new URLSearchParams(params[1].split('#')[0])
    return newParams.get('code')
  }

  const getPrompts = async () => {
    const token = await getToken()
    if (token) {
      const res = await fetch(`${await getBaseUrl()}/api/complex-analysis/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      return res.json()
    }
  }

  const handleLogin = async () => {
    setError('')
    await setBaseUrl(serverUrl.value)
    api
      .auth(username.value, password.value)
      .then(async (token) => {
        await setToken(token)

        const data = await getPrompts()
        setBalance(data.message.credits)

        setIsAuth(true)
      })
      .catch((e) => setError(e.message))
  }

  const handleLoginGoogle = () => {
    chrome.identity.launchWebAuthFlow(
      {
        url,
        interactive: true,
      },
      async (redirectUri) => {
        if (!chrome.runtime.lastError && redirectUri) {
          const code = extractCode(redirectUri)

          oauthUrl += `&code=${code}`

          const response = await fetch(oauthUrl, {
            method: 'POST',
          })

          const data = await response.json()
          const tokenId = data.id_token

          const token = await api.googleAuth(tokenId)

          await setToken(token)
          setIsAuth(true)
        }
      }
    )
  }

  return {
    handleLoginGoogle,
    handleLogin,
    isAuth,
    error,
    username,
    password,
    setIsAuth,
    serverUrl,
    getPrompts,
  }
}
