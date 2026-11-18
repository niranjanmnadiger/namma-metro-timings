// ---------------------------------------------------------------------------
// LINE DATA
//
// To add a new line (e.g. Pink):
//   1. Add its key to `LineKey`
//   2. Add its ordered station list to `LINES`
//   3. Add an entry to `LINE_META`
//   4. Add `<key>_fwd` / `<key>_rev` headway windows in timetable.ts
//
// Interchanges are detected automatically: any station name that appears on
// more than one line is treated as an interchange. If two lines connect at
// stations with *different* names, list them in `EXTRA_TRANSFERS`.
// Routing, fares, search and the UI all pick the new line up from here.
// ---------------------------------------------------------------------------

export type LineKey = 'purple' | 'green' | 'yellow' | 'pink'

export const LINES: Record<LineKey, string[]> = {
  purple: [
    'Challaghatta', 'Kengeri', 'Kengeri Bus Terminal', 'Pattanagere',
    'Jnana Bharathi', 'Rajarajeshwari Nagar', 'Panchamukhi / Nayandahalli',
    'Mysuru Road', 'Deepanjali Nagar', 'Attiguppe', 'Vijayanagar', 'Hosahalli',
    'Magadi Road', 'Krantivira Sangolli Rayanna Railway Station',
    'Kempegowda Station (Majestic)',
    'Sir M Visvesvaraya Station, Central College',
    'Dr B R Ambedkar Station, Vidhana Soudha', 'Cubbon Park',
    'Mahatma Gandhi Road', 'Trinity', 'Halasuru', 'Indiranagar',
    'Swami Vivekananda Road', 'Baiyappanahalli', 'Benniganahalli', 'K R Pura',
    'Singayyanapalya', 'Garudacharapalya', 'Hoodi', 'Seetharampalya',
    'Kundalahalli', 'Nallurhalli', 'Sri Sathya Sai Hospital',
    'Pattandur Agrahara', 'Kadugodi Tree Park', 'Hopefarm Channasandra',
    'Whitefield (Kadugodi)',
  ],
  green: [
    'Madavara', 'Chikkabidarakallu', 'Manjunath Nagar', 'Dasarahalli',
    'Jalahalli', 'Peenya Industry', 'Peenya', 'Goraguntepalya', 'Yeshwanthpur',
    'Sandal Soap Factory', 'Mahalakshmi', 'Rajajinagar',
    'Mahakavi Kuvempu Road', 'Srirampura', 'Sampige Road',
    'Kempegowda Station (Majestic)', 'Chickpete', 'Krishna Rajendra Market',
    'National College', 'Lalbagh', 'South End Circle', 'Jayanagar',
    'Rashtreeya Vidyalaya Road', 'Banashankari', 'Jaya Prakash Nagar',
    'Yelachenahalli', 'Konanakunte Cross', 'Doddakallasandra', 'Vajarahalli',
    'Thalaghattapura', 'Silk Institute',
  ],
  yellow: [
    'Rashtreeya Vidyalaya Road', 'Ragigudda', 'Jayadeva Hospital',
    'BTM Layout', 'Central Silk Board', 'Bommanahalli', 'Hongasandra',
    'Kudlu Gate', 'Singasandra', 'Hosa Road', 'Beratena Agrahara',
    'Electronic City', 'Infosys Foundation Konappana Agrahara', 'Huskur Road',
    'Hebbagodi', 'Bommasandra',
  ],
  // Pink Line — elevated stretch in service (Nov 2026), south → north.
  // Underground section to Nagawara (MG Road / Nagawara interchanges) opens 2027.
  pink: [
    'Kalena Agrahara', 'Hulimavu', 'IIM Bangalore', 'JP Nagar 4th Phase',
    'Jayadeva Hospital', 'S G Palya (Tavarekere)',
  ],
}

export interface LineMeta {
  name: string        // "Purple"
  code: string        // "L1"
  color: string       // brand colour (hex); the UI uses the themed --line-<key> token when defined
  lengthKm: number    // end-to-end route length, used for fare estimates
  minsPerStop: number // average running time between adjacent stations
  fareTable?: number[][] // official station-to-station fares (₹), same order as LINES[line]
  note?: string       // short service note shown in the UI
}

