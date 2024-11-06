import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import { ThemeProvider as StyledThemeProvider } from '@emotion/react'
import { ThemeProvider } from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppContextProvider, View } from './AppContext'
import { darkTheme, lightTheme } from '../theme'
import { useLogin } from '../../hooks/useLogin'

export const AppContextComponent: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<typeof darkTheme | typeof lightTheme>(lightTheme)
  const [view, setView] = useState<View>('Initial')
  const [frameId, setFrameId] = useState('')
  const [frameType, setFrameType] = useState('')
  const setDarkTheme = useCallback(() => setTheme(darkTheme), [])
  const setLightTheme = useCallback(() => setTheme(lightTheme), [])
  const setViewFn = useCallback((view: View) => setView(view), [])
  const auth = useLogin()
  const [credits, setCredits] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()

  const setBalance = useCallback((credits: number) => {
    chrome.storage.local.set({ credits }).then(() => {
      setCredits(credits)
    })
  }, [])

  const listener = useCallback((request: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    request.frameType &&
      (chrome.runtime.onMessage.removeListener(listener),
      setFrameId(request.frameId),
      setFrameType(request.frameType))
  }, [])

  useEffect(() => {
    chrome.storage.local.get().then((storage) => {
      setCredits(storage?.credits || 0)
    })
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const listener = (request: any) => {
      if (request.action === 'navigate') {
        navigate(request.url)
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  useEffect(() => {
    !auth.isAuth && navigate('/login')
    auth.isAuth &&
      (location.pathname === '/login' || location.pathname === '/') &&
      navigate(`/${frameType}`)
  }, [auth.isAuth, location.pathname, frameType])

  return (
    <StyledThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <AppContextProvider
          value={{
            setDarkTheme,
            setLightTheme,
            view,
            setView: setViewFn,
            frameId,
            frameType,
            auth,
            credits,
            setBalance,
          }}
        >
          {children}
        </AppContextProvider>
      </ThemeProvider>
    </StyledThemeProvider>
  )
}

export { AppContext } from './AppContext'
