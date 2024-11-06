import { MutableRefObject, useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  FormControl,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  styled,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import EmailIcon from '@mui/icons-material/Email'
import axios from 'axios'
import { TEntity } from './model'
import { updateImport } from './index'
import { TQueueEntity } from '../../../../chrome/queue/QueueManager'
import { getToken } from '../../../../api/getToken'
import { getBaseUrl } from '../../../../api/baseUrl'
import { checkHeadFieldsCompany, checkHeadFieldsProfile, daysArray } from './checkImportArray'
import { enqueueItemNew } from '../../../../chrome/queue/newQueue/enqueueRequests'
import { processQueueManagerApollo } from '../../../../chrome/queue/newQueue/queueManager'

const SwitchContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
`

const IconTitleBox = styled('div')`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: flex-start;
`

const TitileSelect = styled('p')`
  font-family: Axiforma;
  font-size: 15px;
  font-weight: 500;
  line-height: 19.5px;
`

type Props = {
  tags: string[]
  source: string
  entity: TEntity
  timeout: MutableRefObject<NodeJS.Timeout | undefined>
  polling: (id: number) => Promise<void>
  id: number
  guid: string
  importNumber: number
}

export type Tag = {
  tag_id: number
  tag_name: string
}

export const chromeMessages: Record<string, Partial<Record<TEntity, string>>> = {
  zoominfo: {
    profile: 'parseZoomInfo',
  },
  apollo: {
    profile: 'parseContactsApollo',
    company: 'parseCompaniesApollo',
  },
}

const defaultMapper = (url: string | undefined): string | undefined => url
const mapUrlSort: (fieldToSort: string | undefined) => typeof defaultMapper =
  (fieldToSort) => (url) => {
    if (!url) return url

    const fields = [
      { regex: /sortByField=[^&]+/, replace: `sortByField=${fieldToSort}` },
      { regex: /sortAscending=[^&]+/, replace: 'sortAscending=false' },
    ]
    let mapped = url
    for (const field of fields) {
      if (mapped?.search(field.regex) !== -1) {
        mapped = mapped.replace(field.regex, field.replace)
      } else {
        mapped = mapped.concat('&', field.replace)
      }
    }
    return mapped
  }
const mapUrlTo: Record<string, Record<string, typeof defaultMapper>> = {
  zoominfo: {
    profile: defaultMapper,
  },
  apollo: {
    profile: mapUrlSort('person_name.raw'),
    company: mapUrlSort('sanitized_organization_name_unanalyzed'),
  },
}

const CreateContent = ({
  source,
  entity,
  id,
  polling,
  timeout,
}: //  guid, importNumber
Props) => {
  const [isSelectTagsVisible, setIsSelectTagsVisible] = useState(false)
  const [isSelectMailsVisible, setIsSelectMailsVisible] = useState(false)

  const [validate, setValidate] = useState<{ method: string; period: any } | null>()

  const [validateNumber, setValidateNumber] = useState<number>(0)

  const [choicesNames, setChoicesNames] = useState<string[]>([])

  const [names, setNames] = useState<Tag[]>([])

  const [newName, setNewName] = useState('')
  const minDelay = '1'
  const maxDelay = '2'

  const [see, setSee] = useState<any>()
  const [headerTexts, setHeaderTexts] = useState<[]>([])

  const [renderCreateImport, setRenderCreateImport] = useState<boolean>(false)

  const lookPage = async () => {
    try {
      const tab = await (await chrome.tabs.query({ active: true, currentWindow: true }))[0]

      if (tab.id === undefined) throw Error()

      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'parsePagesApollo',
        url: mapUrlTo[source][entity](tab.url),
      })

      if (response) {
        setSee(response.text)
        setHeaderTexts(response.formattedHeadings)
      } else {
        throw new Error('Response is undefined or null.')
      }
    } catch (error) {
      console.error('Error in lookPage:', error)
    }
  }
  const areArraysEqual = (arr1: string[], arr2: string[]) => {
    return arr1.every((element, index) => element === arr2[index])
  }

  // const areArraysEqual = (arr1: string[], arr2: string[]): boolean => {
  //   const createFrequencyMap = (array: string[]): Record<string, number> => {
  //     return array.reduce((acc, value) => {
  //       acc[value] = (acc[value] || 0) + 1
  //       return acc
  //     }, {} as Record<string, number>)
  //   }

  //   const map1 = createFrequencyMap(arr1)
  //   const map2 = createFrequencyMap(arr2)

  //   const keys1 = Object.keys(map1)
  //   const keys2 = Object.keys(map2)

  //   if (keys1.length !== keys2.length) return false

  //   for (const key of keys1) {
  //     if (map1[key] !== map2[key]) return false
  //   }

  //   return true
  // }

  useEffect(() => {
    lookPage()
  }, [])

  useEffect(() => {
    if (
      areArraysEqual(headerTexts, checkHeadFieldsProfile) ||
      areArraysEqual(headerTexts, checkHeadFieldsCompany)
    ) {
      setRenderCreateImport(true)
    }
    setTimeout(() => {
      let validate = 0
      const parts = see.split('of').map((part: any) => part.trim())

      const firstPartNumbers = parts[0]
        .split('-')
        .map((part: any) => parseInt(part.replace(/,/g, ''), 10))
      const firstNumber: any = firstPartNumbers[0] - 1
      const lastNumber = parseInt(parts[1].replace(/,/g, ''), 10)

      if (firstPartNumbers[0] === 1) {
        if (lastNumber - firstNumber >= 2500) {
          validate = 2500
        } else {
          validate = lastNumber
        }
      }
      if (lastNumber - firstNumber >= 2500) {
        validate = 2500
      } else {
        validate = lastNumber - firstNumber
      }

      setValidateNumber(validate)
      console.log(`Значение для валидации: ${validate}`)
    }, 1000)
  }, [see, headerTexts])

  const [inputValue, setInputValue] = useState('')

  const handleChangeCount = (event: any) => {
    const { value } = event.target
    const numberValue = Number(value)
    const MAX = 2500

    if ((/^\d*$/.test(value) && numberValue <= MAX) || value === '') {
      setInputValue(value)
    }
  }

  const handleClick = useCallback(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    console.log('validate', validate)
    await updateImport(id, {
      total_entities: +inputValue,
      status: 'planned',
      tag_ids: choicesNames,
      validate: !!validate,
      planned_date: new Date().toISOString(),
      current_url: mapUrlTo[source][entity](tab.url),
      count_processed: 0,
    })

    await enqueueItemNew({
      fingerprint: '1234',
      import_instance: id,
      tag_ids: choicesNames,
      validate: validate ?? undefined,
      min_delay: minDelay,
      max_delay: maxDelay,
      entity: chromeMessages[source][entity] as TQueueEntity,
      source: 'apollo',
    })

    // await enqueueItem(
    //   {
    //     url: tab.url,
    //     entity: chromeMessages[source][entity] as TQueueEntity,
    //     source: source as TQueueSource,
    //     total_entities: +inputValue,
    //     status: 'added',
    //     planned_date: new Date().toISOString(),
    //     count_processed: 0,
    //     guid,
    //     importNumber,
    //     importId: id,
    //     minDelay,
    //     maxDelay,
    //     fingerPrint: '1234',
    //     tag_ids: choicesNames,
    //     validate,
    //   },
    //   'localStorage'
    // )

    timeout.current = setTimeout(() => polling(id), 2000)
    await processQueueManagerApollo()
    // await processApolloQueueItem()
  }, [inputValue, minDelay, maxDelay, choicesNames, validate])

  async function fetchTags() {
    const token = await getToken()
    const baseUrl = await getBaseUrl()

    try {
      const response = await axios.get(`${baseUrl}/api/retrieve_tags/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setNames(response.data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message)
        if (error.response) {
          console.error('Response data:', error.response.data)
          console.error('Response status:', error.response.status)
          console.error('Response headers:', error.response.headers)
        } else if (error.request) {
          console.error('Request was made, but no response received:', error.request)
        } else {
          console.error('Error setting up request:', error.message)
        }
      } else {
        console.error('An error occurred:', error)
      }
    }
  }

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event
    setChoicesNames(typeof value === 'string' ? value.split(',') : value)
  }

  const renderValue = (selected: any) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {selected.map((selectedId: string) => {
        const selectedTag = names.find((tag: any) => tag.tag_id === selectedId) as any
        return <Chip key={selectedId} label={selectedTag ? selectedTag.tag_name : 'Unknown'} />
      })}
    </Box>
  )

  const handleNewNameChange = (event: any) => {
    setNewName(event.target.value)
  }

  const handleNewNameSubmit = async (event: any) => {
    const token = await getToken()
    const baseUrl = await getBaseUrl()

    if (event.key === 'Enter' && newName.trim() !== '') {
      const body = JSON.stringify({
        name: newName.trim(),
      })

      try {
        const response = await fetch(`${baseUrl}/api/create_tag/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body,
        })

        if (!response.ok) {
          console.error('Failed to create tag', await response.text())
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error during fetch operation: ', error.message)
        } else {
          console.error('An unknown error occurred')
        }
      }
    } else if (event.key === 'Escape') {
      setNewName('')
    }

    fetchTags()
  }
  useEffect(() => {
    fetchTags()
  }, [])

  const handleChangeZB = (event: SelectChangeEvent) => {
    setValidate({ method: 'zerobounce', period: Number(event.target.value) })
  }

  return renderCreateImport ? (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Typography
          variant='body1'
          sx={{
            fontFamily: 'Axiforma',
            fontSize: '16px',
            fontWeight: '700',
          }}
        >
          Number to import:
        </Typography>

        <TextField
          id='standard-basic'
          variant='standard'
          sx={{ maxWidth: '40px' }}
          value={inputValue}
          placeholder={String(validateNumber)}
          onChange={handleChangeCount}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Typography
          variant='body1'
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Axiforma',
            fontSize: '16px',
            fontWeight: '700',
          }}
        >
          <ErrorOutlineIcon sx={{ marginRight: '4px' }} />
          Tag all items in import
        </Typography>
        <SwitchContainer>
          <Switch
            size='small'
            onClick={() => setIsSelectTagsVisible(!isSelectTagsVisible)}
            sx={{
              '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                color: '#BDBDBD',
              },
            }}
          />
        </SwitchContainer>
      </Box>
      {isSelectTagsVisible && (
        <FormControl fullWidth>
          <Select
            variant='standard'
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            multiple
            value={choicesNames}
            onChange={handleChange}
            renderValue={renderValue}
            onKeyDownCapture={(e: any) => {
              const techKeys = ['Enter', 'Escape']
              if (!techKeys.includes(e.key)) {
                e.stopPropagation()
              }
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            {names.map((name: Tag) => (
              <MenuItem key={name.tag_id} value={name.tag_id}>
                {name.tag_name}
              </MenuItem>
            ))}
            <TextField
              sx={{
                marginLeft: '16px',
              }}
              autoFocus
              placeholder='+ Create'
              variant='standard'
              value={newName}
              onChange={handleNewNameChange}
              onKeyDown={handleNewNameSubmit}
            />
          </Select>
        </FormControl>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <Typography
          variant='body1'
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Axiforma',
            fontSize: '16px',
            fontWeight: '700',
          }}
        >
          <ErrorOutlineIcon sx={{ marginRight: '4px' }} />
          Email validation
        </Typography>
        <SwitchContainer>
          <Switch
            size='small'
            onClick={() => {
              setIsSelectMailsVisible(!isSelectMailsVisible)
              if (!isSelectMailsVisible) {
                setValidate({ method: 'zerobounce', period: 1 })
              } else {
                setValidate(null)
              }
            }}
            sx={{
              '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                color: '#BDBDBD',
              },
            }}
          />
        </SwitchContainer>
      </Box>
      {isSelectMailsVisible && (
        <Paper
          sx={{
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '5px',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '0px 8px',
              borderBottom: '1px solid #AB47BC',
              color: '#AB47BC',
            }}
          >
            <EmailIcon />
            <TitileSelect>ZeroBounce email validation</TitileSelect>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              marginTop: '14px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <IconTitleBox>
                <HelpOutlineIcon />
                <TitileSelect>Validation Expiration Period</TitileSelect>
              </IconTitleBox>
              <FormControl variant='standard' sx={{ m: 1, minWidth: 60 }}>
                <Select
                  labelId='demo-simple-select-standard-label'
                  id='demo-simple-select-standard'
                  label='Age'
                  value={String(validate?.period)}
                  onChange={handleChangeZB}
                >
                  {daysArray.map(({ value, title }) => (
                    <MenuItem value={value}>{title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <IconTitleBox>
                <HelpOutlineIcon />

                <TitileSelect>Emails to Validate per Contact</TitileSelect>
              </IconTitleBox>
              <FormControl variant='standard' sx={{ m: 1, minWidth: 60 }}>
                <Select
                  labelId='demo-simple-select-standard-label'
                  id='demo-simple-select-standard'
                >
                  <MenuItem value={10}>1</MenuItem>
                  <MenuItem value={20}>2</MenuItem>
                  <MenuItem value={30}>3</MenuItem>
                  <MenuItem value=''>All</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <IconTitleBox>
                <HelpOutlineIcon />
                <TitileSelect>Email Selection Criteria</TitileSelect>
              </IconTitleBox>

              <FormControl variant='standard' sx={{ m: 1, minWidth: 60 }}>
                <Select
                  labelId='demo-simple-select-standard-label'
                  id='demo-simple-select-standard'
                >
                  <MenuItem value={10}>Primary Email Only</MenuItem>
                  <MenuItem value={20}>Newest First</MenuItem>
                  <MenuItem value={30}>Oldest First</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Paper>
      )}
      <Button
        sx={{
          fontFamily: 'Axiforma',
          fontSize: '14px',
          fontWeight: '700',
          lineHeight: '18px',
          textAlign: 'center',
        }}
        variant='contained'
        onClick={handleClick}
      >
        Plan Import
      </Button>
    </>
  ) : (
    <>Customize the Apollo table</>
  )
}

export default CreateContent
