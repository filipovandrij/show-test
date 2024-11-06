import styled from '@emotion/styled'
import { List, ListItem, ListItemIcon, ListItemText, Switch } from '@mui/material'
import { green } from '@mui/material/colors'
type Props = {
  bg: string
}
const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
`

const DaysFilters = ({ bg }: Props) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return (
    <List
      sx={{
        padding: '0',
        width: '100%',
        bgcolor: 'background.paper',
        marginTop: '10px',
        borderRadius: '4px',
      }}
    >
      {days.map((day) => {
        const labelId = `checkbox-list-label-${day}`

        return (
          <ListItem
            key={day}
            secondaryAction={
              <SwitchContainer>
                <Switch
                  size='small'
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                      color: '#BDBDBD',
                    },
                  }}
                />
              </SwitchContainer>
            }
            sx={{
              backgroundColor: bg,
              display: 'flex',
              justifyContent: 'flex-start',
            }}
            disablePadding
          >
            <ListItemIcon sx={{ marginLeft: '5px', minWidth: '6px' }}>
              <span
                style={{
                  height: '6px',
                  width: '6px',
                  backgroundColor: green[500],
                  display: 'inline-block',
                  borderRadius: '50%',
                }}
              />
            </ListItemIcon>
            <ListItemText
              id={labelId}
              primary={day}
              sx={{
                maxWidth: '154px',
                marginLeft: '10px',
                width: '85px',
              }}
            />

            <ListItemText
              sx={{
                marginLeft: '16px',
                border: '1px solid  #BDBDBD',
                borderRadius: '20px',
                textAlign: 'center',
                maxWidth: '54px',
              }}
              primary='12:00'
            />

            <ListItemText
              sx={{
                margin: '0 5px',
                maxWidth: '15px',
              }}
              primary='—'
            />
            <ListItemText
              sx={{
                border: '1px solid  #BDBDBD',
                borderRadius: '20px',
                textAlign: 'center',
                maxWidth: '54px',
              }}
              primary='12:00'
            />
          </ListItem>
        )
      })}
    </List>
  )
}

export default DaysFilters
