import { Button, styled } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Dispatch, SetStateAction, useState } from 'react'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

type Props = {
  setFile: Dispatch<SetStateAction<string | Blob>>
}

const UploadCSVFile = ({ setFile }: Props) => {
  const [disabled, setDisabled] = useState(false)

  const handleFileUpload = async (event: any) => {
    const fileInput = event.target
    const file = fileInput.files[0]

    if (file && file.name.endsWith('.csv')) {
        setDisabled(true)
        setFile(file)
    }
  }
  const handleInputClick = (event: any) => {
    event.target.value = ''
  }

  return (
    <Button
      component='label'
      variant='contained'
      startIcon={<CloudUploadIcon />}
      disabled={disabled}
    >
      Upload CSV file
      <VisuallyHiddenInput
        onChange={handleFileUpload}
        onClick={handleInputClick}
        type='file'
        accept='.csv'
      />
    </Button>
  )
}

export default UploadCSVFile
