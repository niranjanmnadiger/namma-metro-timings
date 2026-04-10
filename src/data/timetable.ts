import type { LineKey } from './lines'

export type ScheduleKey = 'monday' | 'weekday' | 'saturday' | 'sunday'

export interface HeadwayWindow {
  s: string  // start HH:MM
  e: string  // end   HH:MM
  f: number  // frequency in minutes
}

type DirectionKey = `${LineKey}_fwd` | `${LineKey}_rev`
type ScheduleMap = Partial<Record<DirectionKey, HeadwayWindow[]>>

// ---------------------------------------------------------------------------
// DATA ACCURACY DISCLAIMER
//
// This timetable is based on static headway windows published by BMRC on
// bmrc.co.in (April 2025 revision). Real-world service will differ because:
//
//  1. SHORT-RUN / LOOP TRAINS — BMRC operates partial-route "short loop"
//     trains on L1 (Purple) during peak hours, e.g. Kempegowda <->
//     Baiyappanahalli and Kempegowda <-> Pattandur Agrahara. These run IN
//     ADDITION to full end-to-end trains and effectively reduce the headway
//     for stations inside the loop zone. This app currently cannot model
//     overlapping loops on shared track — a future patch will add departure-
//     level loop data. If your journey is entirely within the central corridor
//     during peak hours, actual trains may arrive more frequently than shown.
//
//  2. OPERATIONAL VARIABILITY — Metros run on signal-controlled blocks.
//     Delays due to crowding, technical holds, or operational decisions are
//     normal. Always allow a 5-10 min buffer.
//
//  3. SCHEDULE CHANGES — BMRC revises timetables periodically. This data was
//     last synced in April 2025. Always cross-check with the official Namma
//     Metro app or bmrc.co.in for the latest figures.
// ---------------------------------------------------------------------------

