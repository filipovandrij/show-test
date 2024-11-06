import { Storage, actionsByStorage } from './actions'
import { Path, PathValue, State } from './types'

type StateKeyValueTuple = Path<State> extends infer T
  ? T extends Path<State>
    ? [T, PathValue<State, T>]
    : never
  : never

const setNestedProperty = (obj: Record<string, any>, path: string[], value: any) => {
  if (!path.length || !obj) return
  const [key, ...restPath] = path
  if (!restPath.length) {
    obj[key] = value
  } else {
    obj[key] = {}
    setNestedProperty(obj[key], restPath, value)
  }
}

export const initializeState = () => {
  let state: State = {}

  const getBgState = async () => state
  const getLocalStorageState = async (): Promise<State> =>
    (await chrome.storage.local.get('state')).state || {}

  const getState = async (storage: Storage = 'localStorage') =>
    ({
      localStorage: getLocalStorageState,
      bg: getBgState,
    }[storage]())
  const setBgState = async <T extends State | StateKeyValueTuple[] | ((prevState: State) => State)>(
    nextState: T
  ) => {
    Array.isArray(nextState)
      ? nextState.forEach(([path, value]) => setNestedProperty(state, path.split('.'), value))
      : (() => {
          state = typeof nextState === 'function' ? nextState(state) : nextState
        })()
    const r = await getState('bg')

    chrome.tabs.query({}, (tabs) =>
      tabs.forEach(
        (tab) =>
          tab.id &&
          chrome.tabs.sendMessage(tab.id, {
            action: actionsByStorage.bg.app_state_update,
            state: r,
          })
      )
    )
  }

  const setLocalStorageState = async <
    T extends State | StateKeyValueTuple[] | ((prevState: State) => State)
  >(
    nextState: T
  ) => {
    let state = await getState()

    // updateCandidateStatus()
    Array.isArray(nextState)
      ? nextState.forEach(([path, value]) => setNestedProperty(state, path.split('.'), value))
      : (() => {
          state = typeof nextState === 'function' ? nextState(state) : nextState
        })()
    await chrome.storage.local.set({ state })

    chrome.tabs.query({}, (tabs) =>
      tabs.forEach(
        (tab) =>
          tab.id &&
          chrome.tabs.sendMessage(tab.id, {
            action: actionsByStorage.localStorage.app_state_update,
            state,
          })
      )
    )
    return state
  }

  const setState = async <T extends State | StateKeyValueTuple[] | ((prevState: State) => State)>(
    nextState: T,
    storage: Storage = 'localStorage'
  ) =>
    ({
      localStorage: setLocalStorageState,
      bg: setBgState,
    }[storage](nextState))

  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (
      request.action === actionsByStorage.bg.get_state ||
      request.action === actionsByStorage.localStorage.get_state
    ) {
      getState(request.action === actionsByStorage.bg.get_state ? 'bg' : 'localStorage').then(
        (state) => {
          sendResponse({ state })
        }
      )

      return true
    }
  })

  return { setState, getState }
}

export const { getState, setState } = initializeState()
