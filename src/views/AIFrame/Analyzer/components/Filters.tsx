import { useState } from 'react'
import { Box, Button, IconButton } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Command, Paper } from '../styles/analyzerFormStyles'
import JobFilters from './jobComponents/JobFiltes'
import { Spin } from '../styles/JobDescriptionCard'
import LogoAnimated from '../../../../components/Icons/LogoAnimated'
import { startJobFilter } from '../Requests/filters'
import { processSearchCandidate } from '../Requests/openScript'
import { NewTabIcon } from '../../../../img/newTab'
type Props = {
  filters: any
  caseId: any
}
export const Filters = ({ caseId, filters }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)

  const handleFilterSearch = () => {
    if (filters && Object.keys(filters).length === 0) {
      startJobFilter(caseId)
    }
    processSearchCandidate()
  }
  return (
    <Box>
      <Command active={isOpen} onClick={toggleOpen}>
        Recommended Filters
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconButton onClick={handleFilterSearch}>
            <NewTabIcon color={isOpen ? '#C47ED0' : '#4CAF50'} />
          </IconButton>
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
      </Command>
      {isOpen && (
        <Paper>
          {filters.status === 'done' ? (
            <JobFilters filters={filters.content.filters} />
          ) : filters.status === 'loading' ? (
            <Spin>
              <LogoAnimated />
            </Spin>
          ) : filters.status === 'error' ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                padding: '25px 27px',
                fontFamily: 'Axiforma',
                fontSize: '16px',
                fontWeight: '500',
                lineHeight: '19.2px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  paddingBottom: '12px',
                }}
              >
                <ClearIcon
                  sx={{
                    color: '#790E8B',
                    width: '70px',
                    height: '70px',
                  }}
                />
                <span style={{ color: '#790E8B', textAlign: 'center' }}>
                  Ups... something is not right...
                </span>
              </Box>
              <span
                style={{
                  textAlign: 'center',
                  borderTop: '1px solid #00000029',
                  width: '326px',
                  paddingTop: '8px',
                }}
              >
                Error logs and bug reports are submitted automatically, but you can also:
              </span>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '12px',
                }}
              >
                <Button
                  sx={{
                    borderRadius: '100px',

                    fontFamily: 'Axiforma',
                    fontSize: '14px',
                    fontWeight: '700',
                    lineHeight: '18.2px',
                    background: '#E8DEF8',
                    color: '#AB47BC',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                  variant='contained'
                >
                  Open support case
                </Button>
                <Button
                  sx={{
                    borderRadius: '100px',

                    fontFamily: 'Axiforma',
                    fontSize: '14px',
                    fontWeight: '700',
                    lineHeight: '18.2px',
                  }}
                  variant='contained'
                >
                  Retry request
                </Button>
              </Box>
            </Box>
          ) : (
            <>Start Automation Search</>
          )}
        </Paper>
      )}
    </Box>
  )
}
