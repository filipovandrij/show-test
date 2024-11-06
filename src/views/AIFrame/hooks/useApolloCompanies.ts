/* eslint-disable default-case */
import { useEffect, useState } from 'react'
import { sendMessage } from '../../../utils/sendMessage'
import { copyApolloCompanies } from '../../../utils/copy/copyApolloCompanies'
const ms = 1000

export const useApolloCompanies = () => {
  const [isRunningCompaniesApollo, setIsRunningCompaniesApollo] = useState(false)
  const [countCompanies, setCountCompanies] = useState(0)
  const [lastCountCompanies, setLastCountCompanies] = useState<number>(0)
  const [lastUniqueCountCompanies, setLastUniqueCountCompanies] = useState<number>(0)
  const [currentCompanies, setCurrentCompanies] = useState<{ [key: string]: string }[]>([])

  const collectCompaniesApollo = async (delay: number[]) => {
    setIsRunningCompaniesApollo(true)
    setLastCountCompanies(0)
    setLastUniqueCountCompanies(0)

    const apolloObject = await chrome.storage.local.get(['apollo_companies'])
    const parsedInfo = await sendMessage('parseCompaniesApollo', {
      companies: apolloObject.apollo_companies || [],
      currentCompanies: [],
      minDelay: delay[0]*ms,
      maxDelay: delay[1]*ms
    })

    if (parsedInfo.error) {
      setIsRunningCompaniesApollo(false)
      return
    }

    setCurrentCompanies(parsedInfo.currentCompanies)
    const { companies } = parsedInfo

    await chrome.storage.local.set({ apollo_companies: companies })

    // if (!stop) {
    //     const audio = audioRef.current;
    //     setIsRunningAudio(true);
    //     audioIntervalRef.current = setInterval(() => audio?.play(), 60000);
    // }

    setIsRunningCompaniesApollo(false)
  }

  const copyAllCompanies = async () => {
    const apolloObject = await chrome.storage.local.get(['apollo_companies'])
    copyApolloCompanies(apolloObject.apollo_companies)
  }

  const copyCurrentCompanies = async () => {
    copyApolloCompanies(currentCompanies)
  }

  const resetCurrentCompanies = async () => {
    setCountCompanies(0)
    await chrome.storage.local.set({ apollo_companies: [] })
    setCurrentCompanies([])
  }

  const stopCompaniesParse = async () => {
    await sendMessage('stopCompaniesParse')
    setIsRunningCompaniesApollo(false)
  }

  useEffect(() => {
    chrome.storage.local.get(['apollo_companies']).then((apolloObject) => {
      setCountCompanies(apolloObject.apollo_companies.length || 0)
    })

    chrome.runtime.onMessage.addListener((message) => {
      switch (message.action) {
        case 'lastCountCompanies': {
          setLastCountCompanies((prevState) => prevState + message.count)
          break
        }
        case 'uniqueCountCompanies': {
          setLastUniqueCountCompanies((prevState) => prevState + message.count)
          setCountCompanies((prevState) => prevState + message.count)
          break
        }
      }
    })
  }, [])

  return {
    collectCompaniesApollo,
    isRunningCompaniesApollo,
    countCompanies,
    stopCompaniesParse,
    copyCurrentCompanies,
    copyAllCompanies,
    resetCurrentCompanies,
    lastCountCompanies,
    lastUniqueCountCompanies,
  }
}
