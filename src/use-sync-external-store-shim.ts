import { useEffect, useLayoutEffect, useState } from 'react'

export function useSyncExternalStore<Snapshot>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getServerSnapshot?: () => Snapshot
): Snapshot {
  const value = getSnapshot()
  const [{ inst }, forceUpdate] = useState({ inst: { value, getSnapshot } })

  useLayoutEffect(() => {
    inst.value = value
    inst.getSnapshot = getSnapshot

    if (checkIfSnapshotChanged(inst)) {
      forceUpdate({ inst })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe, value, getSnapshot])

  useEffect(() => {
    if (checkIfSnapshotChanged(inst)) {
      forceUpdate({ inst })
    }
    const handleStoreChange = () => {
      if (checkIfSnapshotChanged(inst)) {
        forceUpdate({ inst })
      }
    }
    return subscribe(handleStoreChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribe])

  return value
}

function checkIfSnapshotChanged<Snapshot>(inst: {
  value: Snapshot
  getSnapshot: () => Snapshot
}): boolean {
  const latestGetSnapshot = inst.getSnapshot
  const prevValue = inst.value
  try {
    const nextValue = latestGetSnapshot()
    return !Object.is(prevValue, nextValue)
  } catch (error) {
    return true
  }
}

export const createStore = <Snapshot>(initialState: Snapshot) => {
  let state = initialState
  const listeners = new Set<() => void>()
  const getState = () => state
  const setState = (fn: (prevState: Snapshot) => Snapshot) => {
    const nextState = fn(state)
    if (!Object.is(state, nextState)) {
      state = nextState
      listeners.forEach((l) => l())
    }
  }
  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }
  return { getState, setState, subscribe }
}

export const useStore = <Snapshot>(
  store: ReturnType<typeof createStore<Snapshot>>
) =>
  [
    useSyncExternalStore(store.subscribe, store.getState),
    store.setState,
  ] as const
