import { useState, useLayoutEffect, useRef, useEffect } from 'react'
import { State } from '../chrome/types'
import { deepEqual } from '../utils/deepEqual'
import { Storage, actionsByStorage } from '../chrome/actions'

export const useAppStateSelector = <T>(
  selector: (state: State, tabId: number) => T,
  storage: Storage = 'localStorage'
) => {
  const prevState = useRef<T>(selector({}, -1))
  const [state, setState] = useState(prevState.current)
  const [tabId, setTabId] = useState(-1)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([{ id }]) => {
      setTabId(id ?? -1)
    })
  }, [])

  useLayoutEffect(() => {
    chrome.runtime.sendMessage({ action: actionsByStorage[storage].get_state }).then((r) => {
      const appState: State = r.state
      prevState.current = selector(appState, tabId)
      setState(prevState.current)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId])

  useLayoutEffect(() => {
    const listener = (request: any) => {
      if (request.action !== actionsByStorage[storage].app_state_update) return
      try {
        const appState: State = request.state
        const nextState = selector(appState, tabId)

        const isEqual = deepEqual(prevState.current, nextState)

        prevState.current = isEqual ? prevState.current : nextState
        !isEqual && setState(prevState.current)
      } catch (error) {
        console.error(error)
      }
    }

    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabId])

  return state
}
