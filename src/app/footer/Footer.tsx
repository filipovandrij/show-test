import { useCallback, useContext } from 'react'
import { styled } from '@mui/system'
import { Box, IconButton } from '@mui/material'
import { AppContext } from '../appContext/AppContext'
import { setToken } from '../../api/setToken'
import { IconExit } from '../../components/Icons/IconExit'

const TitleVersion = styled('span')`
  font-family: Axiforma;
  font-size: 12px;
  font-weight: 500;
  color: rgb(189 189 189);
`

const Footer = () => {
  const {
    auth: { setIsAuth },
    setView,
  } = useContext(AppContext)

  const handleLogout = useCallback(async () => {
    await setToken(null)
    setIsAuth(false)
    setView('Login')
  }, [setIsAuth, setView])

  const version = chrome.runtime.getManifest().version

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 18px',
        background: 'rgb(236, 236, 236)',
      }}
    >
      <TitleVersion>Plugin version {version}</TitleVersion>
      <IconButton onClick={handleLogout}>
        <IconExit />
      </IconButton>
    </Box>
  )
}

export default Footer
