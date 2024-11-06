import React from 'react'
import { styled } from '@mui/system'
import { Box } from '@mui/material'
import { People, Domain, Download, Delete } from '@mui/icons-material'
import { DateFomat } from '../elements/DateFormat'
import { CsvListItem } from '../models/csvList'
import { deleteCsvFile, downloadCsvFile } from '../Requests/downloadCSV'
import WaitingIconAnimated from '../../../../components/Icons/WaitingIconAnimated'

const AxiformaFont = `
fontfamily: 'Axiforma';
font-style: normal;
font-weight: 700;`

const NameDiv = styled('div')<{
  color: string
}>`
  flex: 1;
  ${AxiformaFont}
  font-size: 16px;
  color: ${({ color }) => color};
`

const IconDiv = styled('div')<{
  color?: string
}>`
  display: flex;
  cursor: pointer;
  ${AxiformaFont}
  font-size: 14px;
  color: ${({ color }) => color || '#BDBDBD'};
  align-items: center;
  margin-right: 8px;
`

type RequestExportBtnProps = {
  type: string
  item: CsvListItem
  i: number
}
export const ExportFile = ({ i, item, type }: RequestExportBtnProps) => {
  const [status, setStatus] = React.useState('idle') // 'idle', 'loading', 'completed'

  const download = async () => {
    setStatus('loading')
    downloadCsvFile(item.id)
  }

  const remove = async () => {
    await deleteCsvFile(item.id)

    chrome.runtime.sendMessage({ type: 'UPDATE_CSV_LIST' })
  }

  const isDisabled = item.load_status === 'loading'

  const background =
    status === 'idle' ? '#ffffff00' : 'linear-gradient(90deg, #E8F4FE 0  100%, #ffffff00 0% 100%)'

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        margin: '8px',
        marginBottom: 0,
        padding: '8px',
        border: `1px solid ${status === 'idle' ? '#f3e9f5' : '#8fcaf8'}`,
        borderRadius: '4px',
        background,
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      {type === 'apollo_contacts' ? (
        <People color={status === 'idle' ? 'primary' : 'secondary'} style={{ margin: '8px' }} />
      ) : (
        <Domain color={status === 'idle' ? 'primary' : 'secondary'} style={{ margin: '8px' }} />
      )}
      <NameDiv style={{ flex: 1 }} color={status === 'idle' ? '#AB47BC' : '#2196F3'}>
        {type === 'apollo_contacts' ? `Contacts export ${i + 1}` : `Organizations export ${i + 1}`}
      </NameDiv>
      <DateFomat date={new Date(item.created_at)} />
      <IconDiv
        onClick={!isDisabled ? download : undefined}
        color={status !== 'idle' ? '#2196F3' : '#BDBDBD'}
      >
        <Download color={status === 'idle' ? 'disabled' : 'secondary'} />
        {item.count_entities}
      </IconDiv>
      <IconDiv onClick={!isDisabled ? remove : undefined}>
        {item.load_status === 'loading' ? (
          <WaitingIconAnimated />
        ) : (
          <Delete color={isDisabled ? 'disabled' : 'error'} />
        )}
      </IconDiv>
    </Box>
  )
}
