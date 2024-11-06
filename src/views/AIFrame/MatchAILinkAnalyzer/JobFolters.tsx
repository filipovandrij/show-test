import { Box, Chip, Tooltip, Typography } from '@mui/material'

import RoomIcon from '@mui/icons-material/Room'
import FactoryIcon from '@mui/icons-material/Factory'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import TranslateIcon from '@mui/icons-material/Translate'
import StarPurple500Icon from '@mui/icons-material/StarPurple500'
type Props = {
  filters: any
}

const JobFilters = ({ filters }: Props) => {
  const queries: string[] = []

  filters.forEach((filter: any) => {
    if (Array.isArray(filter.QueryParameters)) {
      queries.push(...filter.QueryParameters)
    } else {
      console.warn('filter.QueryParameters is not an array or is undefined for a filter', filter)
    }
  })

  function formatLabel(label: string) {
    return label.length > 45 ? `${label.substring(0, 45)}...` : label
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Box
      sx={{
        fontFamily: 'Axiforma',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          borderRadius: '8px',
          backgroundColor: 'white',
        }}
      >
        {filters.map((item: any) =>
          item.FilterParameters.length > 0 ? (
            <Box
              key={item.filterId}
              sx={{
                margin: '12px',
                width: '89%',
                height: 'auto',
                padding: '16px 0px ',
                borderBottom: '1px solid #0000003B',
              }}
            >
              <Tooltip title={item.FinalConclusions}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '8px',
                  }}
                >
                  {item.filterId === 'Locations' ? (
                    <RoomIcon />
                  ) : item.filterId === 'Industry' ? (
                    <FactoryIcon />
                  ) : item.filterId === 'Company' ? (
                    <WorkOutlineIcon />
                  ) : item.filterId === 'Open to' ? (
                    <WorkHistoryIcon />
                  ) : item.filterId === 'Profile Language' ? (
                    <TranslateIcon />
                  ) : null}
                  <Typography
                    component='legend'
                    sx={{
                      cursor: 'help',
                      color: '#212121',
                      fontFamily: 'Axiforma',
                      fontSize: '14px',
                      fontWeight: '700',
                      lineHeight: '18.2px',
                    }}
                  >
                    {item.filterId}
                  </Typography>
                </Box>
              </Tooltip>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginTop: '12px',
                }}
              >
                {item.FilterParameters.map((parameter: any, index: any) => (
                  <Chip
                    key={index}
                    label={parameter}
                    sx={{
                      backgroundColor: '#F3E9F5',
                      color: '#790E8B',
                      fontFamily: 'Axiforma',
                      fontSize: '14px',
                      fontWeight: '500',
                      lineHeight: '18.2px',
                      '&:hover': {
                        backgroundColor: '#EACDEF',
                      },
                      '&:active': {
                        backgroundColor: '#D9ABDD3B',
                      },
                    }}
                    onClick={() => copyToClipboard(parameter)}
                  />
                ))}
              </Box>
            </Box>
          ) : null
        )}

        <Box
          sx={{
            margin: '12px',
            width: '89%',
            height: 'auto',
            padding: '16px 0px ',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '8px',
            }}
          >
            <StarPurple500Icon />
            <Typography
              component='legend'
              sx={{
                cursor: 'help',
                color: '#212121',
                fontFamily: 'Axiforma',
                fontSize: '14px',
                fontWeight: '700',
                lineHeight: '18.2px',
              }}
            >
              Primary Queries
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '12px',
            }}
          >
            {queries.map((item, index) => (
              <Tooltip followCursor key={index} title={item} placement='top'>
                <Chip
                  sx={{
                    backgroundColor: '#F3E9F5',
                    color: '#790E8B',
                    fontFamily: 'Axiforma',
                    fontSize: '14px',
                    fontWeight: '500',
                    lineHeight: '18.2px',
                    '&:hover': {
                      backgroundColor: '#EACDEF',
                    },
                    '&:active': {
                      backgroundColor: '#D9ABDD3B',
                    },
                  }}
                  label={formatLabel(item)}
                  onClick={() => copyToClipboard(item)}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
export default JobFilters
