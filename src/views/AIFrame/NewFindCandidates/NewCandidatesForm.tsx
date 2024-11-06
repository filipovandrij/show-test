import React, { useCallback, useContext, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper as MUIPaper,
  Select,
  SelectChangeEvent,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { LoadingButton } from '@mui/lab'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import DoneIcon from '@mui/icons-material/Done'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate, useParams } from 'react-router-dom'
import { loadNewTab } from '../../../utils/newTab'
import api from '../../../api'
import { AppContext } from '../../../app/appContext'
import { getToken } from '../../../api/getToken'
import { getBaseUrl } from '../../../api/baseUrl'
import { AnalyzeData, FindCandidates } from '../../../chrome/findCandidatesState'
import Status from './Status'
import { sendCreateFrameAction } from '../../../utils/frames/sendCreateFrameAction'
import { sendDestroyFrameAction } from '../../../utils/frames/sendDestroyFrameAction'
import { timer } from '../../../utils/timer'
import { useAppStateSelector } from '../../../hooks/useAppStateSelector'
import { updateFindCandidates } from './History'
import { deepEqual } from '../../../utils/deepEqual'

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

const Paper = styled(MUIPaper)`
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  background-color: #ebebeb;

  svg {
    color: #757575;
    cursor: pointer;

    &:hover {
      color: #ab47bc;
    }
  }

  input {
    background-color: white;
  }
`

const Command = styled(Button)<{
  active?: boolean
}>`
  background-color: #ebebeb;
  position: relative;
  border-radius: 4px;
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

const analyzeCandidates = async (
  vacancy: Partial<Record<keyof AnalyzeData, string>>,
  candidates: Record<keyof AnalyzeData, string | undefined>[],
  prompt: string
) => {
  const token = await getToken()
  return fetch(`${await getBaseUrl()}/api/complex-analysis/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ vacancy, candidates, prompt }),
  })
}

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

