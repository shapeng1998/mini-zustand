import { useCallback, useSyncExternalStore } from 'react'
import create from './zustand'

export const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))

export const createStore = (initialState) => {
  let state = initialState
  const getState = () => state
  const listeners = new Set()
  const setState = (fn) => {
    state = fn(state)
    listeners.forEach((l) => l())
  }
  const subscribe = (listener) => {
    listeners.add(listener)
    // unsubscribe
    return () => listeners.delete(listener)
  }
  return { getState, setState, subscribe }
}

// export const useStore = (store, selector) => {
//   const [state, setState] = useState(() => selector(store.getState()))
//   useEffect(() => {
//     const callback = () => setState(selector(store.getState()))
//     const unsubscribe = store.subscribe(callback)
//     callback()
//     return unsubscribe
//   }, [store, selector])
//   return state
// }
export const useStore = (store, selector) => {
  return useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getState()), [store, selector])
  )
}

export const countStore = createStore({ count: 0 })
