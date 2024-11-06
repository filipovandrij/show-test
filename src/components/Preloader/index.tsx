import { CSSProperties, FC } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { styled } from '@mui/system'

type PreloaderProps = {
  size?: number
  opacity?: number
  backgroundColor?: CSSProperties['backgroundColor']
}

const PreloaderContainer = styled(Box)`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  z-index: 4;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
`

export const Preloader: FC<PreloaderProps> = ({ size = 40, opacity = 0.5, backgroundColor }) => {
  return (
    <PreloaderContainer style={{ opacity, backgroundColor }}>
      <CircularProgress size={size} />
    </PreloaderContainer>
  )
}
