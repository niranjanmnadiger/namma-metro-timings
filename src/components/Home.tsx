import { LINES, LINE_META, LINE_ORDER, shortName } from '../data/lines'
import type { ScheduleKey } from '../data/timetable'
import { fmtMins, lastTrainAt, trainsAt } from '../utils/schedule'
import { ArrowRight, ChevronRight, lineVars } from './ui'

interface Props {
  schedKey: ScheduleKey
  onQuick: (from: string, to: string) => void
}

const QUICK: Array<[string, string]> = [
  ['Kempegowda Station (Majestic)', 'Whitefield (Kadugodi)'],
  ['Mahatma Gandhi Road', 'Electronic City'],
  ['Yeshwanthpur', 'Central Silk Board'],
  ['Kalena Agrahara', 'Rashtreeya Vidyalaya Road'],
]

/** Shown before a route is chosen: popular trips and today's service on each line. */
export default function Home({ schedKey, onQuick }: Props) {
  return (
    <div className="reveal">
      <div className="section-head">
        <h2>Popular trips.</h2>
      </div>
      <ul className="quick">
        {QUICK.map(([a, b]) => (
          <li key={a + b}>
            <button type="button" onClick={() => onQuick(a, b)}>
              <span className="route">{shortName(a)} <ArrowRight /> {shortName(b)}</span>
              <ChevronRight />
            </button>
          </li>
        ))}
      </ul>

      <div className="section-head">
        <h2>The network today.</h2>
      </div>
      <div className="tiles">
        {LINE_ORDER.map(line => {
          const st = LINES[line]
          const a = st[0], b = st[st.length - 1]
          const first = Math.min(trainsAt(line, true, a, 0, schedKey)[0] ?? Infinity, trainsAt(line, false, b, 0, schedKey)[0] ?? Infinity)
          const last = Math.max(lastTrainAt(line, true, a, schedKey) ?? 0, lastTrainAt(line, false, b, schedKey) ?? 0)
          const meta = LINE_META[line]
          return (
            <article key={line} className="panel tile" style={lineVars(line)}>
              <span className="label">{meta.code}</span>
              <h3>{meta.name} Line</h3>
              <p>{shortName(a)} to {shortName(b)}</p>
              <div className="tile-stats">
                <div><strong>{st.length}</strong><span className="label">Stations</span></div>
                <div><strong>{Number.isFinite(first) ? fmtMins(first).toUpperCase() : 'None'}</strong><span className="label">First train</span></div>
                <div><strong>{last ? fmtMins(last).toUpperCase() : 'None'}</strong><span className="label">Last train</span></div>
              </div>
              {meta.note && <p className="note">{meta.note}</p>}
            </article>
          )
        })}
      </div>
    </div>
  )
}
