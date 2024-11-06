import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    custom?: Palette['primary']
  }

  interface PaletteOptions {
    custom?: PaletteOptions['primary']
    colorBgBase: string
    colorBorder: string
    colorBgContainer: string
    colorDisabled: string
  }
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#AB47BC',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2196f3',
    },
    colorBgBase: '#EBEBEB',
    colorBorder: '#ececec',
    colorBgContainer: '#f9f9f9',
    colorDisabled: '#BDBDBD',
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#AB47BC',
      contrastText: '#FFFFFF',
    },
    colorBgBase: '#212629',
    colorBorder: '#171f24',
    colorBgContainer: '#212629',
    colorDisabled: '#BDBDBD',
  },
})
