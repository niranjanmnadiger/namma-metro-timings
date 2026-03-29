import { LINES, MAJESTIC, RV_ROAD, type LineKey } from '../data/lines'

/**
 * Revised Namma Metro fare slabs
 * Effective from 09.02.2025
 *
 * Distance (km)  →  Fare (₹)
 * 0–2            →  10
 * 2–4            →  20
 * 4–6            →  30
 * 6–8            →  40
 * 8–10           →  50
 * 10–15          →  60
 * 15–20          →  70
 * 20–25          →  80
 * 25–30          →  90
 * >30            →  90
 */

const FARE_SLABS: Array<{ maxKm: number; fare: number }> = [
  { maxKm: 2, fare: 10 },
  { maxKm: 4, fare: 20 },
  { maxKm: 6, fare: 30 },
  { maxKm: 8, fare: 40 },
  { maxKm: 10, fare: 50 },
  { maxKm: 15, fare: 60 },
  { maxKm: 20, fare: 70 },
  { maxKm: 25, fare: 80 },
  { maxKm: 30, fare: 90 },
  { maxKm: Infinity, fare: 90 },
]

// Approximate inter-station distances in km per line
const KM_PER_STOP: Record<LineKey, number> = {
  purple: 43.49 / 36, // 37 stations = 36 segments
  green: 33.46 / 30,  // 31 stations = 30 segments
  yellow: 19.15 / 15, // 16 stations = 15 segments
}

function fareForKm(km: number): number {
  return FARE_SLABS.find((s) => km <= s.maxKm)?.fare ?? 90
}

function roundTo2(num: number): number {
  return Math.round(num * 100) / 100
}

export interface FareResult {
  distanceKm: number
  fare: number
  tokenFare: number
  smartCardFare: number
  offPeakSmartCardFare: number
  sundayOrHolidaySmartCardFare: number
}

export function calculateFare(
  boardLine: LineKey,
  boardStation: string,
  dropLine: LineKey,
  dropStation: string,
): FareResult {
  let totalKm = 0

  if (boardLine === dropLine) {
    const stops =
      Math.abs(
        LINES[boardLine].indexOf(boardStation) -
        LINES[boardLine].indexOf(dropStation)
      )

    totalKm = stops * KM_PER_STOP[boardLine]
  } else {
    const pair: LineKey[] = [boardLine, dropLine]

    if (pair.includes('purple') && pair.includes('green')) {
      const leg1 = Math.abs(
        LINES[boardLine].indexOf(boardStation) -
        LINES[boardLine].indexOf(MAJESTIC)
      )

      const leg2 = Math.abs(
        LINES[dropLine].indexOf(MAJESTIC) -
        LINES[dropLine].indexOf(dropStation)
      )

      totalKm = leg1 * KM_PER_STOP[boardLine] + leg2 * KM_PER_STOP[dropLine]
    } else if (pair.includes('green') && pair.includes('yellow')) {
      const leg1 = Math.abs(
        LINES[boardLine].indexOf(boardStation) -
        LINES[boardLine].indexOf(RV_ROAD)
      )

      const leg2 = Math.abs(
        LINES[dropLine].indexOf(RV_ROAD) -
        LINES[dropLine].indexOf(dropStation)
      )

      totalKm = leg1 * KM_PER_STOP[boardLine] + leg2 * KM_PER_STOP[dropLine]
    } else if (pair.includes('purple') && pair.includes('yellow')) {
      const leg1 = Math.abs(
        LINES[boardLine].indexOf(boardStation) -
        LINES[boardLine].indexOf(MAJESTIC)
      )

      const leg2 = Math.abs(
        LINES.green.indexOf(MAJESTIC) -
        LINES.green.indexOf(RV_ROAD)
      )

      const leg3 = Math.abs(
        LINES[dropLine].indexOf(RV_ROAD) -
        LINES[dropLine].indexOf(dropStation)
      )

      totalKm =
        leg1 * KM_PER_STOP[boardLine] +
        leg2 * KM_PER_STOP.green +
        leg3 * KM_PER_STOP[dropLine]
    }
  }

  const fare = fareForKm(totalKm)

  return {
    distanceKm: roundTo2(totalKm),
    fare,
    tokenFare: fare,
    smartCardFare: roundTo2(fare * 0.95),              // regular 5% discount
    offPeakSmartCardFare: roundTo2(fare * 0.90),       // total 10% during off-peak
    sundayOrHolidaySmartCardFare: roundTo2(fare * 0.90), // 10% on Sundays/national holidays
  }
}