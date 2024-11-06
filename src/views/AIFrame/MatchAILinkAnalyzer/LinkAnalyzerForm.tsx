import React, { useCallback, useContext, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { Box, Button, IconButton, SelectChangeEvent, Slide, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteIcon from '@mui/icons-material/Delete'
import { AccessTime, CheckCircleOutlineOutlined, Info, Search } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../../../app/appContext'
import { getToken } from '../../../api/getToken'
import { getBaseUrl } from '../../../api/baseUrl'
import {
  AnalyzeData,
  AnalyzerData,
  AnalyzerDataKey,
  LinkAnalyzer,
} from '../../../chrome/findCandidatesState'
import Status from './Status'
import { sendCreateFrameAction } from '../../../utils/frames/sendCreateFrameAction'
import { sendDestroyFrameAction } from '../../../utils/frames/sendDestroyFrameAction'
import Header from './Header'
import StatusHeader from './StatusHeader'
import { timer } from '../../../utils/timer'
import { loadNewTabWithScript } from '../../../utils/newTab/loadNewTabWithScript'
import { useAppStateSelector } from '../../../hooks/useAppStateSelector'
import { deepEqual } from '../../../utils/deepEqual'
import { updateFindCandidates } from './History'
import { Paper } from './styled'
import Result from './Result'
import { takeToQueue } from '../../../chrome/queue/AnalyzerQueueManager'
import { processQueueItem, updateStatuses } from '../../../chrome/queue/QueueManager'
import SelectAutomations from './SelectAutomations'
import SelectData from './SelectData'
import TextFieldData from './TextFieldData'
import { FilledCoin } from '../../../components/Icons/FilledCoin'
import { changeNames } from '../../../chrome/queue/ChangeTitles'
import { getState } from '../../../chrome/state'
import JobFilters from './JobFolters'
import LogoAnimated from '../../../components/Icons/LogoAnimated'
// import WaitingIconAnimated from '../../../components/Icons/WaitingIconAnimated'

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

const DialogTitle = styled('div')`
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px ${({ theme: { palette } }) => palette.colorBorder} solid;
  background-color: ${({ theme: { palette } }) => palette.colorBgContainer};
  padding: 10px;
  gap: 12px;
  color: #000;
  align-items: center;
  font-family: Axiforma;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;

  svg {
    cursor: pointer;
  }

  & .doneIcon {
    color: #4caf50;

    &:hover {
      color: rgb(57, 131, 59);
    }
  }

  & .editIcon {
    color: #bdbdbd;

    &:hover {
      color: #ab47bc;
    }
  }
`

const ErrorContainer = styled('div')`
  font-size: 20px;
  width: 100%;
  text-align: center;
  color: red;
`

const Command = styled(Button) <{
  active?: boolean
}>`
  background-color: #ebebeb;
  position: relative;
  border-radius: 4px 4px 0 0;
  width: 100%;
  text-transform: none;
  font-family: Axiforma;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  color: #212121;
  display: flex;
  justify-content: space-between;
  padding: 8px;
  gap: 8px;

  svg {
    color: #212121;
  }

  :hover {
    color: #fff;
    background-color: ${({ theme: { palette } }) => palette.primary.main};

    svg {
      color: #fff;
    }
  }

  ${({ active }) =>
    active
      ? `
    background-color: #ab47bc;
    color: #fff;
    svg {
      color: #fff;
    }
  `
      : ''}
`

const CommandAction = styled(Button)`
  background-color: #fff;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.24) !important;
  position: relative;
  border-radius: 4px;
  width: 100%;
  text-transform: none;
  font-family: Axiforma;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: #212121;
  display: flex;
  justify-content: flex-start;
  padding: 8px;

  svg {
    color: #ab47bc;
  }

  :hover {
    color: #fff;
    background-color: #ab47bc;

    svg {
      color: #fff;
    }
  }
`
const CustomTypography = styled(Typography)`
  font-family: Axiforma;
  font-size: 15px;
  font-weight: 600;
  &:hover {
    color: initial;
  }
`

const VisuallyHiddenInput = styled('input')({
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const Spin = styled('div')`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin 4s linear infinite;
  width: 56px;
  height: 56px;
`

const AttachFileContainer = styled('div')`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  background-color: rgb(251 248 251);
  border-radius: 4px 4px 0 0;
  label {
    padding: 10px;
    font-family: 'Axiforma';
  }

  & .css-9l3uo3 {
    font-family: 'Axiforma';
  }
`

const analyzeCandidates = async (
  candidates: (string | undefined)[],
  vacancy_url?: string,
  hiring_manager?: string
) => {
  const token = await getToken()
  const baseUrl = await getBaseUrl()

  return fetch(`${baseUrl}/api/prompt-manager/linkedin-analysis/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      vacancy_url,
      candidates,
      hiring_manager,
    }),
  })
}

export const getFilters = async (specific_key?: string, storage: any = 'localStorage') => {
  const token = await getToken()
  let startPrompt = true

  const localState = await getState(storage)

  if (localState && localState.linkAnalyzer) {
    localState.linkAnalyzer.forEach((item: any) => {
      if (
        item.formState.jobDescription.specific_key.content === specific_key &&
        item.formState.jobDescription.filters
      ) {
        startPrompt = false
      }
    })
  }

  if (!startPrompt) {
    console.log('Data for this specific_key already exists. No new request required.')
    return
  }

  if (token) {
    return fetch(`${await getBaseUrl()}/api/prompt-manager/filters/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        job_board: {
          specific_key,
        },
      }),
    })
  }
}

