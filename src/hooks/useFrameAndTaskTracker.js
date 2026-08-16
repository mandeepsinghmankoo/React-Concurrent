import { useCallback, useEffect, useRef } from 'react'

const FRAME_HISTORY_MS = 2000

function useFrameAndTaskTracker() {
  const frameTimesRef = useRef([])
  const longTasksRef = useRef([])
  const pendingFramesRef = useRef(new Set())

  useEffect(() => {
    frameTimesRef.current = []
    longTasksRef.current = []
    const pendingFrames = pendingFramesRef.current

    let frameId
    let observer

    const recordFrame = (timestamp) => {
      const cutoff = timestamp - FRAME_HISTORY_MS
      frameTimesRef.current.push(timestamp)
      frameTimesRef.current = frameTimesRef.current.filter((time) => time >= cutoff)
      frameId = requestAnimationFrame(recordFrame)
    }

    frameId = requestAnimationFrame(recordFrame)

    if (typeof PerformanceObserver !== 'undefined' && PerformanceObserver.supportedEntryTypes?.includes('longtask')) {
      observer = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry) => {
          longTasksRef.current.push({ start: entry.startTime, duration: entry.duration })
        })
      })
      observer.observe({ type: 'longtask', buffered: true })
    }

    return () => {
      cancelAnimationFrame(frameId)
      pendingFrames.forEach((id) => cancelAnimationFrame(id))
      pendingFrames.clear()
      observer?.disconnect()
    }
  }, [])

  return useCallback((keyStart, onMeasured) => {
    const firstFrameId = requestAnimationFrame(() => {
      pendingFramesRef.current.delete(firstFrameId)

      const secondFrameId = requestAnimationFrame(() => {
        pendingFramesRef.current.delete(secondFrameId)

        const keyEnd = performance.now()
        const windowDuration = keyEnd - keyStart
        const elapsedSeconds = (keyEnd - keyStart) / 1000
        const framesInWindow = frameTimesRef.current.filter(
          (timestamp) => timestamp >= keyStart && timestamp <= keyEnd,
        )
        const tasksInWindow = longTasksRef.current.filter(
          (task) => task.start >= keyStart && task.start <= keyEnd,
        )
        const busyTime = tasksInWindow.reduce((sum, task) => sum + task.duration, 0)

        onMeasured({
          fps: elapsedSeconds > 0 ? framesInWindow.length / elapsedSeconds : 0,
          longestTask: tasksInWindow.reduce((max, task) => Math.max(max, task.duration), 0),
          mainThreadBusyPercent: windowDuration > 0 ? Math.min(100, (busyTime / windowDuration) * 100) : 0,
        })
      })
      pendingFramesRef.current.add(secondFrameId)
    })
    pendingFramesRef.current.add(firstFrameId)
  }, [])
}

export default useFrameAndTaskTracker
