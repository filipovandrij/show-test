import { FC, useCallback, useEffect, useState } from 'react'

export const withAvailableInUrl = ({ url }: { url: string }) => {
  const regexp = new RegExp(url, 'u')
  const checkIsAvailable = (url: string) => regexp.test(url)
  return <T extends {}>(Component: FC<T & { url: string }>) =>
    (props: T) => {
      const [isAvailable, setIsAvailable] = useState(false)
      const [currentUrl, setCurrentUrl] = useState('')

      const listener = useCallback(({ currentUrl }: { currentUrl?: string }) => {
        currentUrl && setCurrentUrl(currentUrl)
        currentUrl && setIsAvailable(checkIsAvailable(decodeURIComponent(currentUrl)))
      }, [])

      useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
          tab.id &&
            chrome.tabs
              .sendMessage(tab.id, {
                action: 'checkUrl',
              })
              .then(({ url }) => {
                setCurrentUrl(url)
                setIsAvailable(checkIsAvailable(decodeURIComponent(url)))
              })
        })
      }, [])

      useEffect(() => {
        chrome.runtime.onMessage.addListener(listener)
        return () => chrome.runtime.onMessage.removeListener(listener)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      return isAvailable ? <Component {...props} url={currentUrl} /> : null
    }
}
