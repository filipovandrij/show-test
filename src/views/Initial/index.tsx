import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/system'

const InitialContainer = styled('div')`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme: { palette } }) => palette.colorBgContainer};
`

export const Initial = () => {
  return (
    <InitialContainer>
      <CircularProgress />
    </InitialContainer>
  )
}
