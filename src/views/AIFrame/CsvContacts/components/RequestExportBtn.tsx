import { useState } from 'react'
import { styled } from '@mui/system'
import { Box, Button } from '@mui/material'
import { Add, Remove } from '@mui/icons-material'
import { ExportButton } from './ExportButton'
import WaitingIconAnimated from '../../../../components/Icons/WaitingIconAnimated'
import { createCsvFile } from '../Requests/downloadCSV'

const CenteredText = `font-family: 'Axiforma';
font-style: normal;
font-weight: 700;
line-height: 150%;
color: #9e9e9e;`

const ReadyForExport = styled('div')`
  ${CenteredText}
  font-size: 16px;
  margin-bottom: 8px;
`
const Timer = styled('div')`
  ${CenteredText}
  font-size: 13px;
`

type RequestExportBtnProps = {
  type: 'contacts' | 'organizations'
}
export const RequestExportBtn = ({ type }: RequestExportBtnProps) => {
  const [expanded, setExpanded] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const expand = () => setExpanded((s) => !s)
  const createCSV = async (send_type: string) => {
    setIsCreating(true)
    await createCsvFile(send_type)
    chrome.runtime.sendMessage({ type: 'UPDATE_CSV_LIST' })
    setIsCreating(false)
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        margin: '8px',
        marginBottom: 0,
        gap: '4px',
        border: '1px solid #dddddd',
        borderRadius: '4px',
        borderTop: 'none',
        boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.24)',
      }}
    >
      <ExportButton
        color={expanded ? '#ffffff' : '#AB47BC'}
        backgroundColor={expanded ? '#790E8B' : '#ebebeb'}
        hoverColor={expanded ? '#790E8B' : '#AB47BC'}
        title={
          <div style={{ display: 'flex', gap: '4px' }}>
            {expanded ? <Remove color='disabled' /> : <Add />}
            <div>Request New {type[0].toUpperCase() + type.substring(1)} export</div>
          </div>
        }
        onClick={expand}
      />
      {expanded ? (
        <Box
          sx={{
            display: 'flex',
            padding: '8px',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <ReadyForExport>Your database contains 800 {type} ready for export</ReadyForExport>
          <Timer>
            <WaitingIconAnimated /> 20m 3s
          </Timer>
          <Button
            sx={{
              justifyContent: 'space-between',
              backgroundColor: '#4caf50',
              color: '#ffffff',
            }}
            onClick={() => createCSV(type)}
            disabled={isCreating}
          >
            Request CSV
          </Button>
        </Box>
      ) : null}
    </Box>
  )
}
