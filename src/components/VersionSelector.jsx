function VersionSelector({ version, onVersionChange, datasetSize, onDatasetChange }) {
  const versions = [
    { value: 'A', label: 'Version A' },
    { value: 'B', label: 'Version B' },
    { value: 'C', label: 'Version C' },
  ]

  return (
    <div className="selector-card">
      <div className="selector-group">
        <label className="selector-label" htmlFor="version-select">
          Rendering strategy
        </label>
        <div className="button-row" id="version-select">
          {versions.map((entry) => (
            <button
              key={entry.value}
              className={`mode-button${version === entry.value ? ' active' : ''}`}
              onClick={() => onVersionChange(entry.value)}
              type="button"
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      <div className="selector-group">
        <label className="selector-label" htmlFor="dataset-select">
          Dataset size
        </label>
        <select
          id="dataset-select"
          className="dataset-select"
          value={datasetSize}
          onChange={(event) => onDatasetChange(Number(event.target.value))}
        >
          {[1000, 5000, 10000, 25000, 50000, 100000].map((size) => (
            <option key={size} value={size}>
              {size.toLocaleString()}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default VersionSelector
