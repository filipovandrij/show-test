import { createContext } from 'react'
import { useLogin } from '../../hooks/useLogin'

export type View = 'AIFrame' | 'Settings' | 'Monitor' | 'FieldFrame' | 'Frame' | 'Login' | 'Initial'

export type TAppContext = {
  setDarkTheme: () => void
  setLightTheme: () => void
  view: View
  setView: (view: View) => void
  frameId: string
  frameType: string
  auth: ReturnType<typeof useLogin>
  credits: number
  setBalance: (b: number) => void
}

export const AppContext = createContext<TAppContext>({
  setDarkTheme: () => {},
  setLightTheme: () => {},
  view: 'Initial',
  setView: () => {},
  frameId: '',
  frameType: '',
  auth: {} as any,
  credits: 0,
  setBalance: () => {},
})

export const AppContextProvider = AppContext.Provider
