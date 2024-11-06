import { useEffect, useState } from 'react'
import { Box, IconButton, Input, InputAdornment } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline'
import LanguageIcon from '@mui/icons-material/Language'
import EditIcon from '@mui/icons-material/Edit'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Command, InputsFormControls, Paper } from '../styles/analyzerFormStyles'
import { SelectAutomations } from './jobComponents/SelectAutomations'
import { SelectData } from './jobComponents/SelectData'
import { fetchCaseById, updateCase } from '../Requests/requestsCase'
import Status from '../styles/Statuses'
import { sendCreateFrameAction } from '../../../../utils/frames/sendCreateFrameAction'

type Props = {
  jobDescription: any
  caseId: any
  checkCase: () => Promise<void>
}

export const JobForm = ({ caseId, jobDescription, checkCase }: Props) => {
  const [companyUrl, setCompanyUrl] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [hrUrl, setHrUrl] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingManager, setIsEditingManager] = useState(false)
  const [isEditingCompany, setIsEditingCompany] = useState(false)
  const [innerJobsLinks, setInnerJobsLinks] = useState<any>()

  const toggleEditMode = () => {
    setIsEditing(!isEditing)
  }
  const toggleEditModeManager = () => {
    setIsEditingManager(!isEditingManager)
  }
  const toggleEditModeCompany = () => {
    setIsEditingCompany(!isEditingCompany)
  }
  const checkInnerJobsLinks = async () => {
    const innerCase = await fetchCaseById(Number(caseId))
    setInnerJobsLinks(innerCase.job_description)
  }

  const toggleOpen = () => setIsOpen(!isOpen)

  const handleJobUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJobUrl(event.target.value)
  }

  const handleJobUrlBlurOrEnter = async () => {
    updateCase(caseId, { job_url: jobUrl })
    await checkInnerJobsLinks()
    setIsEditing(!isEditing)
  }

  const handleJobUrlKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleJobUrlBlurOrEnter()
      event.currentTarget.blur()
      setIsEditing(!isEditing)
    }
  }

  const handleHrUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHrUrl(event.target.value)
  }

  const handleHrUrlBlurOrEnter = async () => {
    updateCase(caseId, { hr_url: hrUrl })
    await checkInnerJobsLinks()
    setIsEditingManager(!isEditingManager)
  }

  const handleHrUrlKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleHrUrlBlurOrEnter()
      event.currentTarget.blur()
      setIsEditingManager(!isEditingManager)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyUrl(event.target.value)
  }

  const handleBlurOrEnter = async () => {
    updateCase(caseId, { company_url: companyUrl })
    await checkInnerJobsLinks()
    setIsEditingCompany(!isEditingCompany)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleBlurOrEnter()
      event.currentTarget.blur()
      setIsEditingCompany(!isEditingCompany)
    }
  }
  useEffect(() => {
    if (innerJobsLinks?.url !== undefined) {
      setJobUrl(innerJobsLinks.url)
    }
    if (innerJobsLinks?.hr_url?.url !== undefined) {
      setHrUrl(innerJobsLinks.hr_url.url)
    }
    if (innerJobsLinks?.organization_url?.url !== undefined) {
      setCompanyUrl(innerJobsLinks.organization_url.url)
    }
  }, [innerJobsLinks])

  useEffect(() => {
    checkCase()
    checkInnerJobsLinks()
  }, [])

  const startFrame = (name: string, width = 680, height = 650) => {
    const frameConfig = {
      id: `${caseId}-${name}-job`,
      title: 'customData',
      width,
      height,
      top: 100,
      left: 100,
      frameType: 'frame/edit',
    }
    sendCreateFrameAction(frameConfig)
  }

  // const formatDate = (timestamp: any) => {
  //   const date = new Date(timestamp)
  //   const pad = (num: any) => (num < 10 ? `0${num}` : num)
  //   const day = pad(date.getDate())
  //   const month = pad(date.getMonth() + 1)
  //   const year = date.getFullYear().toString().slice(2)
  //   const hours = pad(date.getHours())
  //   const minutes = pad(date.getMinutes())
  //   const seconds = pad(date.getSeconds())
  //   return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`
  // }

  return (
    <Box>
      <Command active={isOpen} onClick={toggleOpen}>
        Job data sources
        <Box sx={{ display: 'flex', gap: '2px' }}>
          <Status status={jobDescription.status} />
          {jobDescription.organization_url && (
            <Status status={jobDescription.organization_url.status} />
          )}
          {jobDescription.hr_url && <Status status={jobDescription.hr_url.status} />}
          {jobDescription.custom_data && jobDescription.custom_data.title && (
            <Status status={jobDescription.custom_data.title ? 'done' : 'planned'} />
          )}
          {jobDescription.instructions && jobDescription.instructions.title && (
            <Status status={jobDescription.instructions.title ? 'done' : 'planned'} />
          )}
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
      </Command>
      {isOpen && (
        <Paper>
          {jobDescription.url !== undefined && (
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
                  value={jobUrl}
                  onChange={handleJobUrlChange}
                  onBlur={handleJobUrlBlurOrEnter}
                  onKeyPress={handleJobUrlKeyPress}
                  endAdornment={
                    <InputAdornment position='end'>
                      <Status status={jobDescription.status} />
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
          {jobDescription.hr_url && jobDescription.hr_url.url !== undefined && (
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
                Hiring Manager&apos;s LinkedIn
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
                  value={hrUrl}
                  onChange={handleHrUrlChange}
                  onBlur={handleHrUrlBlurOrEnter}
                  onKeyPress={handleHrUrlKeyPress}
                  endAdornment={
                    <InputAdornment position='end'>
                      <Status status={jobDescription.hr_url.status} />
                    </InputAdornment>
                  }
                  startAdornment={
                    <InputAdornment position='start'>
                      <LanguageIcon />
                    </InputAdornment>
                  }
                  disabled={!isEditingManager}
                />

                <IconButton onClick={toggleEditModeManager}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    updateCase(caseId, {
                      hr_url: '1',
                    })
                    checkCase()
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </InputsFormControls>
            </Box>
          )}
          {jobDescription.organization_url && jobDescription.organization_url.url !== undefined && (
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
                Hiring Companie&apos;s LinkedIn
              </span>

              <InputsFormControls variant='standard'>
                <Input
                  sx={{
                    width: '100%',
                  }}
                  id='standard-adornment'
                  value={companyUrl}
                  onChange={handleChange}
                  onBlur={handleBlurOrEnter}
                  onKeyPress={handleKeyPress}
                  endAdornment={
                    <InputAdornment position='end'>
                      <Status status={jobDescription.organization_url.status} />
                    </InputAdornment>
                  }
                  startAdornment={
                    <InputAdornment position='start'>
                      <LanguageIcon />
                    </InputAdornment>
                  }
                  disabled={!isEditingCompany}
                />
                <IconButton onClick={toggleEditModeCompany}>
                  <EditIcon />
                </IconButton>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </InputsFormControls>
            </Box>
          )}
          {jobDescription.custom_data && jobDescription.custom_data.title !== undefined && (
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
                  value={
                    jobDescription.custom_data.title ? jobDescription.custom_data.title : 'Title'
                  }
                  endAdornment={
                    <InputAdornment position='end'>
                      <Status status={jobDescription.custom_data.title ? 'done' : 'planned'} />
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
          {jobDescription.instructions && jobDescription.instructions.title !== undefined && (
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
                  value={
                    jobDescription.instructions.title ? jobDescription.instructions.title : 'Title'
                  }
                  endAdornment={
                    <InputAdornment position='end'>
                      <Status status={jobDescription.instructions.title ? 'done' : 'planned'} />
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
          <div style={{ display: 'flex', width: '100%', gap: 12, padding: '10px 0px' }}>
            <SelectData jobDescription={jobDescription} checkCase={checkCase} caseId={caseId} />
            <SelectAutomations
              jobDescription={jobDescription}
              checkCase={checkCase}
              caseId={caseId}
            />
          </div>
        </Paper>
      )}
    </Box>
  )
}
