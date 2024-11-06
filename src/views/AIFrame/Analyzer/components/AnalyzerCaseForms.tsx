import { useCallback, useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Candidates } from './Candidates'
import { Filters } from './Filters'
import { JobForm } from './JobForm'
import { AddCommand, Content } from '../styles/analizerStyles'
import { fetchCaseById } from '../Requests/requestsCase'
import { analisys } from '../Requests/analisys'
import { Feedback } from './Feedback'
import { processQueueManagerLinkedIn } from '../../../../chrome/queue/newQueue/queueManager'
import taskListIcon from '../../../../img/taskListIcon.svg'
import { addCandidateToCase } from '../Requests/candidates'

type Props = {
  caseId: number
}

export const AnalyzerCaseForms = ({ caseId }: Props) => {
  const [candidates, setCandidates] = useState<any>([])
  const [feedback, setFeedback] = useState<any>([])
  const [filters, setFilters] = useState<any>([])
  const [jobDescription, setJobDescription] = useState<any>([])
  const [allCandidatesDone, setAllCandidatesDone] = useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => {
      processQueueManagerLinkedIn()
    }, 2000)
  }, [])

  const checkCase = async () => {
    const innerCase = await fetchCaseById(Number(caseId))
    setCandidates(innerCase.candidates)
    setFeedback(innerCase.feedback)
    setFilters(innerCase.filters)
    setJobDescription(innerCase.job_description)
  }

  useEffect(() => {
    checkCase()
  }, [])

  useEffect(() => {
    const allDone = candidates.every((obj: any) => obj.status === 'done')
    setAllCandidatesDone(allDone)
  }, [candidates])

  const handleMessage = useCallback((message: any) => {
    if (message.type === 'processQueue') {
      processQueueManagerLinkedIn()
    }
  }, [])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleMessage)

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [handleMessage])

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === 'UPDATE_DATA') {
        checkCase()
      }
    }
    chrome.runtime.onMessage.addListener(handleMessage)
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  const sortedCandidates = candidates.sort(
    (a: any, b: any) => a.position_in_case - b.position_in_case
  )

  console.log(feedback)
  return (
    <Content>
      <JobForm checkCase={checkCase} caseId={caseId} jobDescription={jobDescription} />
      {filters.status && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <img src={taskListIcon} alt='#' />
            <span
              style={{
                fontFamily: 'Axiforma',
                fontSize: '12px',
                fontWeight: '500',
                lineHeight: '14.4px',
                color: '#757575',
              }}
            >
              AI Search for candidates
            </span>
          </Box>
          <Filters filters={filters} caseId={caseId} />
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <img src={taskListIcon} alt='#' />
          <span
            style={{
              fontFamily: 'Axiforma',
              fontSize: '12px',
              fontWeight: '500',
              lineHeight: '14.4px',
              color: '#757575',
            }}
          >
            Candidate
          </span>
        </Box>
        {sortedCandidates && sortedCandidates.map((item: any) => <Candidates item={item} />)}
        <AddCommand onClick={() => addCandidateToCase(caseId, '')}>
          <AddIcon />
          Candidate
        </AddCommand>
      </Box>

      {feedback &&
        feedback.map((item: any) => <Feedback caseId={caseId} feedback={feedback} item={item} />)}

      {feedback.length === 0 && candidates.length >= 3 && allCandidatesDone && (
        <Button
          style={{
            marginTop: 8,
            textTransform: 'none',
            gap: 2,
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: 'Axiforma',
            backgroundColor: '#4CAF50',
          }}
          variant='contained'
          size='small'
          fullWidth
          onClick={() => {
            analisys(caseId)
            checkCase()
          }}
        >
          Analyzing
        </Button>
      )}
    </Content>
  )
}
