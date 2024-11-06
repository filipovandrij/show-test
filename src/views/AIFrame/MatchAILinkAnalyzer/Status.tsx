import { FC } from 'react'
import { styled } from '@mui/system'
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material'
import WaitingIconAnimated from '../../../components/Icons/WaitingIconAnimated'
import RefreshIcon from '../../../components/Icons/RefreshIcon'

const WaitingIconContainer = styled('div')`
  padding: 3px;
  font-size: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const statuses = {
  // added: <AccessTime style={{ color: '#2196F3' }} />,
  added: <WaitingIconContainer><WaitingIconAnimated /></WaitingIconContainer>,
  processing: <RefreshIcon style={{ color: 'rgb(171 71 188)' }} />,
  success: <CheckCircleOutline style={{ color: '#4CAF50' }} />,
  error: <ErrorOutline style={{ color: '#F44336' }} />,
  edit: null,
  visible: null,
}

const Status: FC<{ status?: keyof typeof statuses }> = ({ status }) => {
  return status ? statuses[status] : null
}

export default Status
