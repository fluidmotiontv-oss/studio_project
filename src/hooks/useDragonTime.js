import { useState, useEffect, useMemo } from 'react'

export function useDragonTime() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(tick)
  }, [])

  const time = useMemo(() => {
    const solarMinutes = now.getHours() * 60 + now.getMinutes()
    const solarSeconds = solarMinutes * 60 + now.getSeconds()
    const d9Hour = Math.floor(solarMinutes / 54)
    const d9Minute = Math.floor(solarMinutes % 54)
    const d9Second = Math.floor(now.getSeconds() % 60)
    const d9DayProgress = (solarMinutes % 1440) / 1440

    const apexCenters = [8 * 54, 21 * 54]
    let nextApexMin = null
    let minutesToApex = null
    let isInApex = false

    for (const center of apexCenters) {
      const dist = solarMinutes - center
      if (Math.abs(dist) <= 9) {
        isInApex = true
        minutesToApex = dist
        break
      }
      if (center > solarMinutes) {
        if (nextApexMin === null || center < nextApexMin) {
          nextApexMin = center
        }
      }
    }

    if (!isInApex) {
      if (nextApexMin !== null) {
        minutesToApex = nextApexMin - solarMinutes
      } else {
        minutesToApex = (apexCenters[0] + 1440) - solarMinutes
      }
    }

    const drift = ((solarMinutes - (d9Hour * 54 + d9Minute)) / 1440 * 100).toFixed(3)

    return {
      d9Hour,
      d9Minute,
      d9Second,
      d9TotalHours: 26,
      d9TotalMinutes: 40,
      d9DayProgress,
      minutesToApex: Math.floor(minutesToApex),
      isInApex,
      solarTime: now,
      drift,
      cycleLabel: d9Hour < 13 ? 'First Cycle' : 'Second Cycle',
    }
  }, [now])

  return time
}
