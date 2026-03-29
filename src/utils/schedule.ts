import { LINES, MAJESTIC, RV_ROAD, type LineKey } from '../data/lines'
import { HEADWAYS, type ScheduleKey } from '../data/timetable'

export const MINS_PER_STOP = 3   // estimated travel time per stop
export const INTERCHANGE_BUFFER = 7  // minutes to walk between platforms

// ── Time math ────────────────────────────────────────────────────────────────

export function toMins(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function addMins(date: Date, mins: number): Date {
  return new Date(date.getTime() + mins * 60_000)
}

export function fmtTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export function durStr(totalMins: number): string {
  if (totalMins < 60) return `${totalMins} min`
  return `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`
}

// ── Schedule detection ────────────────────────────────────────────────────────

export function is2nd4thSat(d: Date): boolean {
  if (d.getDay() !== 6) return false
  return [2, 4].includes(Math.ceil(d.getDate() / 7))
}

export function getScheduleKey(
  d: Date,
  overrideHoliday: boolean,
  override2nd4thSat: boolean
): ScheduleKey {
  if (overrideHoliday || override2nd4thSat) return 'sunday'
  const day = d.getDay()
  if (day === 0) return 'sunday'
  if (day === 6) return is2nd4thSat(d) ? 'sunday' : 'saturday'
  return 'weekday'
}

export function scheduleLabel(
  key: ScheduleKey,
  d: Date,
  overrideHoliday: boolean,
  override2nd4thSat: boolean
): string {
  if (overrideHoliday)    return 'PUBLIC HOLIDAY — SUNDAY SCH.'
  if (override2nd4thSat)  return '2ND / 4TH SAT — SUNDAY SCH.'
  if (key === 'sunday')   return 'SUNDAY SCHEDULE'
  if (key === 'saturday') return is2nd4thSat(d) ? '2ND/4TH SAT — SUNDAY SCH.' : 'SATURDAY SCHEDULE'
  return 'WEEKDAY SCHEDULE'
}

// ── Train timing ─────────────────────────────────────────────────────────────

export function isForward(line: LineKey, from: string, to: string): boolean {
  return LINES[line].indexOf(from) < LINES[line].indexOf(to)
}

export function terminus(line: LineKey, forward: boolean): string {
  const arr = LINES[line]
  return forward ? arr[arr.length - 1] : arr[0]
}

export function diffStops(line: LineKey, a: string, b: string): number {
  return Math.abs(LINES[line].indexOf(a) - LINES[line].indexOf(b))
}

/** Returns the absolute minute-of-day for the next train, or null if no service */
export function nextTrainMins(
  line: LineKey,
  forward: boolean,
  fromDate: Date,
  schedKey: ScheduleKey
): number | null {
  const dirKey = `${line}_${forward ? 'fwd' : 'rev'}` as const
  const windows = HEADWAYS[schedKey][dirKey] ?? HEADWAYS[schedKey][`${line}_fwd`] ?? []
  const nowMins = fromDate.getHours() * 60 + fromDate.getMinutes()

  for (const w of windows) {
    const s = toMins(w.s)
    const e = toMins(w.e)
    if (nowMins <= e) {
      const base = Math.max(nowMins, s)
      const next = base === s ? s : s + Math.ceil((base - s) / w.f) * w.f
      if (next <= e) return next
    }
  }
  return null
}

/** Returns next N train departure times (minute-of-day) for a given line/direction */
export function nextNTrains(
  line: LineKey,
  forward: boolean,
  fromDate: Date,
  schedKey: ScheduleKey,
  count = 3
): number[] {
  const dirKey = `${line}_${forward ? 'fwd' : 'rev'}` as const
  const windows = HEADWAYS[schedKey][dirKey] ?? HEADWAYS[schedKey][`${line}_fwd`] ?? []
  const nowMins = fromDate.getHours() * 60 + fromDate.getMinutes()
  const results: number[] = []

  for (const w of windows) {
    if (results.length >= count) break
    const s = toMins(w.s)
    const e = toMins(w.e)
    if (nowMins > e) continue
    let cur = Math.max(nowMins, s)
    if (cur > s) cur = s + Math.ceil((cur - s) / w.f) * w.f
    while (cur <= e && results.length < count) {
      results.push(cur)
      cur += w.f
    }
  }
  return results
}

// ── Path building ─────────────────────────────────────────────────────────────

export interface PathLeg {
  line: LineKey
  from: string
  to: string
}

export function buildPath(
  boardLine: LineKey, boardStation: string,
  dropLine: LineKey,  dropStation: string
): PathLeg[] {
  if (boardLine === dropLine) {
    return [{ line: boardLine, from: boardStation, to: dropStation }]
  }
  const pair = [boardLine, dropLine]
  if (pair.includes('purple') && pair.includes('green'))
    return [
      { line: boardLine, from: boardStation, to: MAJESTIC },
      { line: dropLine,  from: MAJESTIC,     to: dropStation },
    ]
  if (pair.includes('green') && pair.includes('yellow'))
    return [
      { line: boardLine, from: boardStation, to: RV_ROAD },
      { line: dropLine,  from: RV_ROAD,      to: dropStation },
    ]
  if (pair.includes('purple') && pair.includes('yellow'))
    return [
      { line: boardLine, from: boardStation, to: MAJESTIC },
      { line: 'green',   from: MAJESTIC,     to: RV_ROAD  },
      { line: dropLine,  from: RV_ROAD,      to: dropStation },
    ]
  return []
}

// ── Journey computation ───────────────────────────────────────────────────────

export interface JourneyLeg extends PathLeg {
  forward: boolean
  term: string
  trainTime: Date
  stops: number
  travelMins: number
  reach: Date
  waitMins: number
  isInterchange: boolean
  upcomingTrains: number[]   // next 3 departures (mins of day)
}

export interface Journey {
  legs: JourneyLeg[]
  schedKey: ScheduleKey
  firstTrain: Date
  finalArrive: Date
  totalMins: number
}

export function computeJourney(
  boardLine: LineKey, boardStation: string,
  dropLine: LineKey,  dropStation: string,
  now: Date,
  schedKey: ScheduleKey
): Journey | null {
  const path = buildPath(boardLine, boardStation, dropLine, dropStation)
  if (!path.length) return null

  let cur = new Date(now)
  const legs: JourneyLeg[] = []

  for (let i = 0; i < path.length; i++) {
    const leg = path[i]
    const forward = isForward(leg.line, leg.from, leg.to)
    const nt = nextTrainMins(leg.line, forward, cur, schedKey)
    if (nt === null) return null

    const trainTime = new Date(cur)
    trainTime.setHours(Math.floor(nt / 60), nt % 60, 0, 0)
    if (trainTime < cur) trainTime.setDate(trainTime.getDate() + 1)

    const stops      = diffStops(leg.line, leg.from, leg.to)
    const travelMins = stops * MINS_PER_STOP
    const reach      = addMins(trainTime, travelMins)
    const waitMins   = Math.max(0, Math.round((trainTime.getTime() - cur.getTime()) / 60_000))
    const upcomingTrains = nextNTrains(leg.line, forward, cur, schedKey, 3)

    legs.push({
      ...leg,
      forward,
      term: terminus(leg.line, forward),
      trainTime,
      stops,
      travelMins,
      reach,
      waitMins,
      isInterchange: i > 0,
      upcomingTrains,
    })

    cur = addMins(reach, i < path.length - 1 ? INTERCHANGE_BUFFER : 0)
  }

  const firstTrain  = legs[0].trainTime
  const finalArrive = legs[legs.length - 1].reach
  const totalMins   = Math.max(0, Math.round((finalArrive.getTime() - now.getTime()) / 60_000))

  return { legs, schedKey, firstTrain, finalArrive, totalMins }
}