export const HEADWAYS: Record<ScheduleKey, ScheduleMap> = {

  // MONDAY — earlier starts than Tue-Fri on L1/L2; distinct L3 profile
  monday: {
    purple_fwd: [
      { s: '04:15', e: '04:35', f: 20 },
      { s: '04:35', e: '05:00', f: 13 },
      { s: '05:00', e: '10:57', f: 10 },
      { s: '10:57', e: '15:21', f: 8 },
      { s: '15:21', e: '22:01', f: 10 },
      { s: '22:01', e: '22:45', f: 15 },
    ],
    purple_rev: [
      { s: '04:15', e: '04:35', f: 20 },
      { s: '04:35', e: '05:15', f: 15 },
      { s: '05:15', e: '06:54', f: 11 },
      { s: '06:54', e: '12:20', f: 10 },
      { s: '12:20', e: '16:45', f: 8 },
      { s: '16:45', e: '23:05', f: 10 },
    ],
    green_fwd: [
      { s: '04:15', e: '04:40', f: 25 },
      { s: '05:00', e: '06:15', f: 15 },
      { s: '06:15', e: '10:25', f: 10 },
      { s: '10:25', e: '10:39', f: 7 },
      { s: '10:39', e: '15:51', f: 8 },
      { s: '15:51', e: '19:44', f: 10 },
      { s: '19:44', e: '20:24', f: 8 },
      { s: '20:24', e: '22:04', f: 10 },
      { s: '22:04', e: '22:40', f: 10 },
      { s: '22:40', e: '22:57', f: 15 },
    ],
    green_rev: [
      { s: '04:15', e: '05:00', f: 20 },
      { s: '05:00', e: '07:00', f: 15 },
      { s: '07:00', e: '11:09', f: 10 },
      { s: '11:09', e: '16:48', f: 8 },
      { s: '16:48', e: '20:29', f: 10 },
      { s: '20:29', e: '21:30', f: 8 },
      { s: '21:30', e: '22:40', f: 10 },
      { s: '22:40', e: '23:05', f: 13 },
    ],
    yellow_fwd: [
      { s: '05:05', e: '05:35', f: 30 },
      { s: '05:35', e: '06:00', f: 25 },
      { s: '06:00', e: '06:40', f: 20 },
      { s: '06:40', e: '06:56', f: 16 },
      { s: '06:56', e: '07:07', f: 11 },
      { s: '07:07', e: '07:37', f: 10 },
      { s: '07:37', e: '10:55', f: 9 },
      { s: '10:55', e: '11:06', f: 11 },
      { s: '11:06', e: '16:42', f: 14 },
      { s: '16:42', e: '22:06', f: 9 },
      { s: '22:06', e: '22:30', f: 12 },
      { s: '22:30', e: '23:15', f: 15 },
      { s: '23:15', e: '23:55', f: 20 },
    ],
    yellow_rev: [
      { s: '05:05', e: '05:35', f: 30 },
      { s: '05:35', e: '06:00', f: 25 },
      { s: '06:00', e: '06:20', f: 20 },
      { s: '06:20', e: '07:00', f: 10 },
      { s: '07:00', e: '10:18', f: 9 },
      { s: '10:18', e: '10:30', f: 12 },
      { s: '10:30', e: '16:06', f: 14 },
      { s: '16:06', e: '22:42', f: 9 },
    ],
  },

  // TUESDAY – FRIDAY
  weekday: {
    purple_fwd: [
      { s: '05:00', e: '05:20', f: 20 },
      { s: '05:20', e: '10:57', f: 10 },
      { s: '10:57', e: '15:21', f: 8 },
      { s: '15:21', e: '22:01', f: 10 },
      { s: '22:01', e: '22:45', f: 15 },
    ],
    purple_rev: [
      { s: '05:00', e: '05:20', f: 20 },
      { s: '05:20', e: '06:00', f: 15 },
      { s: '06:00', e: '06:54', f: 11 },
      { s: '06:54', e: '12:20', f: 10 },
      { s: '12:20', e: '16:02', f: 8 },
      { s: '16:02', e: '23:05', f: 10 },
    ],
    green_fwd: [
      { s: '05:00', e: '06:15', f: 15 },
      { s: '06:15', e: '10:25', f: 11 },
      { s: '10:25', e: '10:39', f: 7 },
      { s: '10:39', e: '15:51', f: 8 },
      { s: '15:51', e: '19:44', f: 10 },
      { s: '19:44', e: '20:24', f: 8 },
      { s: '20:24', e: '22:04', f: 10 },
      { s: '22:04', e: '22:40', f: 10 },
      { s: '22:40', e: '22:57', f: 15 },
    ],
    green_rev: [
      { s: '05:00', e: '07:00', f: 15 },
      { s: '07:00', e: '11:09', f: 10 },
      { s: '11:09', e: '16:48', f: 8 },
      { s: '16:48', e: '20:29', f: 10 },
      { s: '20:29', e: '21:30', f: 8 },
      { s: '21:30', e: '22:40', f: 10 },
      { s: '22:40', e: '23:05', f: 13 },
    ],
    yellow_fwd: [
      { s: '06:00', e: '06:25', f: 25 },
      { s: '06:25', e: '07:10', f: 15 },
      { s: '07:10', e: '07:36', f: 13 },
      { s: '07:36', e: '07:58', f: 11 },
      { s: '07:58', e: '08:08', f: 10 },
      { s: '08:08', e: '10:59', f: 9 },
      { s: '10:59', e: '11:11', f: 12 },
      { s: '11:11', e: '16:47', f: 14 },
      { s: '16:47', e: '22:11', f: 9 },
      { s: '22:11', e: '22:25', f: 14 },
      { s: '22:25', e: '22:55', f: 15 },
      { s: '22:55', e: '23:55', f: 20 },
    ],
    yellow_rev: [
      { s: '06:00', e: '06:20', f: 20 },
      { s: '06:20', e: '06:35', f: 15 },
      { s: '06:35', e: '07:23', f: 12 },
      { s: '07:23', e: '07:32', f: 11 },
      { s: '07:32', e: '10:49', f: 9 },
      { s: '10:49', e: '11:03', f: 12 },
      { s: '11:03', e: '16:11', f: 14 },
      { s: '16:11', e: '22:20', f: 9 },
      { s: '22:20', e: '22:30', f: 10 },
      { s: '22:30', e: '22:42', f: 12 },
    ],
  },

  // SATURDAY
  saturday: {
    purple_fwd: [
      { s: '05:00', e: '05:20', f: 20 },
      { s: '05:20', e: '10:57', f: 10 },
      { s: '10:57', e: '15:21', f: 8 },
      { s: '15:21', e: '22:01', f: 10 },
      { s: '22:01', e: '22:45', f: 15 },
    ],
    purple_rev: [
      { s: '05:00', e: '05:20', f: 20 },
      { s: '05:20', e: '06:00', f: 15 },
      { s: '06:00', e: '06:54', f: 11 },
      { s: '06:54', e: '12:20', f: 10 },
      { s: '12:20', e: '16:45', f: 8 },
      { s: '16:45', e: '23:05', f: 10 },
    ],
    green_fwd: [
      { s: '05:00', e: '06:15', f: 15 },
      { s: '06:15', e: '10:39', f: 11 },
      { s: '10:39', e: '16:01', f: 8 },
      { s: '16:01', e: '16:23', f: 6 },
      { s: '16:23', e: '19:52', f: 11 },
      { s: '19:52', e: '20:24', f: 8 },
      { s: '20:24', e: '22:04', f: 10 },
      { s: '22:04', e: '23:00', f: 15 },
    ],
    green_rev: [
      { s: '05:00', e: '07:00', f: 15 },
      { s: '07:00', e: '11:53', f: 11 },
      { s: '11:53', e: '16:48', f: 8 },
      { s: '16:48', e: '20:57', f: 11 },
      { s: '20:57', e: '21:30', f: 8 },
      { s: '21:30', e: '22:40', f: 10 },
      { s: '22:40', e: '23:05', f: 13 },
    ],
    yellow_fwd: [
      { s: '06:00', e: '06:25', f: 25 },
      { s: '06:25', e: '06:45', f: 20 },
      { s: '06:45', e: '07:01', f: 16 },
      { s: '07:01', e: '07:16', f: 15 },
      { s: '07:16', e: '10:46', f: 10 },
      { s: '10:46', e: '10:58', f: 12 },
      { s: '10:58', e: '16:48', f: 14 },
      { s: '16:48', e: '22:08', f: 10 },
      { s: '22:08', e: '22:20', f: 12 },
      { s: '22:20', e: '22:50', f: 15 },
      { s: '22:50', e: '23:30', f: 20 },
      { s: '23:30', e: '23:55', f: 25 },
    ],
    yellow_rev: [
      { s: '06:00', e: '06:40', f: 20 },
      { s: '06:40', e: '10:10', f: 10 },
      { s: '10:10', e: '10:22', f: 12 },
      { s: '10:22', e: '16:12', f: 14 },
      { s: '16:12', e: '22:42', f: 10 },
    ],
  },

  // SUNDAY
  sunday: {
    purple_fwd: [
      { s: '07:00', e: '10:33', f: 10 },
      { s: '10:33', e: '20:01', f: 8 },
      { s: '20:01', e: '22:31', f: 10 },
      { s: '22:31', e: '22:45', f: 14 },
    ],
    purple_rev: [
      { s: '07:00', e: '07:50', f: 15 },
      { s: '07:50', e: '12:00', f: 10 },
      { s: '12:00', e: '21:28', f: 8 },
      { s: '21:28', e: '23:05', f: 10 },
    ],
    green_fwd: [
      { s: '07:00', e: '10:47', f: 10 },
      { s: '10:47', e: '20:15', f: 8 },
      { s: '20:15', e: '22:05', f: 10 },
      { s: '22:05', e: '22:29', f: 12 },
      { s: '22:29', e: '23:00', f: 15 },
    ],
    green_rev: [
      { s: '07:00', e: '07:58', f: 15 },
      { s: '07:58', e: '12:08', f: 10 },
      { s: '12:08', e: '21:44', f: 8 },
      { s: '21:44', e: '22:44', f: 10 },
      { s: '22:44', e: '23:05', f: 12 },
    ],
    yellow_fwd: [
      { s: '07:00', e: '11:48', f: 18 },
      { s: '11:48', e: '21:08', f: 14 },
      { s: '21:08', e: '21:26', f: 18 },
      { s: '21:26', e: '21:45', f: 19 },
      { s: '21:45', e: '22:45', f: 20 },
      { s: '22:45', e: '23:35', f: 25 },
      { s: '23:35', e: '23:55', f: 20 },
    ],
    yellow_rev: [
      { s: '07:00', e: '11:12', f: 18 },
      { s: '11:12', e: '22:24', f: 14 },
      { s: '22:24', e: '22:42', f: 18 },
    ],
  },
}