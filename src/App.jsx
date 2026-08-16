import { useCallback, useEffect, useMemo, useState } from 'react'
import VersionSelector from './components/VersionSelector'
import PerformanceMetrics from './components/PerformanceMetrics'
import VersionATraditional from './versions/VersionA_Traditional'
import VersionBUseTransition from './versions/VersionB_useTransition'
import VersionCUseDeferredValue from './versions/VersionC_useDeferredValue'
import { calculateStats } from './utils/measurePerformance'
import generateData from './utils/generateData'

const versionComponents = {
  A: VersionATraditional,
  B: VersionBUseTransition,
  C: VersionCUseDeferredValue,
}

function App() {
  const [version, setVersion] = useState('A')
  const [datasetSize, setDatasetSize] = useState(1000)
  const [searchTerm, setSearchTerm] = useState('')
  const [items, setItems] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [metrics, setMetrics] = useState({
    filteringTime: 0,
    inputLatency: 0,
    domNodeCount: 0,
    totalItemsRendered: 0,
  })
  const [measurements, setMeasurements] = useState([])
  const [interactionCount, setInteractionCount] = useState(0)

  useEffect(() => {
    let isCancelled = false
    setIsLoadingData(true)

    const loaders = import.meta.glob('./data/*.json', { eager: false })
    const loader = loaders[`./data/data_${datasetSize}.json`]

    if (!loader) {
      const generatedItems = generateData(datasetSize)
      if (!isCancelled) {
        setItems(generatedItems)
        setIsLoadingData(false)
      }
      return () => {
        isCancelled = true
      }
    }

    loader()
      .then((module) => {
        if (!isCancelled) {
          setItems(module.default)
          setIsLoadingData(false)
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setItems(generateData(datasetSize))
          setIsLoadingData(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [datasetSize])

  const handleSearchTermChange = (value) => {
    setSearchTerm(value)
    setInteractionCount((count) => count + 1)
  }

  const handlePerformanceUpdate = useCallback((nextMetrics) => {
    setMetrics((current) => ({ ...current, ...nextMetrics }))
    setMeasurements((current) => {
      const lastEntry = current[current.length - 1]
      const entry = {
        version,
        datasetSize,
        filteringTime: nextMetrics.filteringTime ?? lastEntry?.filteringTime ?? 0,
        inputLatency: nextMetrics.inputLatency ?? lastEntry?.inputLatency ?? 0,
        domNodeCount: nextMetrics.domNodeCount ?? lastEntry?.domNodeCount ?? 0,
        totalItemsRendered: nextMetrics.totalItemsRendered ?? lastEntry?.totalItemsRendered ?? 0,
      }
      return [...current, entry].slice(-20)
    })
  }, [version, datasetSize])

  const handleReset = () => {
    setMeasurements([])
    setInteractionCount(0)
    setMetrics({
      filteringTime: 0,
      inputLatency: 0,
      domNodeCount: 0,
      totalItemsRendered: 0,
    })
  }

  const handleExport = () => {
    const payload = {
      version,
      datasetSize,
      measurements,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `performance-${version}-${datasetSize}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const stats = useMemo(() => ({
    filter: calculateStats(measurements.map((entry) => entry.filteringTime)),
    inputLatency: calculateStats(measurements.map((entry) => entry.inputLatency)),
    nodes: calculateStats(measurements.map((entry) => entry.domNodeCount)),
  }), [measurements])

  const CurrentVersion = versionComponents[version]

  return (
    <div className="app-shell">
      <header className="hero-panel">
        <div>
          <p className="section-eyebrow">Performance experiment</p>
          <h1>React rendering strategies at a glance</h1>
          <p className="hero-copy">
            Compare the responsiveness of traditional rendering, useTransition, and useDeferredValue on high-volume product lists.
          </p>
        </div>
        <VersionSelector
          version={version}
          onVersionChange={setVersion}
          datasetSize={datasetSize}
          onDatasetChange={setDatasetSize}
        />
      </header>

      <div className="content-grid">
        <section className="main-panel">
          <div className="status-bar">
            <div>
              <span className="status-label">Active strategy</span>
              <strong>{version === 'A' ? 'Traditional' : version === 'B' ? 'useTransition' : 'useDeferredValue'}</strong>
            </div>
            <div>
              <span className="status-label">Dataset</span>
              <strong>{datasetSize.toLocaleString()} items</strong>
            </div>
            <div>
              <span className="status-label">Status</span>
              <strong>{isLoadingData ? 'Loading data…' : 'Ready'}</strong>
            </div>
          </div>

          <CurrentVersion
            items={items}
            searchTerm={searchTerm}
            onSearchTermChange={handleSearchTermChange}
            onPerformanceUpdate={handlePerformanceUpdate}
            isPending={isLoadingData}
          />
        </section>

        <aside className="sidebar-panel">
          <PerformanceMetrics
            metrics={metrics}
            stats={stats}
            interactionCount={interactionCount}
            onReset={handleReset}
            onExport={handleExport}
          />
          <div className="insight-card">
            <p className="section-eyebrow">Experiment insight</p>
            <h3>What to watch for</h3>
            <ul>
              <li>Traditional rendering updates immediately but feels more rigid during large searches.</li>
              <li>useTransition keeps input responsive while the list catches up.</li>
              <li>useDeferredValue lets the UI stay fluid and defers expensive list updates.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default App
