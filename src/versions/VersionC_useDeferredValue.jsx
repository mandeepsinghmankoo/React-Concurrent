import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import SearchBox from '../components/SearchBox'
import ItemList from '../components/ItemList'
import { filterData } from '../utils/filterData'
import { countDOMNodes } from '../utils/measurePerformance'
import useFrameAndTaskTracker from '../hooks/useFrameAndTaskTracker'

function VersionCUseDeferredValue({ items, searchTerm, onSearchTermChange, onPerformanceUpdate, isPending }) {
  const [localSearchTerm, setLocalSearchTerm] = useState('')
  const measureKeystroke = useFrameAndTaskTracker()
  const activeSearchTerm = searchTerm ?? localSearchTerm
  const deferredSearchTerm = useDeferredValue(activeSearchTerm)

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

    measureKeystroke(start, ({ fps, longestTask, mainThreadBusyPercent }) => {
      console.log('[C] fps:', fps.toFixed(3), 'FPS')
      console.log('[C] longestTask:', longestTask.toFixed(3), 'ms')
      console.log('[C] mainThreadBusyPercent:', mainThreadBusyPercent.toFixed(3), '%')
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
        isPending={isPending}
      />
      <ItemList items={filteredData.items} searchTerm={deferredSearchTerm} />
    </div>
  )
}

export default VersionCUseDeferredValue
