import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector'

export const createStore = (createState) => {
  let state
  const listeners = new Set()
  const setState = (partial, replace) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial
    if (!Object.is(state, nextState)) {
      const previousState = state
      state =
        replace ?? typeof nextState !== 'object'
          ? nextState
          : Object.assign({}, state, nextState)
      listeners.forEach((listener) => listener(state, previousState))
    }
  }
  const getState = () => state
  const subscribe = (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }
  const destory = () => listeners.clear()
  const api = { setState, getState, subscribe, destory }
  state = createState(setState, getState, api)
  return api
}

export const useStore = (api, selector = api.getState, equalityFn) =>
  useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getState,
    selector,
    equalityFn
  )

const create = (createState) => {
  const api =
    typeof createState === 'function' ? createStore(createState) : createState
  const useBoundStore = (selector, equalityFn) =>
    useStore(api, selector, equalityFn)
  Object.assign(useBoundStore, api)
  return useBoundStore
}

export default create
