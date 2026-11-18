import { kmPerStop, LINES, LINE_META } from '../data/lines'
import type { PathLeg } from './network'
import { diffStops } from './schedule'

/**
 * Namma Metro fare slabs — revised fares effective 09.02.2025.
 * Single source of truth: both the calculation and the UI slab strip use this.
 */
export const FARE_SLABS: Array<{ minKm: number; maxKm: number; fare: number }> = [
  { minKm: 0, maxKm: 2, fare: 10 },
  { minKm: 2, maxKm: 4, fare: 20 },
  { minKm: 4, maxKm: 6, fare: 30 },
  { minKm: 6, maxKm: 8, fare: 40 },
  { minKm: 8, maxKm: 10, fare: 50 },
  { minKm: 10, maxKm: 15, fare: 60 },
  { minKm: 15, maxKm: 20, fare: 70 },
  { minKm: 20, maxKm: 25, fare: 80 },
  { minKm: 25, maxKm: Infinity, fare: 90 },
]

export const SMART_CARD_DISCOUNT = 0.05

export interface FareResult {
  distanceKm: number
  fare: number
  smartCardFare: number
  slabIndex: number
  /** set when the fare comes from a line's official fare chart rather than distance slabs */
  officialChart?: string
}

const round2 = (n: number) => Math.round(n * 100) / 100

export function calculateFare(legs: PathLeg[]): FareResult {
  const km = legs.reduce((sum, l) => sum + diffStops(l.line, l.from, l.to) * kmPerStop(l.line), 0)
  let slabIndex = Math.max(0, FARE_SLABS.findIndex(s => km <= s.maxKm))
  let fare = FARE_SLABS[slabIndex].fare
  let officialChart: string | undefined
  // Single-line trips on a line with a published fare chart use that chart.
  const only = legs.length === 1 ? legs[0] : null
  const table = only ? LINE_META[only.line].fareTable : undefined
  if (only && table) {
    const st = LINES[only.line]
    const chartFare = table[st.indexOf(only.from)]?.[st.indexOf(only.to)]
    if (chartFare !== undefined) {
      fare = chartFare
      slabIndex = -1
      officialChart = LINE_META[only.line].name
    }
  }
  return {
    distanceKm: Math.round(km * 10) / 10,
    fare,
    smartCardFare: round2(fare * (1 - SMART_CARD_DISCOUNT)),
    slabIndex,
    officialChart,
  }
}
