import { TextField } from '@mui/material'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { LoadingButton } from '@mui/lab'
import { styled } from '@mui/system'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useNavigate } from 'react-router-dom'
import api from '../../../api'
import { loadNewTab } from '../../../utils/newTab'
import { AppContext } from '../../../app/appContext'
import { getToken } from '../../../api/getToken'
import { getBaseUrl } from '../../../api/baseUrl'
import { useAppStateSelector } from '../../../hooks/useAppStateSelector'

type FormState = Record<string, string>

const fields = [
  {
    name: 'jobDescription',
    title: 'Link to linkedin job description',
    placeholder: 'Enter a link to the job description on LinkedIn',
  },
].concat(
  Array(6)
    .fill(0)
    .map((_, i) => ({
      name: `candidate_${i + 1}`,
      placeholder: 'Enter the link to the LinkedIn candidate profile',
      title: `Link to linkedin candidate profile ${i + 1}`,
    }))
)

const ErrorContainer = styled('div')`
  font-size: 20px;
  width: 100%;
  text-align: center;
  color: red;
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

const getPrompts = async () => {
  const token = await getToken()
  if (token) {
    const res = await fetch(`${await getBaseUrl()}/api/complex-analysis/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return res.json()
  }
}

const fieldsToValidate = {
  job: new RegExp(String.raw`https://www.linkedin.com/jobs/view/\d+\/`, 'u'),
  candidate: new RegExp(String.raw`https://www.linkedin.com/in/[\p{L}\p{N}\p{Pd}]+/$`, 'u'),
}

const isUrlValid = (url: string = '', pattern: RegExp) =>
  url.trim().length === 0 || pattern.test(decodeURIComponent(url))

export const CandidatesForm = () => {
  const lastExecution = useAppStateSelector((state) => state.lastExecutionFindCandidates)
  const [formState, setValue] = useState<FormState>({})
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')
  const isDisabled =
    fields.slice(0, 4).some(({ name }) => !formState[name]) ||
    fields.some(
      ({ name }, i) =>
        !isUrlValid(formState[name], new RegExp(fieldsToValidate[i === 0 ? 'job' : 'candidate']))
    ) ||
    Date.now() - (lastExecution || 0) < 300000
  const { setBalance } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    getPrompts().then((data) => {
      setBalance(data.message.credits)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const name = event?.currentTarget?.name
      const value = event?.currentTarget?.value
      name &&
        setValue((prev) => ({
          ...prev,
          [name]: value,
        }))
    },
    []
  )

  const onSubmit = useCallback(async () => {
    if (isDisabled) return
    setError('')
    setIsPending(true)

    const r = await api.getGsheetsUrl()
    const urls = await r.json()
    await loadNewTab(urls.message.Job_analysis)

    const res = await api.analyzeCandidates(
      { specific_key: formState.jobDescription },
      fields
        .slice(1)
        .filter(({ name }) => !!formState[name])
        .map(({ name }) => ({ specific_key: formState[name] })),
      'JobAIDE-0.1'
    )
    setIsPending(false)
    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      return
    }

    chrome.runtime.sendMessage({
      action: 'update_find_candidates_last_execution',
      value: Date.now(),
    })
    setBalance(data.message.credits)
  }, [formState, isDisabled, prompt, setBalance])

  return (
    <>
      <Title>
        <BackBtn onClick={() => navigate('/main')}>
          <ArrowBackIosIcon style={{ marginLeft: '9px' }} />
        </BackBtn>
        MatchAI LinkAnalyzer 0.1
      </Title>
      <Content>
        {error && <ErrorContainer>{error}</ErrorContainer>}
        {fields.map(({ name, placeholder, title }, i) => {
          const url = formState[name]
          const error = !isUrlValid(
            url,
            new RegExp(fieldsToValidate[i === 0 ? 'job' : 'candidate'])
          )
          return (
            <TextField
              variant='outlined'
              error={error}
              helperText={error && 'URL is not correct'}
              id={name}
              name={name}
              value={url}
              onChange={onChange}
              label={title}
              placeholder={placeholder}
              required={i < 4}
              title='Paste links to the LinkedIn in the provided fields to ensure a deeper exploration of their professional experiences'
            />
          )
        })}
        <LoadingButton
          variant='contained'
          color='primary'
          onClick={onSubmit}
          loading={isPending}
          disabled={isDisabled}
        >
          Submit for analysis by AI
        </LoadingButton>
      </Content>
    </>
  )
}