const getPrompts = async () => {
  const token = await getToken()
  if (token) {
    const res = await fetch(`${await getBaseUrl()}/api/complex-analysis/`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return res.json()
  }
}

const analyzeCredits = async (obj: Record<string, string>) => {
  const token = await getToken()
  return fetch(`${await getBaseUrl()}/api/complex-analysis/`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(obj),
  })
}

const convertBase64 = (file: File) => {
  return new Promise((resolve) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      resolve(fileReader.result)
    }
  })
}

export type Option = {
  value: string
  title: string
  content: string
}

export const options: Record<string, Option[]> = {
  [String.raw`jobDescription`]: [
    {
      value: 'specific_key',
      title: 'Enter the URL of the job posting from a recognized job board.',
      content: 'Job Board URL',
    },
    {
      value: 'employerLinkedInUrl',
      title: "Paste the LinkedIn profile link of the employer's company.",
      content: "Employer's LinkedIn URL",
    },
    {
      value: 'employerWebsiteUrl',
      title: "Provide the official website link of the employer's company.",
      content: "Employer's Website URL",
    },
    {
      value: 'hiringManagerLinkedIn',
      title: 'Insert the LinkedIn URL of the person responsible for hiring.',
      content: "Hiring Manager's LinkedIn",
    },
    {
      value: 'companyLinkedInUrl',
      title: 'Insert the LinkedIn URL of the person responsible for hiring.',
      content: "Hiring Companie's LinkedIn",
    },

    {
      value: 'instructions',
      title: 'Add detailed instructions or important notes about this job posting.',
      content: 'Job Specific Instructions and Details',
    },
    {
      value: 'customData',
      title:
        'Set a title and enter the content for your custom field. This can be any type of information relevant to the job.',
      content: 'Custom Data',
    },
  ],
  [String.raw`candidate_\d+`]: [
    {
      value: 'specific_key',
      title: 'Enter the LinkedIn URL of the candidate being considered.',
      content: "Candidate's LinkedIn URL",
    },
    {
      value: 'candidateOtherProfiles',
      title: 'Provide сopy of any data from additional professional profiles of the candidate.',
      content: "Candidate's Other Profiles",
    },
    {
      value: 'instructions',
      title: 'Add notes or specific instructions regarding this candidate.',
      content: 'Candidate Specific Instructions',
    },
    {
      value: 'customData',
      title:
        'Set a title and enter the content for your custom field. This can be any type of information relevant to the job.',
      content: 'Custom Data',
    },
    {
      value: 'file',
      title: "Upload the candidate's resume here. Accepts PDF.",
      content: "Candidate's Resume Upload",
    },
  ],
}

type Overlay = 'instructions' | 'customData'

type TextFields = {
  elem: AnalyzerDataKey
  title: string
  placeholder: string
  label: string
  overlay?: boolean
}

