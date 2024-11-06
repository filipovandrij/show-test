/* eslint-disable default-case */
import { useEffect, useState } from 'react'
import { copyApolloContacts } from '../../../utils/copy/copyApolloContacts'
import { sendMessage } from '../../../utils/sendMessage'

const ms = 1000
export const useApolloContacts = () => {
  const [isRunningContactsApollo, setIsRunningContactsApollo] = useState(false)
  const [countContacts, setCountContacts] = useState(0)
  const [lastCountContacts, setLastCountContacts] = useState<number>(0)
  const [lastUniqueCountContacts, setLastUniqueCountContacts] = useState<number>(0)
  const [currentContacts, setCurrentContacts] = useState<{ [key: string]: string }[]>([])

  const collectContactsApollo = async (delay: number[]) => {
    setIsRunningContactsApollo(true)
    setLastCountContacts(0)
    setLastUniqueCountContacts(0)

    const apolloObject = await chrome.storage.local.get(['apollo_contacts'])
    const parsedInfo = await sendMessage('parseContactsApollo', {
      contacts: apolloObject.apollo_contacts || [],
      currentContacts: [],
      minDelay: delay[0] * ms,
      maxDelay: delay[1] * ms
    })

    if (parsedInfo.error) {
      setIsRunningContactsApollo(false)
      return
    }

    setCurrentContacts(parsedInfo.currentContacts)
    const { contacts } = parsedInfo

    await chrome.storage.local.set({ apollo_contacts: contacts })

    // if (!stop) {
    //     const audio = audioRef.current;
    //     setIsRunningAudio(true);
    //     audioIntervalRef.current = setInterval(() => audio?.play(), 60000);
    // }

    setIsRunningContactsApollo(false)
  }

  const copyAllContacts = async () => {
    const apolloObject = await chrome.storage.local.get(['apollo_contacts'])
    copyApolloContacts(apolloObject.apollo_contacts)
  }

  const copyCurrentContacts = () => {
    copyApolloContacts(currentContacts)
  }

  const resetContacts = async () => {
    setCountContacts(0)
    await chrome.storage.local.set({ apollo_contacts: [] })
    setCurrentContacts([])
  }

  const stopContactsParse = async () => {
    await sendMessage('stopContactsParse')
    setIsRunningContactsApollo(false)
  }

  useEffect(() => {
    chrome.storage.local.get(['apollo_contacts']).then((apolloObject) => {
      setCountContacts(apolloObject.apollo_contacts.length || 0)
    })

    chrome.runtime.onMessage.addListener((message) => {
      switch (message.action) {
        case 'lastCountContacts': {
          setLastCountContacts((prevState) => prevState + message.count)
          break
        }
        case 'uniqueCountContacts': {
          setLastUniqueCountContacts((prevState) => prevState + message.count)
          setCountContacts((prevState) => prevState + message.count)
          break
        }
      }
    })
  }, [])

  return {
    collectContactsApollo,
    stopContactsParse,
    isRunningContactsApollo,
    countContacts,
    copyCurrentContacts,
    resetContacts,
    lastCountContacts,
    lastUniqueCountContacts,
    copyAllContacts,
  }
}
