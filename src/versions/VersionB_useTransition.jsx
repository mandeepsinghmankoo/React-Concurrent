import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import SearchBox from '../components/SearchBox'
import ItemList from '../components/ItemList'
import { filterData } from '../utils/filterData'
import { countDOMNodes } from '../utils/measurePerformance'
import useFrameAndTaskTracker from '../hooks/useFrameAndTaskTracker'

function VersionBUseTransition({ items, searchTerm, onSearchTermChange, onPerformanceUpdate, isPending }) {
  const [localSearchTerm, setLocalSearchTerm] = useState('')
  const [deferredSearchTerm, setDeferredSearchTerm] = useState('')
  const [isPendingTransition, startTransition] = useTransition()
  const measureKeystroke = useFrameAndTaskTracker()

  const activeSearchTerm = searchTerm ?? localSearchTerm

  const filteringTimeRef = useRef(0)

  const filteredData = useMemo(() => {
    const start = window.performance.now()
    const result = filterData(items, deferredSearchTerm)
    filteringTimeRef.current = window.performance.now() - start
    return { items: result }
  }, [items, deferredSearchTerm])

  useEffect(() => {
    onPerformanceUpdate?.({
      filteringTime: filteringTimeRef.current,
      domNodeCount: countDOMNodes(),
      totalItemsRendered: filteredData.items.length,
    })
  }, [filteredData])

  const handleChange = (value) => {
    const start = performance.now()

    setLocalSearchTerm(value)
    onSearchTermChange(value)
    startTransition(() => {
      setDeferredSearchTerm(value)
    })

    measureKeystroke(start, ({ fps, longestTask, mainThreadBusyPercent }) => {
      console.log('[B] fps:', fps.toFixed(3), 'FPS')
      console.log('[B] longestTask:', longestTask.toFixed(3), 'ms')
      console.log('[B] mainThreadBusyPercent:', mainThreadBusyPercent.toFixed(3), '%')
    })

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onPerformanceUpdate?.({ inputLatency: performance.now() - start })
      })
    })
  }

  return (
    <div className="version-panel">
      <SearchBox
        value={activeSearchTerm}
        onChange={handleChange}
        resultCount={filteredData.items.length}
        isPending={isPendingTransition || isPending}
      />
      <ItemList items={filteredData.items} searchTerm={deferredSearchTerm} />
    </div>
  )
}

export default VersionBUseTransition
