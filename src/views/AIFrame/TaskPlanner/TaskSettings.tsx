import { useState } from 'react'
import { Box, Chip, FormControlLabel, Radio, RadioGroup, Switch, Tooltip } from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import styled from '@emotion/styled'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InfoIcon from '@mui/icons-material/Info'
import DaysFilters from './DaysFilters'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px;
  cursor: pointer;
  background-color: white;
  margin-top: 10px;
  border-radius: 4px;
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 0 10px 10px;
`
const Text = styled.div`
  display: flex;
  align-items: center;
  font-family: Axiforma;
  font-size: 15px;
  font-weight: 600;
  line-height: 19px;
  text-align: left;
`

const LittleText = styled.div`
  font-family: Axiforma;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
`
const TaskSettings = () => {
  const [timeZone, setTimeZone] = useState<string>('10')
  const [open, setOpen] = useState<boolean>(false)
  const [openSwitcher, setOpenSwitcher] = useState<boolean>(false)

  const handleChange = (event: SelectChangeEvent) => {
    setTimeZone(event.target.value as string)
  }

  const handleOpenInvitations = () => {
    setOpen(!open)
  }

  const handleSwicher = (e: any) => {
    e.stopPropagation()
    setOpenSwitcher(!openSwitcher)
  }

  const grey = '#EBEBEB'
  const white = 'white'

  return (
    <Box>
      <Text>Select time zone</Text>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={timeZone}
            onChange={handleChange}
            sx={{
              marginTop: '10px',
              backgroundColor: 'white',
              border: 'none',
            }}
          >
            <MenuItem value={10}>Europe/Madrid (GMT +1)</MenuItem>
            <MenuItem value={20}>Europe/Madrid (GMT +2)</MenuItem>
            <MenuItem value={30}>Europe/Madrid (GMT +3)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <DaysFilters bg={white} />
      <Text style={{ marginTop: '20px' }}>
        Edit your quotas
        <Tooltip title='Specific limit: Linkedin allows only 200 invitations max. per week'>
          <InfoIcon sx={{ marginLeft: '6px' }} color='disabled' />
        </Tooltip>
      </Text>
      <Box
        sx={{
          borderRadius: '4px',
          backgroundColor: 'white',
        }}
      >
        <Header onClick={handleOpenInvitations}>
          <Text>Max Invitations per day</Text>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Chip label='50' variant='outlined' />
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
        </Header>
        {open ? (
          <Body>
            <Box
              sx={{
                marginTop: '12px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Text>Max Invitations per hour:</Text>
              <Box>
                <Chip label='50' variant='outlined' />
              </Box>
            </Box>
            <RadioGroup
              aria-labelledby='demo-radio-buttons-group-label'
              defaultValue='female'
              name='radio-buttons-group'
            >
              <FormControlLabel
                value='fixed'
                control={<Radio />}
                label='Fixed delay between emails:'
              />
              <Box>
                <Chip label='- 12 +' variant='outlined' />
              </Box>
              <FormControlLabel
                value='random'
                control={<Radio />}
                label='Random delay between emails:'
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                  gap: '11px',
                }}
              >
                <Chip label='- 120 +' variant='outlined' /> <LittleText>to</LittleText>
                <Chip label='- 180 +' variant='outlined' /> <LittleText>seconds</LittleText>
              </Box>
            </RadioGroup>
            <Header
              style={{
                backgroundColor: '#EBEBEB',
              }}
            >
              <Text>Special Invitations Schedule</Text>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Switch
                  size='small'
                  onClick={handleSwicher}
                  sx={{
                    '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                      color: '#BDBDBD',
                    },
                  }}
                />
              </Box>
            </Header>
            {openSwitcher ? (
              <Body
                style={{
                  padding: '0',
                  backgroundColor: '#EBEBEB',
                }}
              >
                <DaysFilters bg={grey} />
              </Body>
            ) : null}
          </Body>
        ) : null}
      </Box>

      <Header>
        <Text>Messages</Text>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Chip label='120' variant='outlined' />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
      </Header>
      <Header>
        <Text>Profile visits</Text>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Chip label='300' variant='outlined' />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
      </Header>
      <Header>
        <Text>Follows</Text>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Chip label='150' variant='outlined' />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
      </Header>
    </Box>
  )
}

export default TaskSettings