const textFields: Record<string, TextFields[]> = {
  [String.raw`jobDescription`]: [
    {
      elem: 'specific_key',
      title: 'Enter the URL of the job posting from a recognized job board.',
      placeholder: 'Job Board URL',
      label: 'Job Board URL',
    },
    {
      elem: 'employerLinkedInUrl',
      title: "Paste the LinkedIn profile link of the employer's company.",
      placeholder: "Employer's LinkedIn URL",
      label: "Employer's LinkedIn URL",
    },
    {
      elem: 'employerWebsiteUrl',
      title: "Provide the official website link of the employer's company.",
      placeholder: "Employer's Website URL",
      label: "Employer's Website URL",
    },
    {
      elem: 'hiringManagerLinkedIn',
      title: 'Insert the LinkedIn URL of the person responsible for hiring.',
      placeholder: "Hiring Manager's LinkedIn",
      label: "Hiring Manager's LinkedIn",
    },
    {
      elem: 'companyLinkedInUrl',
      title: 'Insert the LinkedIn URL of the person responsible for hiring.',
      placeholder: "Hiring Companie's LinkedIn",
      label: "Hiring Companie's LinkedIn",
    },
    {
      elem: 'instructions',
      title: 'Add detailed instructions or important notes about this job posting.',
      placeholder: 'Job Specific Instructions and Details',
      label: 'Job Specific Instructions and Details',
      overlay: true,
    },
    {
      elem: 'customData',
      title:
        'Set a title and enter the content for your custom field. This can be any type of information relevant to the job.',
      placeholder: 'Custom Data',
      label: 'Custom Data',
      overlay: true,
    },
  ],
  [String.raw`candidate_\d+`]: [
    {
      elem: 'specific_key',
      title: 'Enter the LinkedIn URL of the candidate being considered.',
      label: "Candidate's LinkedIn URL",
      placeholder: "Candidate's LinkedIn URL",
    },
    {
      elem: 'candidateOtherProfiles',
      title: 'Provide сopy of any data from additional professional profiles of the candidate.',
      label: "Candidate's Other Profiles",
      placeholder: "Candidate's Other Profiles",
    },
    {
      elem: 'instructions',
      title: 'Add notes or specific instructions regarding this candidate.',
      label: 'Candidate Specific Instructions',
      placeholder: 'Candidate Specific Instructions',
      overlay: true,
    },
    {
      elem: 'customData',
      title:
        'Set a title and enter the content for your custom field. This can be any type of information relevant to the job.',
      placeholder: 'Custom Data',
      label: 'Custom Data',
      overlay: true,
    },
  ],
}

type Automations = Option & {
  url?: string
  scripts?: string[]
  chromeMessage?: string
}

export const automations: Record<string, Automations[]> = {
  [String.raw`jobDescription`]: [
    {
      value: 'Search on Google',
      title: '',
      content: 'Search on Google',
      url: 'https://www.google.com/search?q=find%20candidate',
      scripts: ['./static/js/googleSearch.js'],
      chromeMessage: 'getFilters',
    },
    {
      value: 'Search on LinkedIn',
      title: '',
      content: 'Search on LinkedIn',
      url: 'https://www.linkedin.com/search/results/people/?origin=GLOBAL_SEARCH_HEADER',
      scripts: ['./static/js/linkedinSearch.js'],
      chromeMessage: 'getFilters',
    },
  ],
  [String.raw`candidate_\d+`]: [
    { value: 'Job offer letter', title: '', content: 'Job offer letter' },
    {
      value: 'Qualification invitation letter',
      title: '',
      content: 'Qualification invitation letter',
    },
    { value: 'Interview invitation letter', title: '', content: 'Interview invitation letter' },
  ],
}

export const keys = [String.raw`candidate_\d+`, String.raw`jobDescription`]
export const getKey = (name: string) => keys.find((key) => new RegExp(key, 'u').test(name))

type QueryParams = {
  id: string
}

