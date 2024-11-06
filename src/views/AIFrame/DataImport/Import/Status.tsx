import React from 'react'
import { styled } from '@mui/system'
import { TStatus } from './model'

const Container = styled('div')`
  display: inline-flex;
  height: 24px;
  min-width: 42px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  text-transform: uppercase;
  padding: 0 10px;
  color: #fff;
  font-family: Axiforma;
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
`

const COLORS_STATUS: Record<Partial<TStatus>, string> = {
  done: '#4CAF50',
  success: '#4CAF50',
  'in progress': '#2196F3',
  planned: '#BDBDBD',
  static: '#BDBDBD',
  paused: '#FF9800',
  error: '#F44336',
  processing: '#2196F3',
  added: '#BDBDBD',
  'paused due to error': '#F44336',
}

type Props = {
  status?: TStatus
}

const Status = ({ status }: Props) => {
  if (!status) {
    return null
  }

  return (
    <Container
      style={{
        backgroundColor: COLORS_STATUS[status],
      }}
    >
      {status}
    </Container>
  )
}

export default Status
