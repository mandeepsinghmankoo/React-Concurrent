import { useEffect, useMemo, useRef, useState } from 'react'
import SearchBox from '../components/SearchBox'
import ItemList from '../components/ItemList'
import { filterData } from '../utils/filterData'
import { countDOMNodes } from '../utils/measurePerformance'

function VersionATraditional({ items, searchTerm, inputStartTime, onSearchTermChange, onPerformanceUpdate, isPending }) {
  const [localSearchTerm, setLocalSearchTerm] = useState('')
  const lastMeasuredInputRef = useRef(null)

  const activeSearchTerm = searchTerm ?? localSearchTerm
  const filteredData = useMemo(() => {
    const start = window.performance.now()
    const result = filterData(items, activeSearchTerm)
    const filteringTime = window.performance.now() - start
    console.log('[A] filteringTime:', filteringTime.toFixed(3), 'ms')
    return { items: result, filteringTime }
  }, [items, activeSearchTerm])

  useEffect(() => {
    onPerformanceUpdate?.({
      filteringTime: filteredData.filteringTime,
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
        isPending={isPending}
      />
      <ItemList items={filteredData.items} searchTerm={activeSearchTerm} />
    </div>
  )
}

export default VersionATraditional
