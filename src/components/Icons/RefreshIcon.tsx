import { styled } from '@mui/system'
import { Refresh } from '@mui/icons-material'


  const RefreshIcon = styled(Refresh)`
  animation: rotation 2s linear infinite;

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

  export default RefreshIcon