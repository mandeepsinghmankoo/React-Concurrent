import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import SearchBox from '../components/SearchBox'
import ItemList from '../components/ItemList'
import { filterData } from '../utils/filterData'
import { countDOMNodes } from '../utils/measurePerformance'

function VersionBUseTransition({ items, searchTerm, inputStartTime, onSearchTermChange, onPerformanceUpdate, isPending }) {
  const [localSearchTerm, setLocalSearchTerm] = useState('')
  const [deferredSearchTerm, setDeferredSearchTerm] = useState('')
  const lastMeasuredInputRef = useRef(null)
  const [isPendingTransition, startTransition] = useTransition()

  const activeSearchTerm = searchTerm ?? localSearchTerm

  const filteringTimeRef = useRef(0)

  const filteredData = useMemo(() => {
    const start = window.performance.now()
    const result = filterData(items, deferredSearchTerm)
    filteringTimeRef.current = window.performance.now() - start
    console.log('[B] filteringTime:', filteringTimeRef.current.toFixed(3), 'ms')
    return { items: result }
  }, [items, deferredSearchTerm])

  useEffect(() => {
    onPerformanceUpdate?.({
      filteringTime: filteringTimeRef.current,
      domNodeCount: countDOMNodes(),
      totalItemsRendered: filteredData.items.length,
    })
  }, [filteredData])

  useEffect(() => {
    if (
      inputStartTime == null ||
      inputStartTime === lastMeasuredInputRef.current
    ) {
      return
    }
    onPerformanceUpdate?.({ updateCompletionTime: performance.now() - inputStartTime })
    lastMeasuredInputRef.current = inputStartTime
  }, [filteredData, inputStartTime])

  const handleChange = (value) => {
    const start = performance.now()

    setLocalSearchTerm(value)
    onSearchTermChange(value)
    startTransition(() => {
      setDeferredSearchTerm(value)
    })

    requestAnimationFrame(() => {
      onPerformanceUpdate?.({ inputLatency: performance.now() - start })
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