const analyzeCredits = async (obj: Record<string, string>) => {
  const token = await getToken()
  return fetch(`${await getBaseUrl()}/api/complex-analysis/`, {
    method: 'PUT',
    headers: {
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

const options = [
  { value: 'specific_key', title: 'Paste link', content: 'Linkedin Link' },
  {
    value: 'description',
    title: 'Paste description as freeform text',
    content: 'Text Description',
  },
  { value: 'text', title: 'Provide additional info', content: 'Additional info' },
  { value: 'file', title: 'Choose a PDF file', content: 'PDF File' },
]

type QueryParams = {
  id: string
}

const NewCandidatesForm = () => {
  const { id } = useParams<QueryParams>() as QueryParams
  const navigate = useNavigate()
  const findCandidatesListFromBg = useAppStateSelector(
    (state) => state?.findCandidates as FindCandidates[]
  )
  const [findCandidatesList, setFindCandidatesList] =
    useState<FindCandidates[]>(findCandidatesListFromBg)
  const [findCandidate, setFindCandidate] = useState<FindCandidates>(
    findCandidatesListFromBg?.[+id] as FindCandidates
  )
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const isDisabled =
    findCandidate?.fields.length < 4 ||
    findCandidate?.fields.slice(0, 4).some(({ name }) => {
      const state = findCandidate?.formState?.[name]
      return !(
        state?.specific_key?.content ||
        state?.file?.content ||
        state?.text?.content ||
        state?.description?.content
      )
    })
  const [isPending, setIsPending] = useState(false)
  const [name, setName] = useState(findCandidate?.name || '')
  const [isEditingName, setIsEditingName] = useState(false)
  const [error, setError] = useState('')
  const { setBalance } = useContext(AppContext)

  useEffect(() => {
    if (findCandidatesListFromBg && !deepEqual(findCandidatesList, findCandidatesListFromBg)) {
      setFindCandidatesList(findCandidatesListFromBg)
      const findCandidateFromBg = findCandidatesListFromBg[+id]
      if (!deepEqual(findCandidate, findCandidateFromBg)) {
        setFindCandidate(findCandidateFromBg)
        setName(findCandidateFromBg.name)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findCandidatesListFromBg])

  const updateFindCandidatesList = useCallback((i: number, value: FindCandidates) => {
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
              [elem]: { ...prev.formState?.[name][elem as keyof AnalyzeData], status: 'sending' },
            },
          },
        }))

        const res = await analyzeCredits({ [elem]: value })

        updateState((prev) => ({
          ...prev,
          formState: {
            ...prev.formState,
            [name]: {
              ...prev.formState?.[name],
              [elem]: {
                ...prev.formState?.[name][elem as keyof AnalyzeData],
                status: res.ok ? 'confirmed' : 'error',
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
          placeholder: 'Enter the link to the LinkedIn candidate profile',
          title: `Candidate ${prev.fields.length}`,
          label: 'Link to linkedin candidate profile',
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

  const handleSubmit = useCallback(async () => {
    setError('')
    setIsPending(true)

    const formState = findCandidate.formState
    const fields = findCandidate.fields

    const r = await api.getGsheetsUrl()
    const urls = await r.json()
    await loadNewTab(urls.message.Job_analysis)

    const res = await analyzeCandidates(
      {
        specific_key: formState?.jobDescription.specific_key?.content,
        description: formState?.jobDescription.description?.content,
        text: formState?.jobDescription.text?.content,
        file: formState?.jobDescription?.file?.content,
      },
      fields
        .slice(1)
        .filter(({ name }) => !!formState?.[name])
        .map(({ name }) => ({
          specific_key: formState?.[name].specific_key?.content,
          description: formState?.[name].description?.content,
          text: formState?.[name].text?.content,
          file: formState?.[name]?.file?.content,
        })),
      'JobAIDE-0.1'
    )

    setIsPending(false)
    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      return
    }

    updateState((prev) => ({
      ...prev,
      lastExecution: Date.now(),
    }))
    setBalance(data.message.credits)
  }, [findCandidate?.fields, findCandidate?.formState])

  const handleChangeSelect = useCallback(
    (event: SelectChangeEvent, name: string) => {
      const { value } = event.target
      const titles: Record<string, string> = {
        description: 'Text description',
        text: 'Additional info',
      }

      updateState((prev) => ({
        ...prev,
        formState: {
          ...prev.formState,
          [name]: {
            ...prev.formState?.[name],
            [value]: { status: 'visible', title: titles[value] },
          },
        },
      }))

      if (value === 'text' || value === 'description') {
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
        timer(1000).then(() =>
          chrome.runtime.sendMessage({
            action: 'get_data_editing',
            title: titles[value],
            content: '',
          })
        )
      }
    },
    [id]
  )

  const handleEdit = useCallback(
    (elem: 'text' | 'description', name: string) => {
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
          title: findCandidate?.formState?.[name]?.[elem]?.title,
          content: findCandidate?.formState?.[name]?.[elem]?.content,
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

  useEffect(() => {
    chrome.runtime.onMessage.addListener(async (request) => {
      if (request.action === 'update_find_candidates_editing') {
        const { name } = request.value
        const { elem } = request.value
        const { content } = request.value

        updateState((prev) => ({
          ...prev,
          formState: {
            ...prev.formState,
            [name]: {
              ...prev.formState?.[name],
              [elem]: {
                ...prev.formState?.[name][elem as keyof AnalyzeData],
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
                ...prev.formState?.[name][elem as keyof AnalyzeData],
                title: request.value.title,
                content: request.value.content,
                status: res.ok ? 'confirmed' : 'error',
              },
            },
          },
        }))
      }
    })
  }, [])

  useEffect(() => {
    return () => {
      findCandidate?.fields?.forEach((field) => {
        sendDestroyFrameAction(`text-${id}-${field.name}`)
        sendDestroyFrameAction(`description-${id}-${field.name}`)
      })
    }
  }, [findCandidate?.fields])

  const handleSaveName = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      name,
    }))
    setIsEditingName(false)
  }, [name])

  return (
    <>
      <DialogTitle>
        <BackBtn onClick={() => navigate('/recruit-ai-multi-source')}>
          <ArrowBackIosIcon style={{ marginLeft: '9px' }} />
        </BackBtn>
        {isEditingName ? (
          <>
            <TextField
              value={name}
              variant='outlined'
              onChange={(e) => setName(e.target.value)}
              label='Name'
              size='small'
            />
            <DoneIcon className='doneIcon' onClick={handleSaveName} />
          </>
        ) : (
          <>
            {name}
            <EditIcon className='editIcon' onClick={() => setIsEditingName((prev) => !prev)} />
          </>
        )}
      </DialogTitle>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {error && <ErrorContainer>{error}</ErrorContainer>}
        {findCandidate?.fields.map(({ name, placeholder, title, label }, i) => {
          const state = findCandidate.formState?.[name]
          const specificKey = state?.specific_key
          const description = state?.description
          const text = state?.text
          const file = state?.file

          return (
            <div key={i}>
              <Command onClick={() => handleActiveIndex(i)} active={activeIndex === i}>
                {title}
                {activeIndex === i ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Command>
              <Slide
                direction='left'
                in={activeIndex === i}
                timeout={300}
                style={{ transitionDelay: '300ms' }}
                mountOnEnter
                unmountOnExit
              >
                <Paper elevation={1} square={false}>
                  {specificKey?.status && (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 10 }}>
                      <TextField
                        name={`${name}.specific_key`}
                        value={specificKey?.content}
                        variant='outlined'
                        onChange={onChange}
                        onBlur={onBlur}
                        label={label}
                        placeholder={placeholder}
                        size='small'
                        title='Paste links to the LinkedIn in the provided fields to ensure a deeper exploration of their professional experiences'
                        fullWidth
                      />
                      <Status status={specificKey?.status} />
                      <DeleteIcon onClick={() => handleDelete(name, 'specific_key')} />
                    </div>
                  )}
                  {description?.status && (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 10 }}>
                      <TextField
                        value={description?.title}
                        disabled
                        variant='outlined'
                        placeholder='Enter a title'
                        size='small'
                        fullWidth
                        title='This field is designed to provide a brief summary of general information. Enter here brief information that may be useful for the evaluation.'
                      />
                      <Status status={description?.status} />
                      <EditIcon onClick={() => handleEdit('description', name)} />
                      <DeleteIcon onClick={() => handleDelete(name, 'description')} />
                    </div>
                  )}
                  {text?.status && (
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 10 }}>
                      <TextField
                        value={text?.title}
                        disabled
                        variant='outlined'
                        placeholder='Enter a title'
                        size='small'
                        fullWidth
                        title='This information is not required, but can greatly enrich our understanding . Please provide any additional information you feel is important to us.'
                      />
                      <Status status={text?.status} />
                      <EditIcon onClick={() => handleEdit('text', name)} />
                      <DeleteIcon
                        style={{ marginLeft: 'auto' }}
                        onClick={() => handleDelete(name, 'text')}
                      />
                    </div>
                  )}
                  {file?.status && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
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
                        {file?.name}
                      </Typography>
                      <Status status={file?.status} />
                      {file?.name && <DeleteIcon onClick={() => handleDelete(name, 'file')} />}
                    </div>
                  )}
                  <FormControl fullWidth>
                    <InputLabel id={`select-label-${name}`}>Select a field type</InputLabel>
                    <Select
                      labelId={`select-label-${name}`}
                      id={`select-${name}`}
                      value=''
                      label='Select a field type'
                      onChange={(e) => handleChangeSelect(e, name)}
                    >
                      {options.map(({ value, title, content }) => (
                        <MenuItem
                          value={value}
                          disabled={!!state?.[value as keyof AnalyzeData]?.status}
                        >
                          <Tooltip title={title}>
                            <div style={{ width: '100%' }}>{content}</div>
                          </Tooltip>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>
              </Slide>
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
        <LoadingButton
          style={{ marginTop: 8 }}
          variant='contained'
          onClick={handleSubmit}
          disabled={isDisabled}
          loading={isPending}
          size='small'
          fullWidth
        >
          analyze
        </LoadingButton>
      </div>
    </>
  )
}

export default NewCandidatesForm
