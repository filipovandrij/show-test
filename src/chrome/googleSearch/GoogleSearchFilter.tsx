import { useCallback, useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { Button, Typography } from '@mui/material'
import Logo from '../../components/Icons/Logo'
import FilterList from '../../components/ContentFilter/FilterList'
import { Preloader } from '../../components/Preloader'
import { getFilter } from '../linkedinSearch/LinkedinSearchFilter'

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.15);
  width: 250px;
  gap: 16px;
`

// eslint-disable-next-line no-unused-vars
const Command = styled(Button)<{
  active?: boolean
}>`
  min-height: 40px;
  background-color: #ebebeb;
  position: relative;
  border-radius: 4px;
  width: 100%;
  text-transform: none;
  color: #212121;
  display: flex;
  justify-content: space-between;
  padding: 8px;

  svg {
    color: #212121;
  }

  :hover {
    color: #fff;
    background-color: #ab47bc;

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

const GoogleSearchFilter = () => {
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState([])
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

      setFilters(data)
      setLoading(false)
    } else {
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
  // 	window.location.href = `https://www.google.ru/search?q=${value}`
  // }, [])

  if (loading) {
    return (
      <Container>
        <Preloader />
      </Container>
    )
  }

  if (error) {
    return <Container>{error}</Container>
  }

  return (
    <Container>
      <Logo />
      {/* <Typography variant="h5" textAlign="center">Query params to find candidates</Typography> */}
      {/* <QueryList queries={queries} onClick={handleClick}/> */}
      {/* <Command onClick={handleClickQuery} active={activeSecondaryQuery}> */}
      {/*	Secondary Filters */}
      {/*	{activeSecondaryQuery ? <ExpandLessIcon/> : <ExpandMoreIcon/>} */}
      {/* </Command> */}
      {/* {activeSecondaryQuery && <QueryList queries={queries} onClick={handleClick}/>} */}

      <Typography variant='h5' textAlign='center'>
        Filter recommendations to find candidates
      </Typography>
      <FilterList filters={filters} />
      {/* <Command onClick={handleClickFilter} active={activeSecondaryFilter}> */}
      {/*	Secondary Filters */}
      {/*	{activeSecondaryFilter ? <ExpandLessIcon/> : <ExpandMoreIcon/>} */}
      {/* </Command> */}
      {/* {activeSecondaryFilter && <FilterList filters={filters}/>} */}
    </Container>
  )
}

export default GoogleSearchFilter
