import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/system'
import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import BusinessIcon from '@mui/icons-material/Business'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { addNewCase, deleteAnalyzerCase, fetchCases } from '../Requests/requestsCase'
import { AddCommand, Command } from '../styles/analizerStyles'
import Footer from '../../../../app/footer/Footer'
import TaskPlannerIcon from '../../../../components/Icons/TaskPlannerIcon'
import Side from '../../../../components/Icons/Side'
import CancelBtn from '../../../../components/Icons/CancelBtn'
import LogoAinsysHeader from '../../../../components/Icons/LogoAinsysHeader'
import EmptyBoxBG from '../components/EmptyBoxBG'

const Content = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: white;
  border-radius: 15px;
  padding: 14px 10px;
`

export const CaseList = () => {
  const navigate = useNavigate()

  const [filter, setFilter] = useState('')

  const [cases, setCases] = useState([])

  const takeCases = async () => {
    const cases = await fetchCases()
    setCases(cases)
  }
  const addEmptyCase = async () => {
    const res = await addNewCase()
    takeCases()

    console.log('res', res)
    navigate(`/analyzer/${res.id}`)
    return res
  }

  useEffect(() => {
    takeCases()
  }, [])

  const handleDeleteCase = (id: number) => {
    deleteAnalyzerCase(id)
    takeCases()
  }
  const handleClosePlugin = useCallback(() => {
    chrome.runtime.sendMessage({
      action: 'closeMainFrame',
    })
  }, [])

  console.log('cases', cases)
  return (
    <Box
      sx={{
        background: 'rgb(236, 236, 236)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconButton onClick={() => navigate('/main')}>
            <ArrowBackIosIcon style={{ marginLeft: '9px' }} />
          </IconButton>
          <LogoAinsysHeader />
          <span
            style={{
              marginLeft: '12px',
              fontFamily: 'Axiforma',
              fontSize: '14px',
              fontWeight: '500',
              color: '#9E9E9E',
            }}
          >
            AI Headhunter 0.3
          </span>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignContent: 'center',
          }}
        >
          <IconButton onClick={() => navigate('/tasks')}>
            <TaskPlannerIcon />
          </IconButton>
          <IconButton>
            <Side />
          </IconButton>
          <IconButton onClick={handleClosePlugin}>
            <CancelBtn />
          </IconButton>
        </Box>
      </Box>
      <Content
        style={{
          height: '100%',
        }}
      >
        <AddCommand onClick={() => addEmptyCase()}>
          <AddIcon />
          Add Command
        </AddCommand>
        <TextField
          variant='standard'
          placeholder='Search'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
            inputProps: {
              style: {
                fontFamily: 'Axiforma',
                fontSize: '12px',
                fontWeight: '500',
                color: '#9E9E9E',
              },
            },
          }}
          fullWidth
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        {cases.length > 0 ? (
          cases
            .filter((item: any) => item.name.toLowerCase().includes(filter.toLowerCase()))
            .map((item: any) => (
              <Command onClick={() => navigate(`/analyzer/${item.id}`)}>
                <BusinessIcon />
                <div style={{ marginRight: 'auto' }}>{item.name}</div>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteCase(item.id)
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Command>
            ))
        ) : (
          <EmptyBoxBG />
        )}
      </Content>

      <Footer />
    </Box>
  )
}
