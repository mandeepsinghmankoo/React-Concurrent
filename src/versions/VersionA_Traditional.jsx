import { useEffect, useMemo, useState } from 'react'
import SearchBox from '../components/SearchBox'
import ItemList from '../components/ItemList'
import { filterData } from '../utils/filterData'
import { countDOMNodes } from '../utils/measurePerformance'
import useFrameAndTaskTracker from '../hooks/useFrameAndTaskTracker'

function VersionATraditional({ items, searchTerm, onSearchTermChange, onPerformanceUpdate, isPending }) {
  const [localSearchTerm, setLocalSearchTerm] = useState('')
  const measureKeystroke = useFrameAndTaskTracker()

  const activeSearchTerm = searchTerm ?? localSearchTerm
  const filteredData = useMemo(() => {
    const start = window.performance.now()
    const result = filterData(items, activeSearchTerm)
    const filteringTime = window.performance.now() - start
    return { items: result, filteringTime }
  }, [items, activeSearchTerm])

  useEffect(() => {
    onPerformanceUpdate?.({
      filteringTime: filteredData.filteringTime,
      domNodeCount: countDOMNodes(),
      totalItemsRendered: filteredData.items.length,
    })
  }, [filteredData])

  const handleChange = (value) => {
    const start = performance.now()

    setLocalSearchTerm(value)
    onSearchTermChange(value)

    measureKeystroke(start, ({ fps, longestTask, mainThreadBusyPercent }) => {
      console.log('[A] fps:', fps.toFixed(3), 'FPS')
      console.log('[A] longestTask:', longestTask.toFixed(3), 'ms')
      console.log('[A] mainThreadBusyPercent:', mainThreadBusyPercent.toFixed(3), '%')
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
      <ItemList items={filteredData.items} searchTerm={activeSearchTerm} />
    </div>
  )
}

export default VersionATraditional
