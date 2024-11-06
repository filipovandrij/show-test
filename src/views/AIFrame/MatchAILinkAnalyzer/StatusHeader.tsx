import { Description, FormatAlignJustify, InsertLink } from '@mui/icons-material'
import { createSvgIcon } from '@mui/material'
import { cloneElement } from 'react'
import { styled } from '@mui/system'
import WaitingIconAnimated from '../../../components/Icons/WaitingIconAnimated'
import RefreshIcon from '../../../components/Icons/RefreshIcon'

const Error = createSvgIcon(
  <svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 13 13' fill='none'>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M1.08398 6.5026C1.08398 3.5126 3.51065 1.08594 6.50065 1.08594C9.49065 1.08594 11.9173 3.5126 11.9173 6.5026C11.9173 9.4926 9.49065 11.9193 6.50065 11.9193C3.51065 11.9193 1.08398 9.4926 1.08398 6.5026Z'
      fill='#F44336'
    />
    <path d='M4 4L9 9M9 4L4 9' stroke='white' strokeWidth='1.3' />
  </svg>,
  'Error'
)

const Success = createSvgIcon(
  <svg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 13 13' fill='none'>
    <path
      d='M6.50065 1.08594C3.51065 1.08594 1.08398 3.5126 1.08398 6.5026C1.08398 9.4926 3.51065 11.9193 6.50065 11.9193C9.49065 11.9193 11.9173 9.4926 11.9173 6.5026C11.9173 3.5126 9.49065 1.08594 6.50065 1.08594ZM5.41732 9.21094L2.70898 6.5026L3.47273 5.73885L5.41732 7.67802L9.52857 3.56677L10.2923 4.33594L5.41732 9.21094Z'
      fill='#4CAF50'
    />
    <path d='M3.5 5.5L2.5 6.5L5.5 9.5L10.5 4.5L9.5 3.5L5.5 7.5L3.5 5.5Z' fill='white' />
  </svg>,
  'Success'
)

const WaitingIconContainer = styled('div')`
  padding: 3px;
  font-size: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const icons = {
  link: <InsertLink />,
  text: <FormatAlignJustify />,
  file: <Description />,
  // proces: <Processing />,
  // loading: <WaitingIconAnimated />,
}

const statusComponents = {
  success: {
    component: <Success style={{ position: 'relative', right: '10px', width: 13, height: 13 }} />,
    color: '#4CAF50',
  },
  error: {
    component: <Error style={{ position: 'relative', right: '10px', width: 13, height: 13 }} />,
    color: '#F44336',
  },
  added: {
    component: (
      <WaitingIconContainer>
        <WaitingIconAnimated />
      </WaitingIconContainer>
    ),
    color: '#F44336',
  },
  processing: {
    component: <RefreshIcon style={{ color: 'rgb(171 71 188)' }} />,
    color: 'rgb(171 71 188)',
  },
}

type StatusKey = keyof typeof statusComponents

type Props = {
  icon: 'link' | 'text' | 'file'
  status?: string
  active: boolean
}

const StatusHeader = ({ icon, status, active }: Props) => {
  if (!status) {
    return null
  }

  const { component, color } = statusComponents[status as StatusKey] ?? {
    component: null,
    color: '#9E9E9E',
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'flex-end' }}>
      {status === 'added' || status === 'processing'
        ? null
        : cloneElement(icons[icon], { style: { color: active ? 'white' : color } })}
      {/* {cloneElement(icons[icon], { style: { color: active ? 'white' : color } })} */}
      {component}
    </div>
  )
}

export default StatusHeader
