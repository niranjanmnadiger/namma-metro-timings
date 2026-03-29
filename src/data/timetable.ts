import type { LineKey } from './lines'

export type ScheduleKey = 'weekday' | 'saturday' | 'sunday'

export interface HeadwayWindow {
  s: string  // start HH:MM
  e: string  // end   HH:MM
  f: number  // frequency in minutes
}

type DirectionKey = `${LineKey}_fwd` | `${LineKey}_rev`
type ScheduleMap = Partial<Record<DirectionKey, HeadwayWindow[]>>

export const HEADWAYS: Record<ScheduleKey, ScheduleMap> = {
  weekday: {
    // Purple – extracted from official Namma Metro app screenshots
    purple_fwd: [   // Whitefield (Kadugodi) → Challaghatta
      { s: '04:15', e: '04:45', f: 20 },
      { s: '04:45', e: '10:57', f: 10 },
      { s: '10:57', e: '15:21', f: 10 },
      { s: '15:21', e: '22:01', f: 10 },
      { s: '22:01', e: '22:45', f: 15 },
    ],
    purple_rev: [   // Challaghatta → Whitefield (Kadugodi)
      { s: '05:15', e: '06:54', f: 15 },
      { s: '06:54', e: '12:00', f: 11 },
      { s: '12:00', e: '16:00', f:  8 },
      { s: '16:00', e: '22:05', f: 10 },
      { s: '22:05', e: '23:05', f: 10 },
    ],
    // Green – extracted from official JSON/CSV timetable extract
    green_fwd: [    // Madavara → Silk Institute
      { s: '04:15', e: '04:40', f: 25 },
      { s: '05:00', e: '06:15', f: 15 },
      { s: '06:15', e: '10:25', f: 10 },
      { s: '10:25', e: '10:39', f:  7 },
      { s: '10:39', e: '15:51', f:  8 },
      { s: '15:51', e: '19:44', f: 10 },
      { s: '19:44', e: '20:24', f:  8 },
      { s: '20:24', e: '22:40', f: 10 },
      { s: '22:40', e: '22:57', f: 15 },
    ],
    green_rev: [    // Silk Institute → Madavara
      { s: '05:00', e: '06:15', f: 15 },
      { s: '06:15', e: '10:25', f: 10 },
      { s: '10:25', e: '10:39', f:  7 },
      { s: '10:39', e: '15:51', f:  8 },
      { s: '15:51', e: '19:44', f: 10 },
      { s: '19:44', e: '20:24', f:  8 },
      { s: '20:24', e: '22:40', f: 10 },
      { s: '22:40', e: '22:57', f: 15 },
    ],
    // Yellow – from official app screenshots
    yellow_fwd: [   // RV Road → Bommasandra
      { s: '05:00', e: '06:00', f: 12 },
      { s: '06:00', e: '11:00', f:  8 },
      { s: '11:00', e: '16:00', f: 10 },
      { s: '16:00', e: '21:00', f:  8 },
      { s: '21:00', e: '23:00', f: 12 },
    ],
    yellow_rev: [   // Bommasandra → RV Road
      { s: '05:30', e: '06:30', f: 12 },
      { s: '06:30', e: '11:00', f:  8 },
      { s: '11:00', e: '16:00', f: 10 },
      { s: '16:00', e: '21:00', f:  8 },
      { s: '21:00', e: '23:00', f: 12 },
    ],
  },
  saturday: {
    purple_fwd: [
      { s: '05:00', e: '10:57', f: 10 },
      { s: '10:57', e: '15:21', f: 10 },
      { s: '15:21', e: '22:01', f: 10 },
      { s: '22:01', e: '22:45', f: 15 },
    ],
    purple_rev: [{ s: '05:00', e: '22:45', f: 10 }],
    green_fwd:  [{ s: '05:00', e: '22:57', f: 10 }],
    green_rev:  [{ s: '05:00', e: '22:57', f: 10 }],
    yellow_fwd: [{ s: '05:00', e: '23:00', f: 10 }],
    yellow_rev: [{ s: '05:00', e: '23:00', f: 10 }],
  },
  sunday: {
    purple_fwd: [
      { s: '07:00', e: '10:31', f: 15 },
      { s: '10:31', e: '20:01', f: 10 },
      { s: '20:01', e: '22:45', f: 14 },
    ],
    purple_rev: [{ s: '07:00', e: '22:45', f: 12 }],
    green_fwd:  [{ s: '07:00', e: '22:57', f: 10 }],
    green_rev:  [{ s: '07:00', e: '22:57', f: 10 }],
    yellow_fwd: [{ s: '07:00', e: '23:00', f: 12 }],
    yellow_rev: [{ s: '07:00', e: '23:00', f: 12 }],
  },
}
