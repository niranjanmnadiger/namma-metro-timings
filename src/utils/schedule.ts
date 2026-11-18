import { LINES, LINE_META, type LineKey } from '../data/lines'
import { HEADWAYS, type ScheduleKey, type HeadwayWindow } from '../data/timetable'
import { findRoute, INTERCHANGE_BUFFER, type PathLeg } from './network'

export { INTERCHANGE_BUFFER }
export type { PathLeg }

// ── Time helpers ───────────────────────────────────────────────────────────

export function toMins(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export const addMins = (date: Date, mins: number) => new Date(date.getTime() + mins * 60_000)
export const minsOfDay = (d: Date) => d.getHours() * 60 + d.getMinutes()

export function atMins(day: Date, mins: number): Date {
  const d = new Date(day)
  d.setHours(0, 0, 0, 0)
  return addMins(d, mins)
}

export function fmtTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function fmtMins(mins: number): string {
  const m = ((mins % 1440) + 1440) % 1440
  const h24 = Math.floor(m / 60)
  const h12 = h24 % 12 || 12
  return `${h12}:${String(m % 60).padStart(2, '0')} ${h24 >= 12 ? 'pm' : 'am'}`
}

export function durStr(totalMins: number): string {
  if (totalMins < 60) return `${totalMins} min`
  const m = totalMins % 60
  return `${Math.floor(totalMins / 60)} hr${m ? ` ${m} min` : ''}`
}

// ── Schedule detection ─────────────────────────────────────────────────────

export function is2nd4thSat(d: Date): boolean {
  if (d.getDay() !== 6) return false
  return [2, 4].includes(Math.ceil(d.getDate() / 7))
}

export function getScheduleKey(d: Date, holiday: boolean): ScheduleKey {
  if (holiday) return 'sunday'
  const day = d.getDay()
  if (day === 0) return 'sunday'
  if (day === 1) return 'monday'
  if (day === 6) return is2nd4thSat(d) ? 'sunday' : 'saturday'
  return 'weekday'
}

export function scheduleLabel(d: Date, holiday: boolean): string {
  if (holiday) return 'Holiday · Sunday timetable'
  const key = getScheduleKey(d, false)
  if (d.getDay() === 6 && key === 'sunday') return '2nd/4th Saturday · Sunday timetable'
  return {
    monday: 'Monday timetable',
    weekday: 'Weekday timetable',
    saturday: 'Saturday timetable',
    sunday: 'Sunday timetable',
  }[key]
}

// ── Train timing ───────────────────────────────────────────────────────────

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

function windowsFor(line: LineKey, forward: boolean, key: ScheduleKey): HeadwayWindow[] {
  const sched = HEADWAYS[key] as Record<string, HeadwayWindow[] | undefined>
  return sched[`${line}_${forward ? 'fwd' : 'rev'}`] ?? sched[`${line}_fwd`] ?? []
}

/**
 * Minutes a train takes from its starting terminus to reach `station`.
 * Headway windows describe departures from the terminus, so a train
 * reaches mid-line stations later than the window times.
 */
export function offsetFromTerminus(line: LineKey, station: string, forward: boolean): number {
  const arr = LINES[line]
  const idx = arr.indexOf(station)
  const hops = forward ? idx : arr.length - 1 - idx
  return hops * LINE_META[line].minsPerStop
}

/** Terminus departure times (minutes of day) at or after `fromMins`. */
function terminusDepartures(windows: HeadwayWindow[], fromMins: number, count: number): number[] {
  const out: number[] = []
  for (const w of windows) {
    if (out.length >= count) break
    const s = toMins(w.s), e = toMins(w.e)
    if (fromMins > e) continue
    let cur = fromMins <= s ? s : s + Math.ceil((fromMins - s) / w.f) * w.f
    while (cur <= e && out.length < count) {
      if (!out.length || cur > out[out.length - 1]) out.push(cur)
      cur += w.f
    }
  }
  return out
}

/** Next `count` trains at `station` (minutes of day), at or after `fromMins`. */
export function trainsAt(
  line: LineKey, forward: boolean, station: string,
  fromMins: number, key: ScheduleKey, count = 1,
): number[] {
  const off = offsetFromTerminus(line, station, forward)
  return terminusDepartures(windowsFor(line, forward, key), fromMins - off, count).map(m => m + off)
}

/** Last train of the day at `station` (minutes of day). */
export function lastTrainAt(line: LineKey, forward: boolean, station: string, key: ScheduleKey): number | null {
  const ws = windowsFor(line, forward, key)
  if (!ws.length) return null
  const w = ws[ws.length - 1]
  const s = toMins(w.s), e = toMins(w.e)
  return s + Math.floor((e - s) / w.f) * w.f + offsetFromTerminus(line, station, forward)
}

// ── Journey ────────────────────────────────────────────────────────────────

export interface JourneyLeg extends PathLeg {
  forward: boolean
  term: string
  trainTime: Date
  stops: number
  travelMins: number
  reach: Date
  waitMins: number
  isInterchange: boolean
  upcomingTrains: number[]
  lastTrain: number | null
}

export interface Journey {
  legs: JourneyLeg[]
  schedKey: ScheduleKey
  departAt: Date
  firstTrain: Date
  finalArrive: Date
  totalMins: number
  /** true when no service was left on the requested day and this is the next morning's plan */
  nextDay: boolean
}

function planLegs(path: PathLeg[], start: Date, key: ScheduleKey): JourneyLeg[] | null {
  let cur = new Date(start)
  const legs: JourneyLeg[] = []

  for (let i = 0; i < path.length; i++) {
    const leg = path[i]
    const forward = isForward(leg.line, leg.from, leg.to)
    const upcoming = trainsAt(leg.line, forward, leg.from, minsOfDay(cur), key, 4)
    if (!upcoming.length) return null

    const trainTime = atMins(cur, upcoming[0])
    const stops = diffStops(leg.line, leg.from, leg.to)
    const travelMins = stops * LINE_META[leg.line].minsPerStop
    const reach = addMins(trainTime, travelMins)

    legs.push({
      ...leg,
      forward,
      term: terminus(leg.line, forward),
      trainTime,
      stops,
      travelMins,
      reach,
      waitMins: Math.max(0, Math.round((trainTime.getTime() - cur.getTime()) / 60_000)),
      isInterchange: i > 0,
      upcomingTrains: upcoming,
      lastTrain: lastTrainAt(leg.line, forward, leg.from, key),
    })
    cur = addMins(reach, i < path.length - 1 ? INTERCHANGE_BUFFER : 0)
  }
  return legs
}

export function computeJourney(
  from: string, to: string, departAt: Date, holiday: boolean,
): Journey | null {
  const path = findRoute(from, to)
  if (!path) return null

  let start = departAt
  let key = getScheduleKey(start, holiday)
  let legs = planLegs(path, start, key)
  let nextDay = false

  if (!legs) {
    // Service over for the day — plan the first trains of the next day.
    start = new Date(departAt)
    start.setDate(start.getDate() + 1)
    start.setHours(0, 0, 0, 0)
    key = getScheduleKey(start, false)
    legs = planLegs(path, start, key)
    nextDay = true
    if (!legs) return null
  }

  const firstTrain = legs[0].trainTime
  const finalArrive = legs[legs.length - 1].reach
  return {
    legs,
    schedKey: key,
    departAt: start,
    firstTrain,
    finalArrive,
    totalMins: Math.round((finalArrive.getTime() - (nextDay ? firstTrain : departAt).getTime()) / 60_000),
    nextDay,
  }
}
