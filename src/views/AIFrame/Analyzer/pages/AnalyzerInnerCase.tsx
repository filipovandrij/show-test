import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { Box } from '@mui/material'
import { BackBtn, Child, Parent, Title } from '../styles/analizerStyles'
import { AnalyzerCaseForms } from '../components/AnalyzerCaseForms'
import { fetchCaseById } from '../Requests/requestsCase'

export const AnalyzerInnerCase = () => {
  const [thisCase, setthisCase] = useState<any>()

  const navigate = useNavigate()
  const { id } = useParams()
  const checkCase = async () => {
    const innerCase = await fetchCaseById(Number(id))
    setthisCase(innerCase)
  }
  const saveCaseId = (id: number) => {
    chrome.storage.local.get('currentCaseId', (result) => {
      if (result.currentCaseId !== id) {
        chrome.storage.local.set({ currentCaseId: id }, () => {
          console.log('Case ID saved:', id)
        })
      } else {
        console.log('Case ID is the same, no need to save:', id)
      }
    })
  }
  useEffect(() => {
    saveCaseId(Number(id))
    checkCase()
  }, [])

  useEffect(() => {
    console.log('thisCase updated:', thisCase)
  }, [thisCase])
  return (
    <>
      <Title>
        <BackBtn onClick={() => navigate('/analyzer')}>
          <ArrowBackIosIcon style={{ marginLeft: '9px' }} />
        </BackBtn>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Parent>Analyzer/</Parent>
          <Child>{thisCase?.name}</Child>
        </Box>
      </Title>
      <AnalyzerCaseForms caseId={Number(id)} />
    </>
  )
}
