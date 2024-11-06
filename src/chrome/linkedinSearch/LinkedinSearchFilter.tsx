import { useCallback, useEffect, useState } from 'react'
import { getToken } from '../../api/getToken'
import { getBaseUrl } from '../../api/baseUrl'
import { getState, setState } from '../state'

export const getFilter = async (filter_prompt: number) => {
  const token = await getToken()
  const baseUrl = await getBaseUrl()
  if (token) {
    return fetch(`${baseUrl}/api/prompt-manager/filters/?filter_prompt=${filter_prompt}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  }
}

type Thought = {
  stepNumber: number
  description: string
  findings: string
  implications: string
}

export type TFilter = {
  filterId: string
  Thoughts: Thought[]
  FinalConclusions: string
  FilterParameters: string[]
  QueryParameters: string[]
  Type: string
}

const LinkedinSearchFilter = () => {
  // eslint-disable-next-line no-unused-vars
  const [loadingText, setLoadingText] = useState('')

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoadingText((prev) => {
        const dotsCount = (prev.match(/\./g) || []).length
        if (dotsCount >= 3) {
          return ''
        }
        return `${prev}.`
      })
    }, 500)

    return () => clearInterval(intervalId)
  }, [])

  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<TFilter[] | string[]>([])
  const [filterUrl, setFilterUrl] = useState<string>()
  const [error, setError] = useState('')

  const polling = useCallback(async (filter_prompt: number) => {
    const res = await getFilter(filter_prompt)
    const statusCode = res?.status

    if (statusCode === 304) {
      setTimeout(() => polling(filter_prompt), 10000)
      return
    }

    if (statusCode === 200) {
      const data = await res?.json()

      setFilters(data.filters)
      setFilterUrl(data.hui)

      setLoading(false)
    } else {
      setFilters(['error'])
      setError('Sorry, there was an error')
      setLoading(false)
    }
  }, [])

  const listener = useCallback(async (request: any) => {
    if (request.action === 'getFilters') {
      setTimeout(() => polling(request.filter_prompt), 10000)
    }
  }, [])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  // const [activeSecondaryFilter, setActiveSecondaryFilter] = useState(false)
  // const [activeSecondaryQuery, setActiveSecondaryQuery] = useState(false)
  //
  // const handleClickFilter = useCallback(() => {
  // 	setActiveSecondaryFilter(prev => !prev)
  // }, [])
  //
  // const handleClickQuery = useCallback(() => {
  // 	setActiveSecondaryQuery(prev => !prev)
  // }, [])
  //
  // const handleClick = useCallback((value: string) => {
  // 	const input = document.querySelector('.search-global-typeahead__input') as HTMLInputElement
  // 	input.dispatchEvent(new Event('focus', { bubbles: true }))
  // 	input.value = value
  // 	input.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Enter' }))
  // }, [])

  async function addFiltersToCase(storage: any = 'localStorage') {
    const localState = await getState(storage)

    if (localState.linkAnalyzer) {
      localState.linkAnalyzer.forEach((item: any) => {
        if (item.formState.jobDescription.specific_key.content === filterUrl)
          item.formState.jobDescription.filters = filters
      })
    }

    await setState(localState, storage)
  }

  useEffect(() => {
    const execute = async () => {
      await addFiltersToCase()
    }
    execute()
  }, [filters])
  if (loading) {
    return (
      // <Box
      //   sx={{
      //     display: 'flex',
      //     alignItems: 'center',
      //     justifyContent: 'start',
      //     padding: '16px',
      //     borderRadius: '8px',
      //     background: '#fff',
      //     boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.15)',
      //     width: '250px',
      //   }}
      // >
      //   <div>Waiting for AI response</div>
      //   <div>{loadingText}</div>
      // </Box>
      null
    )
  }

  if (error) {
    return null
  }

  return (
    // <Container>
    //   <Logo />
    // </Container>

    null
  )
}

export default LinkedinSearchFilter
