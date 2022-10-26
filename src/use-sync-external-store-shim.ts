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
