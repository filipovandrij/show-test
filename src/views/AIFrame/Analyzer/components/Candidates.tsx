import { useEffect, useState } from 'react'
import { Box, IconButton, Input, InputAdornment } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit'
import LanguageIcon from '@mui/icons-material/Language'
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline'
import { Command, InputsFormControls, Paper } from '../styles/analyzerFormStyles'
import Status from '../styles/Statuses'
import { updateCandidate } from '../Requests/candidates'
import { SelectDataCandidate } from './candidateComponents/SelectDataCandidate'
import { SelectAutomationsCandidate } from './candidateComponents/SelectAutomationsCandidate'
import { sendCreateFrameAction } from '../../../../utils/frames/sendCreateFrameAction'
import UploadPDFCandidate from './candidateComponents/UploadPDFCandidate'

type Props = {
  item: any
}

export const Candidates = ({ item }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [candidateUrl, setCandidateUrl] = useState('')

  const toggleEditMode = () => {
    setIsEditing(!isEditing)
  }

  const startFrame = (name: string, width = 680, height = 650) => {
    const frameConfig = {
      id: `${item.id}-${name}-candidate`,
      title: 'customData',
      width,
      height,
      top: 100,
      left: 100,
      frameType: 'frame/edit',
    }
    sendCreateFrameAction(frameConfig)
  }
  const toggleOpen = () => setIsOpen(!isOpen)

  const handleCandidateUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCandidateUrl(event.target.value)
  }
  const handleCandidateUrlBlurOrEnter = async () => {
    updateCandidate(item.id, { url: candidateUrl })
    setIsEditing(!isEditing)
  }
  const handleJobUrlKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleCandidateUrlBlurOrEnter()
      event.currentTarget.blur()
      setIsEditing(!isEditing)
    }
  }

  useEffect(() => {
    if (item.url !== undefined) {
      setCandidateUrl(item.url)
    }
  }, [])
  return (
    <Box key={item.position_in_case}>
      <Command active={isOpen} onClick={toggleOpen}>
        {item.position_in_case} {item.name}
        <Box sx={{ display: 'flex', gap: '2px' }}>
          <Status status={item.status} />
          {item.custom_data && item.custom_data.title && (
            <Status status={item.custom_data.title ? 'done' : 'planned'} />
          )}
          {item.instructions && item.instructions.title && (
            <Status status={item.instructions.title ? 'done' : 'planned'} />
          )}
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
      </Command>
      {isOpen && (
        <Paper>
          {/* {item.url !== undefined && (
            <FormControl fullWidth variant='standard'>
              <InputLabel sx={{ fontFamily: 'Axiforma' }} htmlFor='standard-adornment'>
                Candidate URL
              </InputLabel>
              <Input
                id='standard-adornment'
                value={candidateUrl}
                onChange={handleCandidateUrlChange}
                onBlur={handleCandidateUrlBlurOrEnter}
                onKeyPress={handleJobUrlKeyPress}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                    <Status status={item.status} />
                  </InputAdornment>
                }
              />
            </FormControl>
          )} */}

          {item.url !== undefined && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                width: '100%',
              }}
            >
              <span
                style={{
                  color: '#757575',
                  fontFamily: 'Axiforma',
                  fontSize: '12px',
                  fontWeight: '500',
                }}
              >
                Job Board URL
              </span>
              <InputsFormControls
                sx={{
                  width: '94%',
                  border: '2px solid #EFF2F4',
                  borderRadius: '5px',
                  padding: '6px 10px',
                }}
                variant='standard'
              >
                <Input
                  sx={{
                    width: '100%',
                  }}
                  id='standard-adornment'
                  value={candidateUrl}
                  onChange={handleCandidateUrlChange}
                  onBlur={handleCandidateUrlBlurOrEnter}
                  onKeyPress={handleJobUrlKeyPress}
                  endAdornment={
                    <InputAdornment position='end'>
                      <Status status={item.status} />
                    </InputAdornment>
                  }
                  startAdornment={
                    <InputAdornment position='start'>
                      <LanguageIcon />
                    </InputAdornment>
                  }
                  disabled={!isEditing}
                />

                <IconButton onClick={toggleEditMode}>
                  <EditIcon />
                </IconButton>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </InputsFormControls>
            </Box>
          )}

          {item.custom_data && item.custom_data.title !== undefined && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                width: '100%',
              }}
            >
              <span
                style={{
                  color: '#757575',
                  fontFamily: 'Axiforma',
                  fontSize: '12px',
                  fontWeight: '500',
                }}
              >
                Custom Data
              </span>

              <InputsFormControls variant='standard'>
                <Input
                  sx={{
                    width: '100%',
                  }}
                  id='standard-adornment'
                  value={item.custom_data.title ? item.custom_data.title : 'Title'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <Status status={item.custom_data.title ? 'done' : 'planned'} />
                    </InputAdornment>
                  }
                  startAdornment={
                    <InputAdornment position='start'>
                      <ViewHeadlineIcon />
                    </InputAdornment>
                  }
                />
                <IconButton onClick={() => startFrame('custom_data', 400, 675)}>
                  <EditIcon />
                </IconButton>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </InputsFormControls>
            </Box>
          )}
          {item.instructions && item.instructions.title !== undefined && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                width: '100%',
              }}
            >
              <span
                style={{
                  color: '#757575',
                  fontFamily: 'Axiforma',
                  fontSize: '12px',
                  fontWeight: '500',
                }}
              >
                Instructions
              </span>

              <InputsFormControls variant='standard'>
                <Input
                  sx={{
                    width: '100%',
                  }}
                  id='standard-adornment'
                  value={item.instructions.title ? item.instructions.title : 'Title'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <Status status={item.instructions.title ? 'done' : 'planned'} />
                    </InputAdornment>
                  }
                  startAdornment={
                    <InputAdornment position='start'>
                      <ViewHeadlineIcon />
                    </InputAdornment>
                  }
                />
                <IconButton onClick={() => startFrame('instructions', 400, 675)}>
                  <EditIcon />
                </IconButton>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </InputsFormControls>
            </Box>
          )}
          {item.extracted_pdf && item.extracted_pdf.title !== undefined && (
            <UploadPDFCandidate item={item} />
          )}
          <div style={{ display: 'flex', width: '100%', gap: 12, padding: '10px 0px' }}>
            <SelectDataCandidate candidate={item} />
            <SelectAutomationsCandidate />
          </div>
        </Paper>
      )}
    </Box>
  )
}
