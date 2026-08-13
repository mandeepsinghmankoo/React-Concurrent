function calculateStats(values) {
  if (!values.length) {
    return {
      average: 0,
      min: 0,
      max: 0,
      stdDev: 0,
    }
  }

  const average = values.reduce((sum, value) => sum + value, 0) / values.length
  const min = Math.min(...values)
  const max = Math.max(...values)
  const variance = values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length
  const stdDev = Math.sqrt(variance)

  return { average, min, max, stdDev }
}

function measureRenderTime(callback) {
  if (typeof window !== 'undefined' && window.performance && window.performance.now) {
    const start = window.performance.now()
    callback()
    return window.performance.now() - start
  }
  return 0
}

function measureFilteringTime(callback) {
  if (typeof window !== 'undefined' && window.performance && window.performance.now) {
    const start = window.performance.now()
    const result = callback()
    return { result, time: window.performance.now() - start }
  }

  return { result: callback(), time: 0 }
}

function countDOMNodes() {
  if (typeof document === 'undefined') {
    return 0
  }
  return document.querySelectorAll('*').length
}

export { calculateStats, measureRenderTime, measureFilteringTime, countDOMNodes }
export default { calculateStats, measureRenderTime, measureFilteringTime, countDOMNodes }
