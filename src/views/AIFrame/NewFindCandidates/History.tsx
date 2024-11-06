import React, { useCallback, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import {
  Button,
  IconButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ChatIcon from '@mui/icons-material/Chat'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useNavigate } from 'react-router-dom'
import { useAppStateSelector } from '../../../hooks/useAppStateSelector'
import { debounce } from '../../../utils/debounce'
import { FindCandidates } from '../../../chrome/findCandidatesState'
import { deepEqual } from '../../../utils/deepEqual'

const Command = styled(Button)`
  background-color: #ebebeb;
  position: relative;
  border-radius: 4px;
  width: 100%;
  text-transform: none;
  color: #212121;
  display: flex;
  justify-content: flex-start;
  gap: 5px;
  padding: 8px;
  min-height: 48px;

  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;

  svg {
    color: #ab47bc;
  }

  & .date {
    font-size: 13px;
    font-weight: 400;
  }

  :hover {
    color: #fff;
    background-color: ${({ theme: { palette } }) => palette.primary.main};

    svg {
      color: #fff;
    }
  }
`

const Title = styled('div')`
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px ${({ theme: { palette } }) => palette.colorBorder} solid;
  background-color: ${({ theme: { palette } }) => palette.colorBgContainer};
  padding: 10px;
  gap: 12px;
  color: #bdbdbd;
  align-items: center;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`

const BackBtn = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  background-color: #ebebeb;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    cursor: pointer;
    background-color: #ab47bc;
    color: #fff;

    svg {
      color: #fff;
    }
  }
`

const Content = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px !important;
`

export const updateFindCandidates = debounce(
  (value: FindCandidates[]) =>
    chrome.runtime.sendMessage({
      action: 'update_find_candidates',
      value,
    }),
  500
)

const History = () => {
  const findCandidatesListFromBg = useAppStateSelector((state) => state.findCandidates)
  const [findCandidatesList, setFindCandidatesList] = useState<FindCandidates[]>(
    findCandidatesListFromBg || []
  )
  const navigate = useNavigate()

  const updateState = useCallback((nextState: Parameters<typeof setFindCandidatesList>[0]) => {
    setFindCandidatesList((prevState) => {
      const state = typeof nextState === 'function' ? nextState(prevState) : nextState
      updateFindCandidates(state)
      return state
    })
  }, [])

  const handleAdd = useCallback(() => {
    updateState((prev) => [
      ...prev,
      {
        fields: [
          {
            name: 'jobDescription',
            title: 'Job Description',
            placeholder: 'Enter a link to the job description on LinkedIn',
            label: 'Link to linkedin job description',
          },
        ],
        name: `Find candidates ${prev.length + 1}`,
        date: new Date().toLocaleString(),
        lastExecution: 0,
      },
    ])
  }, [])

  useEffect(() => {
    findCandidatesListFromBg &&
      !deepEqual(findCandidatesList, findCandidatesListFromBg) &&
      setFindCandidatesList(findCandidatesListFromBg)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findCandidatesListFromBg])

  const handleDelete = useCallback((i: number) => {
    updateState((prev) => [...prev.slice(0, i), ...prev.slice(i + 1)])
  }, [])

  return (
    <>
      <Title>
        <BackBtn onClick={() => navigate('/main')}>
          <ArrowBackIosIcon style={{ marginLeft: '9px' }}/>
        </BackBtn>
        AI Find best candidate for Job description 0.2
      </Title>
      <Content>
      <Command onClick={handleAdd}>
        <AddIcon />
        Add Command
      </Command>
      {findCandidatesList.map(({ name, date }, i) => (
        <Command onClick={() => navigate(`/recruit-ai-multi-source/${i}`)}>
          <ChatIcon />
          <div style={{ marginRight: 'auto' }}>{name}</div>
          <div className='date'>{date}</div>
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(i)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Command>
      ))}
      </Content>
    </>
  )
}

export default History
