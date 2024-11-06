import { FC } from 'react'
import { AccessTime, CheckCircleOutline, ErrorOutline, Refresh } from '@mui/icons-material'

const statuses = {
  added: <AccessTime style={{ color: '#2196F3' }} />,
  processing: <Refresh />,
  success: <CheckCircleOutline style={{ color: '#4CAF50' }} />,
  error: <ErrorOutline style={{ color: '#F44336' }} />,
  edit: null,
  visible: null
}

const Status: FC<{ status?: keyof typeof statuses }> = ({ status }) => {
  return status ? statuses[status] : null
}

export default Status
