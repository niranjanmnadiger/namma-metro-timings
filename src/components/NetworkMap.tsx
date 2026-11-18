import { LINE_META, LINE_ORDER, type LineKey } from '../data/lines'
import { lineVars } from './ui'

/**
 * Schematic (octilinear, not to scale) map of the operational network.
 * Coordinates are in a 960 x 380 viewBox. When `active` is given, other
 * lines are dimmed so the map echoes the planned trip.
 */
const PATHS: Record<LineKey, string> = {
  purple: 'M40 150 H920',
  green: 'M250 20 L380 150 L380 270 L300 350',
  yellow: 'M380 270 H470 L550 350 H760',
  pink: 'M450 350 V205',
}

type Pt = { x: number; y: number }
const TERMINI: Record<LineKey, [Pt, Pt]> = {
  purple: [{ x: 40, y: 150 }, { x: 920, y: 150 }],
  green: [{ x: 250, y: 20 }, { x: 300, y: 350 }],
  yellow: [{ x: 380, y: 270 }, { x: 760, y: 350 }],
  pink: [{ x: 450, y: 350 }, { x: 450, y: 205 }],
}

const INTERCHANGES: Array<{ x: number; y: number; name: string; lx: number; ly: number; anchor: 'start' | 'end' }> = [
  { x: 380, y: 150, name: 'Majestic', lx: 396, ly: 134, anchor: 'start' },
  { x: 380, y: 270, name: 'RV Road', lx: 364, ly: 260, anchor: 'end' },
  { x: 450, y: 270, name: 'Jayadeva Hospital', lx: 466, ly: 256, anchor: 'start' },
]

/** Minor stations drawn as small ticks with labels (hidden on small screens). */
const MINOR: Array<{ x: number; y: number; line: LineKey; name: string; lx: number; ly: number; anchor: 'start' | 'middle' | 'end' }> = [
  { x: 302, y: 72, line: 'green', name: 'Yeshwanthpur', lx: 316, ly: 76, anchor: 'start' },
  { x: 560, y: 150, line: 'purple', name: 'MG Road', lx: 560, ly: 134, anchor: 'middle' },
  { x: 730, y: 150, line: 'purple', name: 'KR Pura', lx: 730, ly: 134, anchor: 'middle' },
  { x: 510, y: 310, line: 'yellow', name: 'Silk Board', lx: 526, ly: 306, anchor: 'start' },
]

/** Terminus labels. */
const LABELS: Array<{ text: string; x: number; y: number; anchor: 'start' | 'middle' | 'end' }> = [
  { text: 'Challaghatta', x: 40, y: 182, anchor: 'start' },
  { text: 'Whitefield', x: 920, y: 182, anchor: 'end' },
  { text: 'Madavara', x: 236, y: 24, anchor: 'end' },
  { text: 'Silk Institute', x: 286, y: 376, anchor: 'end' },
  { text: 'Bommasandra', x: 760, y: 380, anchor: 'end' },
  { text: 'Kalena Agrahara', x: 450, y: 384, anchor: 'middle' },
  { text: 'S G Palya', x: 466, y: 210, anchor: 'start' },
]

export default function NetworkMap({ active }: { active?: LineKey[] }) {
  const isDim = (l: LineKey) => Boolean(active?.length) && !active!.includes(l)
  return (
    <figure className="netmap">
      <svg viewBox="0 0 960 390" role="img"
        aria-label={`Schematic map of the Namma Metro network: ${LINE_ORDER.map(l => `${LINE_META[l].name} Line`).join(', ')}.`}>
        {LINE_ORDER.map(l => (
          <g key={l} style={lineVars(l)} className={isDim(l) ? 'dim' : undefined}>
            <path className="ln" d={PATHS[l]} />
            {TERMINI[l].map((p, i) => <circle key={i} className="stn" cx={p.x} cy={p.y} r={7} />)}
          </g>
        ))}
        {MINOR.map(m => (
          <g key={m.name} className={`lbl-minor${isDim(m.line) ? ' dim' : ''}`} style={lineVars(m.line)}>
            <circle className="tick" cx={m.x} cy={m.y} r={4.5} />
            <text className="lbl" x={m.lx} y={m.ly} textAnchor={m.anchor}>{m.name}</text>
          </g>
        ))}
        {INTERCHANGES.map(x => (
          <g key={x.name}>
            <circle className="xchg" cx={x.x} cy={x.y} r={10} />
            <text className="lbl lbl-x" x={x.lx} y={x.ly} textAnchor={x.anchor}>{x.name}</text>
          </g>
        ))}
        {LABELS.map(t => (
          <text key={t.text} className="lbl lbl-term" x={t.x} y={t.y} textAnchor={t.anchor}>{t.text}</text>
        ))}
      </svg>
      <figcaption className="meta">Schematic map, not to scale. Operational lines as of November 2026.</figcaption>
    </figure>
  )
}
