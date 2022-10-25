import { useCallback } from 'react'
import Minimal from './Minimal'
import { countStore, useBearStore, useStore } from './store'

function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} around here ...</h1>
}

function Controls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}

function Count() {
  const count = useStore(
    countStore,
    useCallback((state) => state.count, [])
  )
  const inc = () => {
    countStore.setState((prev) => ({ ...prev, count: prev.count + 1 }))
  }
  return (
    <div>
      {count} <button onClick={inc}>+1</button>
    </div>
  )
}

function App() {
  return (
    <>
      <BearCounter />
      <Controls />
      <Count />
      <Minimal />
    </>
  )
}

export default App
