function PerformanceMetrics({ metrics, stats, interactionCount, onReset, onExport }) {
  return (
    <div className="metrics-card">
      <div className="metrics-header">
        <div>
          <p className="section-eyebrow">Performance dashboard</p>
          <h2>Live metrics</h2>
        </div>
        <div className="metrics-actions">
          <button type="button" className="ghost-button" onClick={onReset}>
            Reset
          </button>
          <button type="button" className="primary-button" onClick={onExport}>
            Export JSON
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-box">
          <span className="metric-label">Render time</span>
          <strong>{metrics.renderTime.toFixed(2)} ms</strong>
          <small>
            Avg {stats.render.average.toFixed(2)} · Min {stats.render.min.toFixed(2)} · Max{' '}
            {stats.render.max.toFixed(2)} · σ {stats.render.stdDev.toFixed(2)}
          </small>
        </div>
        <div className="metric-box">
          <span className="metric-label">Commit time</span>
          <strong>{metrics.commitTime.toFixed(2)} ms</strong>
          <small>
            Avg {stats.commit.average.toFixed(2)} · Min {stats.commit.min.toFixed(2)} · Max{' '}
            {stats.commit.max.toFixed(2)} · σ {stats.commit.stdDev.toFixed(2)}
          </small>
        </div>
        <div className="metric-box">
          <span className="metric-label">Filtering time</span>
          <strong>{metrics.filteringTime.toFixed(2)} ms</strong>
          <small>
            Avg {stats.filter.average.toFixed(2)} · Min {stats.filter.min.toFixed(2)} · Max{' '}
            {stats.filter.max.toFixed(2)} · σ {stats.filter.stdDev.toFixed(2)}
          </small>
        </div>
        <div className="metric-box">
          <span className="metric-label">Input latency</span>
          <strong>{metrics.inputLatency.toFixed(2)} ms</strong>
          <small>
            Avg {stats.inputLatency.average.toFixed(2)} · Min {stats.inputLatency.min.toFixed(2)} · Max{' '}
            {stats.inputLatency.max.toFixed(2)} · σ {stats.inputLatency.stdDev.toFixed(2)}
          </small>
        </div>
        <div className="metric-box">
          <span className="metric-label">Update completion time</span>
          <strong>{metrics.updateCompletionTime.toFixed(2)} ms</strong>
          <small>
            Avg {stats.updateCompletion.average.toFixed(2)} · Min {stats.updateCompletion.min.toFixed(2)} · Max{' '}
            {stats.updateCompletion.max.toFixed(2)} · σ {stats.updateCompletion.stdDev.toFixed(2)}
          </small>
        </div>
        <div className="metric-box">
          <span className="metric-label">DOM nodes</span>
          <strong>{metrics.domNodeCount}</strong>
          <small>{interactionCount} interactions tracked</small>
        </div>
      </div>
    </div>
  )
}

export default PerformanceMetrics