export const LINE_META: Record<LineKey, LineMeta> = {
  purple: { name: 'Purple', code: 'L1', color: '#8E44D6', lengthKm: 43.49, minsPerStop: 3 },
  green:  { name: 'Green',  code: 'L2', color: '#1FA34A', lengthKm: 33.46, minsPerStop: 3 },
  yellow: { name: 'Yellow', code: 'L3', color: '#E2B007', lengthKm: 19.15, minsPerStop: 3 },
  pink:   { name: 'Pink',   code: 'L4', color: '#E0478E', lengthKm: 7.5,   minsPerStop: 3,
            // BMRCL Pink Line fare chart (Nov 2026): Kalena Agrahara … S G Palya
            fareTable: [
              [10, 10, 10, 20, 20, 30],
              [10, 10, 10, 10, 20, 20],
              [10, 10, 10, 10, 10, 20],
              [20, 10, 10, 10, 10, 20],
              [20, 20, 10, 10, 10, 10],
              [30, 20, 20, 20, 10, 10],
            ],
            note: 'Elevated stretch only · underground section to Nagawara opens 2027' },
}

/** Display order of lines everywhere in the UI. */
export const LINE_ORDER = Object.keys(LINES) as LineKey[]

/** Transfers between stations with different names on different lines. */
export const EXTRA_TRANSFERS: Array<{ a: [LineKey, string]; b: [LineKey, string] }> = []

/** Common nicknames so search finds "majestic", "silk board", "ecity" etc. */
export const STATION_ALIASES: Record<string, string[]> = {
  'Kempegowda Station (Majestic)': ['majestic', 'kempegowda'],
  'Krantivira Sangolli Rayanna Railway Station': ['ksr', 'city railway station', 'railway station'],
  'Mahatma Gandhi Road': ['mg road'],
  'Central Silk Board': ['silk board', 'csb'],
  'Electronic City': ['ecity', 'e city', 'electronics city'],
  'Rashtreeya Vidyalaya Road': ['rv road'],
  'Krishna Rajendra Market': ['kr market', 'city market'],
  'K R Pura': ['kr puram', 'krpuram', 'k r puram'],
  'Whitefield (Kadugodi)': ['whitefield', 'kadugodi'],
  'Sir M Visvesvaraya Station, Central College': ['central college', 'visvesvaraya'],
  'Dr B R Ambedkar Station, Vidhana Soudha': ['vidhana soudha', 'ambedkar'],
  'Swami Vivekananda Road': ['sv road'],
  'Jaya Prakash Nagar': ['jp nagar'],
  'Mahakavi Kuvempu Road': ['kuvempu'],
  'Sri Sathya Sai Hospital': ['sathya sai'],
  'Infosys Foundation Konappana Agrahara': ['infosys', 'konappana'],
  'Panchamukhi / Nayandahalli': ['nayandahalli'],
  'Jnana Bharathi': ['bangalore university', 'jnanabharathi'],
  'Hopefarm Channasandra': ['hope farm'],
  'Rajarajeshwari Nagar': ['rr nagar'],
  'Baiyappanahalli': ['byappanahalli'],
  'Yeshwanthpur': ['yeshwantpur', 'yesvantpur'],
  'S G Palya (Tavarekere)': ['sg palya', 'tavarekere', 's.g. palya'],
  'IIM Bangalore': ['iimb', 'bilekahalli'],
  'JP Nagar 4th Phase': ['jp nagar 4th phase'],
  'Kalena Agrahara': ['kalena'],
}

// ---------------------------------------------------------------------------
// Derived helpers
// ---------------------------------------------------------------------------

export interface StationInfo {
  name: string
  lines: LineKey[]
}

/** Every unique station with the lines that serve it. */
export const STATIONS: StationInfo[] = (() => {
  const map = new Map<string, LineKey[]>()
  for (const line of LINE_ORDER) {
    for (const s of LINES[line]) {
      if (!map.has(s)) map.set(s, [])
      map.get(s)!.push(line)
    }
  }
  return [...map.entries()].map(([name, lines]) => ({ name, lines }))
})()

export const STATION_LINES: Record<string, LineKey[]> =
  Object.fromEntries(STATIONS.map(s => [s.name, s.lines]))

export const kmPerStop = (line: LineKey) => LINE_META[line].lengthKm / (LINES[line].length - 1)

/** Shorter, friendlier label for long official names. */
export function shortName(station: string): string {
  return station
    .replace('Kempegowda Station (Majestic)', 'Majestic')
    .replace('Sir M Visvesvaraya Station, Central College', 'Central College')
    .replace('Dr B R Ambedkar Station, Vidhana Soudha', 'Vidhana Soudha')
    .replace('Krantivira Sangolli Rayanna Railway Station', 'KSR Railway Station')
    .replace('Infosys Foundation Konappana Agrahara', 'Infosys Konappana Agrahara')
}
