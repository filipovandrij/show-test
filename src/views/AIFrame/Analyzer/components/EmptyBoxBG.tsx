import { Box } from '@mui/material'
import EmptyBox from '../../../../img/EmptyBox.svg'

const EmptyBoxBG = () => {
  return (
    <Box
      sx={{
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img width={156} src={EmptyBox} alt='chatgpt' />
      <span
        style={{
          marginTop: '28px',
          fontFamily: 'Axiforma',
          fontSize: '14px',
          fontWeight: '500',
          color: '#212121',
        }}
      >
        Nothing was found!
      </span>
      <span
        style={{
          marginTop: '14px',
          fontFamily: 'Axiforma',
          fontSize: '14px',
          fontWeight: '500',
          color: '#757575',
        }}
      >
        Сюда нужно будет <br /> придумать текст
      </span>
    </Box>
  )
}
export default EmptyBoxBG
