import type { JourneyLeg } from '../utils/schedule'
import { LINE_COLORS, type LineKey } from '../data/lines'

interface Props { legs: JourneyLeg[] }

const LINE_COLOR_HEX: Record<LineKey, string> = {
  purple: '#a855f7',
  green:  '#22c55e',
  yellow: '#eab308',
}

export default function RouteMap({ legs }: Props) {
  // Collect all stops to render: from each leg, show first + last + interchange
  // For longer legs show a few intermediate stops as dots
  type Stop = { name: string; line: LineKey; type: 'start' | 'end' | 'interchange' | 'mid' }
  const stops: Stop[] = []

  legs.forEach((leg, li) => {
    const isFirst = li === 0
    const isLast  = li === legs.length - 1

    stops.push({
      name: leg.from,
      line: leg.line,
      type: leg.isInterchange ? 'interchange' : isFirst ? 'start' : 'mid',
    })

    // intermediate dots (just count, no names) — max 3 shown
    const intermed = Math.min(leg.stops - 1, 3)
    for (let i = 0; i < intermed; i++) {
      stops.push({ name: '', line: leg.line, type: 'mid' })
    }

    if (isLast) {
      stops.push({ name: leg.to, line: leg.line, type: 'end' })
    }
  })

  // SVG layout: vertical strip, each stop is spaced 44px apart
  const STOP_H   = 44
  const LINE_X   = 24
  const LABEL_X  = 42
  const height   = Math.max(160, stops.length * STOP_H + 24)
  const width    = 300

  return (
    <div style={{
      background: 'var(--s1)', border: '1px solid var(--border)',
      borderRadius: 'var(--r)', overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 16px', fontFamily: 'var(--mono)', fontSize: 9,
        letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted2)',
        borderBottom: '1px solid var(--border)',
      }}>
        🛤 &nbsp;Route Map
      </div>

      <div style={{ padding: '12px 16px', overflowX: 'auto' }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ display: 'block', maxWidth: '100%' }}
        >
          {/* Line segments between stops */}
          {stops.map((stop, i) => {
            if (i === stops.length - 1) return null
            const y1 = 20 + i * STOP_H
            const y2 = 20 + (i + 1) * STOP_H
            const col = LINE_COLOR_HEX[stop.line]
            return (
              <line
                key={`seg-${i}`}
                x1={LINE_X} y1={y1 + 6}
                x2={LINE_X} y2={y2 - 6}
                stroke={col}
                strokeWidth={3}
                strokeOpacity={0.5}
              />
            )
          })}

          {/* Stops */}
          {stops.map((stop, i) => {
            const y = 20 + i * STOP_H
            const col = LINE_COLOR_HEX[stop.line]
            const isNamed = stop.type !== 'mid' || stop.name !== ''

            if (!isNamed) {
              // small mid dot
              return (
                <circle
                  key={`dot-${i}`}
                  cx={LINE_X} cy={y}
                  r={3}
                  fill={col}
                  fillOpacity={0.4}
                />
              )
            }

            const isInterchange = stop.type === 'interchange'
            const isEndpoint    = stop.type === 'start' || stop.type === 'end'
            const r             = isEndpoint ? 7 : isInterchange ? 7 : 5

            return (
              <g key={`stop-${i}`}>
                {/* outer ring for endpoints / interchanges */}
                {(isEndpoint || isInterchange) && (
                  <circle
                    cx={LINE_X} cy={y}
                    r={r + 4}
                    fill={col}
                    fillOpacity={0.12}
                  />
                )}

                {/* main dot */}
                <circle
                  cx={LINE_X} cy={y}
                  r={r}
                  fill={isInterchange ? '#fde047' : col}
                  stroke={isInterchange ? '#fbbf24' : col}
                  strokeWidth={isEndpoint ? 2 : 0}
                  fillOpacity={isEndpoint ? 1 : 0.8}
                />

                {/* interchange icon */}
                {isInterchange && (
                  <text x={LINE_X} y={y + 4} textAnchor="middle"
                    fontSize={7} fill="#000" fontWeight="bold">⇄</text>
                )}

                {/* station label */}
                <text
                  x={LABEL_X} y={y + 1}
                  fontSize={stop.type === 'start' || stop.type === 'end' ? 12 : 10}
                  fontWeight={stop.type === 'start' || stop.type === 'end' ? 700 : 400}
                  fill={stop.type === 'start' || stop.type === 'end' ? '#eeeef5' : '#8888a0'}
                  dominantBaseline="middle"
                  fontFamily="DM Sans, sans-serif"
                >
                  {/* truncate long names */}
                  {stop.name.length > 26 ? stop.name.slice(0, 24) + '…' : stop.name}
                </text>

                {/* line badge for interchange */}
                {isInterchange && (
                  <text
                    x={LABEL_X} y={y + 14}
                    fontSize={8} fill="#fde047"
                    dominantBaseline="middle"
                    fontFamily="Space Mono, monospace"
                    opacity={0.8}
                  >
                    🔄 interchange · change here
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Line legend */}
      <div style={{
        display: 'flex', gap: 12, padding: '8px 16px 14px',
        flexWrap: 'wrap',
      }}>
        {Array.from(new Set(legs.map(l => l.line))).map(line => (
          <div key={line} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 24, height: 3, borderRadius: 2, background: LINE_COLOR_HEX[line] }} />
            <span style={{
              fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted2)',
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              {line}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