const LinkAnalyzerForm = () => {
  const { id } = useParams<QueryParams>() as QueryParams
  const navigate = useNavigate()
  const findCandidatesListFromBg = useAppStateSelector(
    (state) => state?.linkAnalyzer as LinkAnalyzer[]
  )

  const [findCandidatesList, setFindCandidatesList] = useState<LinkAnalyzer[] | []>(
    findCandidatesListFromBg
  )
  const [findCandidate, setFindCandidate] = useState(findCandidatesListFromBg?.[+id])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [isComplete, setIsComplete] = useState(findCandidate?.complete)
  const [error, setError] = useState('')
  const { setBalance } = useContext(AppContext)
  const [promptOptions, setPrompOptions] = useState<
    { id: string; name: string; active: boolean }[]
  >([
    { id: 'Result A', name: 'Version A', active: true },
    { id: 'Result B', name: 'Version B', active: false },
    { id: 'Result C', name: 'Version C', active: false },
  ])
  const [promptValue, setPrompValue] = useState<string>('')
  const [hover, setHover] = useState(false)
  const isDisabled =
    findCandidate?.fields.length < 4 ||
    findCandidate?.fields.some(({ name }) => {
      const state = findCandidate?.formState?.[name]
      return (
        state &&
        ((state.specific_key && state.specific_key.status !== 'success') ||
          (state.file && state.file.status !== 'success') ||
          (state.instructions && state.instructions.status !== 'success') ||
          (state.customData && state.customData.status !== 'success') ||
          (state.candidateOtherProfiles && state.candidateOtherProfiles.status !== 'success') ||
          (state.employerLinkedInUrl && state.employerLinkedInUrl.status !== 'success') ||
          (state.employerWebsiteUrl && state.employerWebsiteUrl.status !== 'success'))
      )
    })

  useEffect(() => {
    if (findCandidatesListFromBg && !deepEqual(findCandidatesList, findCandidatesListFromBg)) {
      setFindCandidatesList(findCandidatesListFromBg)
      const findCandidateFromBg = findCandidatesListFromBg[+id]
      !deepEqual(findCandidate, findCandidateFromBg) && setFindCandidate(findCandidateFromBg)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findCandidatesListFromBg])

  const updateFindCandidatesList = useCallback((i: number, value: LinkAnalyzer) => {
    updateListState((prev) => [...prev.slice(0, i), value, ...prev.slice(i + 1)])
  }, [])

  const updateListState = useCallback((nextState: Parameters<typeof setFindCandidatesList>[0]) => {
    setFindCandidatesList((prevState) => {
      const state = typeof nextState === 'function' ? nextState(prevState) : nextState
      updateFindCandidates(state)
      return state
    })
  }, [])

  const updateState = useCallback(
    (nextState: Parameters<typeof setFindCandidate>[0]) => {
      setFindCandidate((prevState) => {
        const state = typeof nextState === 'function' ? nextState(prevState) : nextState
        updateFindCandidatesList(+id, state)
        return state
      })
    },
    [id]
  )

  useEffect(() => {
    getPrompts().then((data) => {
      setBalance(data.message.credits)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleActiveIndex = useCallback(
    (index: number) => {
      setActiveIndex(index === activeIndex ? null : index)
    },
    [activeIndex]
  )

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const [name, elem] = event?.currentTarget?.name.split('.') || []
      const value = event?.currentTarget?.value
      name &&
        updateState((prev) => ({
          ...prev,
          formState: {
            ...prev.formState,
            [name]: {
              ...prev?.formState?.[name],
              [elem]: { ...prev?.formState?.[name][elem as keyof AnalyzeData], content: value },
            },
          },
        }))
      setTimeout(() => {
        takeToQueue()
      }, 1500)
    },

    []
  )

  const onBlur = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event?.currentTarget?.value
      const [name, elem] = event?.currentTarget?.name.split('.') || []

      if (name) {
        updateState((prev) => ({
          ...prev,
          formState: {
            ...prev.formState,
            [name]: {
              ...prev.formState?.[name],
              [elem]: { ...prev.formState?.[name][elem as keyof AnalyzeData], status: 'added' },
            },
          },
        }))

        const res = await analyzeCredits({ [elem]: value })
        await res.json()

        updateState((prev) => ({
          ...prev,
          formState: {
            ...prev.formState,
            [name]: {
              ...prev.formState?.[name],
              [elem]: {
                ...prev.formState?.[name][elem as keyof AnalyzeData],
                status: res.ok ? 'success' : 'error',
              },
            },
          },
        }))
      }
    },
    []
  )

  const handleAddCandidate = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          name: `candidate_${prev.fields.length}`,
          title: 'Candidate',
        },
      ],
    }))
  }, [])

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    const { name } = event.currentTarget

    if (files && files.length) {
      updateState((prev) => ({
        ...prev,
        formState: {
          ...prev.formState,
          [name]: {
            ...prev.formState?.[name],
            file: {
              ...prev.formState?.[name].file,
              status: 'added',
            },
          },
        },
      }))

      const file = files[0]
      const base64 = (await convertBase64(file)) as string
      const fileName = file.name

      const res = await analyzeCredits({ file: base64 })
      await res.json()

      updateState((prev) => ({
        ...prev,
        formState: {
          ...prev.formState,
          [name]: {
            ...prev.formState?.[name],
            file: {
              ...prev.formState?.[name].file,
              content: base64,
              name: fileName,
              status: res.ok ? 'success' : 'error',
            },
          },
        },
      }))
    }
  }, [])

  const isLast = useCallback(
    (i: number) => {
      const { name } = findCandidate.fields[i]
      const state = findCandidate.formState?.[name]
      return (
        i < 12 &&
        findCandidate.fields.length - 1 === i &&
        (state?.specific_key?.content ||
          state?.file?.content ||
          state?.text?.content ||
          state?.description?.content)
      )
    },
    [findCandidate?.formState, findCandidate?.fields]
  )

  const alphabet = 'ABC'

  const handleSubmit = useCallback(async () => {
    setError('')
    setIsPending(true)

    updateState((prev) => {
      if (alphabet[prev.results.length]) {
        return {
          ...prev,
          results: [
            ...prev.results,
            {
              title: `Result ${alphabet[prev.results.length]}`,
              loading: true,
              raiting: 0,
              feedback: false,
            },
          ],
        }
      }
      return prev
    })

    const formState = findCandidate.formState
    const fields = findCandidate.fields

    const res = await analyzeCandidates(
      fields
        .slice(1)
        .filter(({ name }) => !!formState?.[name])
        .map(({ name }) => formState?.[name].specific_key?.content),
      formState?.jobDescription?.specific_key?.content,
      formState?.jobDescription?.hiringManagerLinkedIn?.content
    )

    setIsPending(false)
    const data = await res.json()

    updateState((prev) => {
      const prevData = { ...prev }
      const resultsLength = prevData.results.length
      prevData.results[resultsLength - 1] = {
        ...prevData.results[resultsLength - 1],
        documentUrl: data?.url,
      }

      return prevData
    })

    setTimeout(() => {
      updateState((prev) => {
        const prevData = { ...prev }
        const resultsLength = prevData.results.length
        if (resultsLength > 0) {
          prevData.results[resultsLength - 1] = {
            ...prevData.results[resultsLength - 1],
            loading: false,
          }
        }

        return prevData
      })
    }, 60000)

    if (!res.ok) {
      setError(data.error)
      return
    }

    setIsComplete(true)
    updateState((prev) => ({
      ...prev,
      lastExecution: Date.now(),
      complete: true,
    }))
  }, [
    findCandidate?.fields,
    findCandidate?.formState,
    isComplete,
    isPending,
    findCandidate?.results,
  ])

  useEffect(() => {
    setIsComplete(findCandidate?.complete)
  }, [findCandidate])

  const handleChangeSelectData = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      const { value, name } = event.target as { value: string; name: string }
      const title = value === 'instructions' ? 'Instructions' : ''

      updateState((prev) => ({
        ...prev,
        formState: {
          ...prev.formState,
          [name]: {
            ...prev.formState?.[name],
            [value]: { status: 'visible', title },
          },
        },
      }))

      if (value === 'instructions' || value === 'customData') {
        const frameConfig = {
          id: `${value}-${id}-${name}`,
          title: `${value}-${id}-${name}`,
          width: 680,
          top: 100,
          left: 100,
          height: 650,
          frameType: 'frame/edit',
        }
        sendCreateFrameAction(frameConfig)
        timer(200).then(() =>
          chrome.runtime.sendMessage({
            action: 'get_data_editing',
            title,
            content: '',
            disableTitle: value === 'instructions',
          })
        )
      }
    },
    [id]
  )

  const handleChangeSelectAutomations = useCallback(
    async (event: SelectChangeEvent<unknown>) => {
      const { value, name } = event.target as { value: string; name: string }
      const action = {
        title: value,
        date: new Date().toLocaleString(),
      }

      updateState((prev) => ({
        ...prev,
        formState: {
          ...prev.formState,
          [name]: {
            ...prev.formState?.[name],
            actions: {
              ...prev.formState?.[name].actions,
              [value]: action,
            },
          },
        },
      }))

      const automation = automations[getKey(name) as string].find(
        (automation) => automation.value === value
      )

      if (automation?.url) {
        const res = await getFilters(findCandidate?.formState?.[name].specific_key?.content)
        const data = await res?.json()

        const tabId = await loadNewTabWithScript(automation?.url, automation.scripts)
        if (tabId && automation.chromeMessage) {
          await timer(5000)
          chrome.tabs.sendMessage(tabId, {
            action: automation.chromeMessage,
            filter_prompt: data.filter_prompt,
          })
        }
      }
    },
    [findCandidate?.formState]
  )

  const changeEdit = useCallback((name: string, elem: string) => {
    updateState((prev) => ({
      ...prev,
      formState: {
        ...prev.formState,
        [name]: {
          ...prev.formState?.[name],
          [elem]: {
            ...prev.formState?.[name][elem as keyof AnalyzeData],
            status: 'edit',
          },
        },
      },
    }))
  }, [])

  // eslint-disable-next-line no-unused-vars
  const handleEditFrame = useCallback(
    (name: string, elem: string) => {
      const frameConfig = {
        id: `${elem}-${id}-${name}`,
        title: `${elem}-${id}-${name}`,
        width: 680,
        top: 100,
        left: 100,
        height: 650,
        frameType: 'frame/edit',
      }
      sendCreateFrameAction(frameConfig)
      timer(1000).then(() =>
        chrome.runtime.sendMessage({
          action: 'get_data_editing',
          title: findCandidate?.formState?.[name]?.[elem as Overlay]?.title,
          content: findCandidate?.formState?.[name]?.[elem as Overlay]?.content,
          disableTitle: elem === 'instructions',
        })
      )
    },
    [id, findCandidate]
  )

  const handleDelete = useCallback((name: string, elem: string) => {
    updateState((prev) => ({
      ...prev,
      formState: {
        ...prev.formState,
        [name]: { ...prev.formState?.[name], [elem]: {} },
      },
    }))
  }, [])

  const handleDeleteAction = useCallback((name: string, action: string) => {
    updateState((prev) => ({
      ...prev,
      formState: {
        ...prev.formState,
        [name]: {
          ...prev.formState?.[name],
          actions: {
            ...prev.formState?.[name].actions,
            [action]: {},
          },
        },
      },
    }))
  }, [])

  const listener = useCallback(async (request: any) => {
    if (request.action === 'update_find_candidates_editing') {
      const { name, elem, content } = request.value

      updateState((prev) => ({
        ...prev,
        formState: {
          ...prev.formState,
          [name]: {
            ...prev.formState?.[name],
            [elem]: {
              ...prev.formState?.[name]?.[elem as keyof AnalyzerData],
              title: request.value.title,
              content: request.value.content,
              status: 'added',
            },
          },
        },
      }))

      const res = await analyzeCredits({ [elem]: content })
      await res.json()

      updateState((prev) => ({
        ...prev,
        formState: {
          ...prev.formState,
          [name]: {
            ...prev.formState?.[name],
            [elem]: {
              ...prev.formState?.[name]?.[elem as keyof AnalyzerData],
              title: request.value.title,
              content: request.value.content,
              status: res.ok ? 'success' : 'error',
            },
          },
        },
      }))
    }
    if (request.action === 'getIdFindCandidates') {
      chrome.runtime.sendMessage({ action: 'idFindCandidates', id })
    }
  }, [])

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'idFindCandidates', id })

    chrome.runtime.onMessage.addListener(listener)

    return () => {
      chrome.runtime.sendMessage({ action: 'idFindCandidates', id: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      findCandidate?.fields?.forEach((field) => {
        sendDestroyFrameAction(`instructions-${id}-${field.name}`)
        sendDestroyFrameAction(`customData-${id}-${field.name}`)
      })
    }
  }, [findCandidate?.fields])

  const handleClickAutomations = useCallback(
    async (name: string, index: number, specificKey?: string) => {
      const automation = automations[getKey(name) as string][index]
      if (automation?.url) {
        const res = await getFilters(specificKey)
        const data = await res?.json()

        const tabId = await loadNewTabWithScript(automation?.url, automation.scripts)
        if (tabId && automation.chromeMessage) {
          await timer(5000)
          chrome.tabs.sendMessage(tabId, {
            action: automation.chromeMessage,
            filter_prompt: data.filter_prompt,
          })
        }
      }
    },
    []
  )

  const handleChangeResult = useCallback((i: number, elem: string, value: any) => {
    updateState((prev) => {
      const data = { ...prev }
      data.results[i] = { ...data.results[i], [elem]: value }
      return data
    })
  }, [])

  //   const handleClickResult = useCallback((i: number, elem: boolean, value: any) => {
  //     updateState((prev) => {
  //         const data = { ...prev }
  //         data.results[i] = { ...data.results[i], [String(elem)]: value }
  //         return data
  //     })
  // }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const performUpdates = async () => {
        try {
          await updateStatuses()
          await processQueueItem()
          await changeNames()
        } catch (error) {
          console.error('Ошибка при выполнении периодических задач:', error)
        }
      }

      performUpdates()
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  const handleChangePrompt = (e: SelectChangeEvent) => {
    setPrompValue(e.target.value)
    setPrompOptions(
      promptOptions.map((item) => {
        if (item.id === e.target.value) {
          return { ...item, active: true }
        }
        return item
      })
    )
    handleSubmit()
  }

  useEffect(() => {
    const listener = (request: any) => {
      if (request.action === 'openSelectAutomations') {
        setActiveIndex(request.index)
      }
    }

    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  const [isActive, setIsActive] = useState<boolean>(false)

  // const currentState = async () => {
  //   const state = await getState()
  //   console.log(state)
  // }

  return (
    <>
      <DialogTitle>
        <BackBtn onClick={() => navigate('/match-ai-link-analyzer')}>
          <ArrowBackIosIcon style={{ marginLeft: '9px' }} />
        </BackBtn>
        <Header parent='MatchAI LinkAnalyzer 0.5/' child={findCandidate?.name} />
      </DialogTitle>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {error && <ErrorContainer>{error}</ErrorContainer>}
        {findCandidate?.fields.map(({ name, title }, i) => {
          const state = findCandidate?.formState?.[name]
          const specificKey = state?.specific_key
          const file = state?.file
          const actions = state?.actions
          const filters = state?.filters
          const disabled = !(
            specificKey?.content &&
            findCandidate?.formState?.jobDescription.companyLinkedInUrl.status === 'success' &&
            (findCandidate?.formState?.jobDescription.hiringManagerLinkedIn?.status === 'success' ||
              !findCandidate?.formState?.jobDescription.hiringManagerLinkedIn)
          )
          const active = activeIndex === i

          return (
            <div key={i}>
              <Command onClick={() => handleActiveIndex(i)} active={active}>
                <span style={{ marginRight: 'auto' }}>{i === 0 ? title : `${i} ${title}`}</span>
                <StatusHeader key={i} icon='link' status={specificKey?.status} active={active} />
                <StatusHeader
                  key={i}
                  icon='text'
                  status={state?.customData?.status}
                  active={active}
                />
                <StatusHeader key={i} icon='file' status={file?.status} active={active} />
                {activeIndex === i ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Command>
              <Slide key={i} in={activeIndex === i} mountOnEnter unmountOnExit>
                <Paper elevation={1} square={false}>
                  {textFields[getKey(name) as string].map(
                    ({ elem, label, placeholder, title, overlay }, i) => (
                      <TextFieldData
                        key={i}
                        name={name}
                        elem={elem}
                        value={state?.[elem]?.title || state?.[elem]?.content}
                        variant='standard'
                        onChange={onChange}
                        onBlur={onBlur}
                        label={label}
                        placeholder={placeholder}
                        size='small'
                        title={title}
                        fullWidth
                        overlay={overlay}
                        status={state?.[elem]?.status}
                        handleDelete={handleDelete}
                        handleEditFrame={handleEditFrame}
                        changeEdit={changeEdit}
                      />
                    )
                  )}
                  {file?.status && (
                    <AttachFileContainer
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                    >
                      <IconButton component='label'>
                        <AttachFileIcon />
                        <VisuallyHiddenInput
                          name={name}
                          type='file'
                          accept='.pdf'
                          onChange={handleFileUpload}
                        />
                      </IconButton>
                      <Typography variant='body1' style={{ flexGrow: 1 }}>
                        {file?.name ? file?.name : 'Upload pdf file'}
                      </Typography>
                      {hover && <DeleteIcon onClick={() => handleDelete(name, 'file')} />}
                      <Status status={file?.status} />
                    </AttachFileContainer>
                  )}
                  <div style={{ display: 'flex', width: '100%', gap: 12, padding: '10px 0px' }}>
                    <SelectData name={name} handleChange={handleChangeSelectData} state={state} />
                    <SelectAutomations
                      disabled={disabled}
                      actions={actions}
                      name={name}
                      handleChange={handleChangeSelectAutomations}
                    />
                  </div>
                  {actions && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CustomTypography variant='h6'>Automations log</CustomTypography>
                        <Info style={{ color: '#9E9E9E' }} />
                      </div>
                      {automations[getKey(name) as string].map(({ value }, index) => {
                        return (
                          actions[value]?.title && (
                            <CommandAction
                              onMouseEnter={() => setHover(true)}
                              onMouseLeave={() => setHover(false)}
                              onClick={() =>
                                handleClickAutomations(name, index, specificKey?.content)
                              }
                            >
                              <Search />
                              <div
                                style={{ marginRight: 'auto', fontSize: '14px', fontWeight: 500 }}
                              >
                                {actions[value].title}
                              </div>
                              <div style={{ color: hover ? '#fff' : '#9E9E9E' }}>
                                {actions[value].date}
                              </div>
                              {hover && (
                                <DeleteIcon
                                  style={{ marginLeft: '5px' }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteAction(name, value)
                                  }}
                                />
                              )}
                            </CommandAction>
                          )
                        )
                      })}
                    </>
                  )}
                </Paper>
              </Slide>
              {actions && (
                <Command
                  style={{
                    marginTop: '8px',
                  }}
                  onClick={() => setIsActive((prev) => !prev)}
                >
                  <span>Recommended filters</span>
                  {isActive ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Command>
              )}
              {isActive && actions ? (
                actions ? (
                  filters && filters.length > 2 ? (
                    <JobFilters filters={filters} />
                  ) : filters && filters[0] === 'error' ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        padding: '25px 27px',
                        fontFamily: 'Axiforma',
                        fontSize: '16px',
                        fontWeight: '500',
                        lineHeight: '19.2px',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column',
                          paddingBottom: '12px',
                        }}
                      >
                        <ClearIcon
                          sx={{
                            color: '#790E8B',
                            width: '70px',
                            height: '70px',
                          }}
                        />
                        <span style={{ color: '#790E8B', textAlign: 'center' }}>
                          Ups... something is not right...
                        </span>
                      </Box>
                      <span
                        style={{
                          textAlign: 'center',
                          borderTop: '1px solid #00000029',
                          width: '326px',
                          paddingTop: '8px',
                        }}
                      >
                        Error logs and bug reports are submitted automatically, but you can also:
                      </span>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '12px',
                          marginTop: '12px',
                        }}
                      >
                        <Button
                          sx={{
                            borderRadius: '100px',

                            fontFamily: 'Axiforma',
                            fontSize: '14px',
                            fontWeight: '700',
                            lineHeight: '18.2px',
                            background: '#E8DEF8',
                            color: '#AB47BC',
                            '&:hover': {
                              color: 'white',
                            },
                          }}
                          variant='contained'
                        >
                          Open support case
                        </Button>
                        <Button
                          sx={{
                            borderRadius: '100px',

                            fontFamily: 'Axiforma',
                            fontSize: '14px',
                            fontWeight: '700',
                            lineHeight: '18.2px',
                          }}
                          variant='contained'
                        >
                          Retry request
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: '28px',
                        padding: '25px 0',
                        fontFamily: 'Axiforma',
                        fontSize: '16px',
                        fontWeight: '500',
                        lineHeight: '19.2px',
                      }}
                    >
                      <Spin>
                        <LogoAnimated />
                      </Spin>
                      <span>Please wait for the filter recommendations to load...</span>
                      <span>It usually takes about a minute!</span>
                    </Box>
                  )
                ) : (
                  <>Start Automation Search</>
                )
              ) : null}
              {isLast(i) && (
                <Button
                  style={{ marginTop: 8 }}
                  startIcon={<AddIcon />}
                  variant='contained'
                  onClick={handleAddCandidate}
                  size='small'
                  fullWidth
                >
                  Add candidate
                </Button>
              )}
            </div>
          )
        })}
        {findCandidate?.results.map((result, index) => (
          <Result
            propmtValue={promptValue}
            {...result}
            prompts={promptOptions}
            allResults={findCandidate?.results}
            usedPrompts={findCandidate?.prompts}
            onChange={handleChangeResult}
            // onClick={handleClickResult}
            handleSubmit={handleSubmit}
            onChangePrompt={handleChangePrompt}
            index={index}
            title={`Result ${alphabet[index]}`}
          />
        ))}
        {findCandidate?.results.length === 0 && (
          <Button
            style={{
              marginTop: 8,
              textTransform: 'none',
              gap: 2,
              backgroundColor: isDisabled ? 'rgb(224 224 224)' : '#AB47BC',
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'Axiforma',
            }}
            variant='contained'
            onClick={handleSubmit}
            disabled={isDisabled}
            size='small'
            fullWidth
          >
            Analyzing
            {!isDisabled && <FilledCoin />}
          </Button>
        )}
        {isComplete && !isPending && (
          <Button
            style={{
              marginTop: 8,
              textTransform: 'none',
              gap: 2,
              backgroundColor: '#4CAF50',
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'Axiforma',
            }}
            variant='contained'
            disabled={isDisabled}
            size='small'
            fullWidth
          >
            Complete
            <CheckCircleOutlineOutlined />
          </Button>
        )}
        {isPending && (
          <Button
            style={{
              marginTop: 8,
              textTransform: 'none',
              gap: 2,
              backgroundColor: '#4CAF50',
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'Axiforma',
            }}
            variant='contained'
            disabled={isDisabled}
            size='small'
            fullWidth
          >
            Analyzing
            <AccessTime />
          </Button>
        )}
      </div>
      {/* <button onClick={currentState}>currentState</button> */}
    </>
  )
}

export default LinkAnalyzerForm
