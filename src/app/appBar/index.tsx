import { useCallback, useState } from 'react'
import { styled } from '@mui/system'
import { Box, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import CancelBtn from '../../components/Icons/CancelBtn'
import Side from '../../components/Icons/Side'
import LogoAinsysHeader from '../../components/Icons/LogoAinsysHeader'
import TaskPlannerIcon from '../../components/Icons/TaskPlannerIcon'

const Header = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  background: rgb(236, 236, 236);
`

interface Props {
  tasksHidden?: boolean
}

export const AppBar = ({ tasksHidden }: Props) => {
  const navigate = useNavigate()
  const [pluginPosition, setPluginPosition] = useState(
    localStorage.getItem('pluginPosition') || 'right'
  )

  const handleClosePlugin = useCallback(() => {
    chrome.runtime.sendMessage({
      action: 'closeMainFrame',
    })
  }, [])

  const handleTogglePluginPosition = useCallback(() => {
    const newPosition = pluginPosition === 'left' ? 'right' : 'left'
    localStorage.setItem('pluginPosition', newPosition)
    setPluginPosition(newPosition)

    chrome.runtime.sendMessage({
      action: 'togglePluginPosition',
      position: newPosition,
    })
  }, [pluginPosition])

  return (
    <Header>
      <LogoAinsysHeader />
      <Box
        sx={{
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center',
        }}
      >
        {
          !tasksHidden &&
          <IconButton onClick={() => navigate('/tasks')}>
            <TaskPlannerIcon />
          </IconButton>
        }
        <IconButton
          sx={{ transform: `rotate(${pluginPosition === 'left' ? '180deg' : '0'})` }}
          onClick={handleTogglePluginPosition}
        >
          <Side />
        </IconButton>
        <IconButton onClick={handleClosePlugin}>
          <CancelBtn />
        </IconButton>
      </Box>
    </Header>
  )
}
