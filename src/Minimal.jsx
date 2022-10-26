// import { useSyncExternalStore } from 'react'
import { useSyncExternalStore } from './use-sync-external-store-shim'
import { createStore } from './store'

// function useSyncExternalStore(subscribe, getSnapshot) {
//   const [state, setState] = useState(() => getSnapshot())
//   useEffect(() => {
//     const handleStoreChange = () => setState(getSnapshot())
//     handleStoreChange()
//     return subscribe(handleStoreChange)
//   }, [subscribe, getSnapshot])
//   return [state]
// }

const useAtom = (atom) => [
  useSyncExternalStore(atom.subscribe, atom.getState),
  atom.setState,
]

const countAtom = createStore(0)

function Minimal() {
  const [count, setCount] = useAtom(countAtom)
  return (
    <div>
      {count} <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  )
}

export default Minimal
