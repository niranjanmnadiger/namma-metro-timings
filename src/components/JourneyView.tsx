import { useState } from 'react'
import { LINE_META, type LineKey } from '../data/lines'
import { legStations } from '../utils/network'
import { durStr, fmtMins, fmtTime, minsOfDay, INTERCHANGE_BUFFER, type Journey, type JourneyLeg } from '../utils/schedule'
import { ChevronRight, LineMark, lineVars } from './ui'


/** "11:20 am" -> ["11:20", "AM"] for large time figures. */
function timeParts(d: Date): [string, string] {
  const [hm, ap] = fmtTime(d).split(' ')
  return [hm, (ap ?? '').toUpperCase()]
}

function TimeFigure({ label, date, align }: { label: string; date: Date; align?: 'end' }) {
  const [hm, ap] = timeParts(date)
  return (
    <div className={`time-block${align === 'end' ? ' end' : ''}`}>
      <span className="label">{label}</span>
      <div className="time-figure">{hm}<small>{ap}</small></div>
    </div>
  )
}

export function JourneySummary({ journey, live }: { journey: Journey; live: boolean }) {
  const { legs, firstTrain, finalArrive, totalMins, nextDay } = journey
  const changes = legs.length - 1
  const stops = legs.reduce((a, l) => a + l.stops, 0)

  return (
    <section className="panel summary reveal" aria-label="Journey summary">
      <div className="times">
        <TimeFigure label="Board" date={firstTrain} />
        <div className="duration"><span>{durStr(totalMins)}</span></div>
        <TimeFigure label="Arrive" date={finalArrive} align="end" />
      </div>

      <div className="strip" aria-hidden="true">
        {legs.map((l, i) => <span key={i} style={{ ...lineVars(l.line), flex: Math.max(l.stops, 1) }} />)}
      </div>

      <dl className="facts">
        <div className="fact"><dt className="label">{changes === 1 ? 'Change' : 'Changes'}</dt><dd className="fact-value">{changes === 0 ? 'Direct' : changes}</dd></div>
        <div className="fact"><dt className="label">Stops</dt><dd className="fact-value">{stops}</dd></div>
        <div className="fact"><dt className="label">First wait</dt><dd className="fact-value">{legs[0].waitMins} min</dd></div>
        <div className="fact"><dt className="label">{legs.length === 1 ? 'Line' : 'Lines'}</dt><dd className="fact-value">{legs.length}</dd></div>
      </dl>

      {nextDay && (
        <p className="callout" role="status">
          Service has ended for today. These are the first trains on {firstTrain.toLocaleDateString('en-IN', { weekday: 'long' })} morning.
        </p>
      )}
      {live && !nextDay && (
        <p className="live meta">Live. Updates every minute. Times are estimates.<sup className="fn">1</sup></p>
      )}
    </section>
  )
}

export function Itinerary({ journey, now }: { journey: Journey; now: Date }) {
  const { legs, finalArrive } = journey
  const last = legs[legs.length - 1]
  return (
    <section className="panel itinerary reveal" aria-label="Itinerary">
      <h3>Your route</h3>
      <ol style={{ listStyle: 'none' }}>
        {legs.map((leg, i) => <LegBlock key={i} leg={leg} isFirst={i === 0} now={now} />)}
        <Stop time={fmtTime(finalArrive)} name={last.to} meta="Destination" line={last.line} position="end" />
      </ol>
    </section>
  )
}

function Stop({ time, name, meta, line, position }: {
  time: string; name: string; meta?: string; line: LineKey; position: 'start' | 'mid' | 'end'
}) {
  return (
    <li className="row" style={lineVars(line)}>
      <span className="row-time">{time.toUpperCase()}</span>
      <span className={`rail ${position}`} aria-hidden="true"><span className="node" /></span>
      <div className="row-body">
        <div className="stop-name">{name}</div>
        {meta && <span className="meta">{meta}</span>}
      </div>
    </li>
  )
}

function LegBlock({ leg, isFirst, now }: { leg: JourneyLeg; isFirst: boolean; now: Date }) {
  const [open, setOpen] = useState(false)
  const between = legStations(leg).slice(1, -1)
  const minsLeft = leg.lastTrain !== null ? leg.lastTrain - minsOfDay(now) : null
  const lastSoon = minsLeft !== null && minsLeft >= 0 && minsLeft <= 45 && leg.trainTime.toDateString() === now.toDateString()
  const listId = `stops-${leg.line}-${leg.from}`.replace(/\W+/g, '-')

  return (
    <>
      {!isFirst && (
        <li className="row">
          <span />
          <span className="rail walk" aria-hidden="true" />
          <p className="walk-note">
            Change to the <strong>{LINE_META[leg.line].name} Line</strong>. Allow about {INTERCHANGE_BUFFER} min to reach the platform.
          </p>
        </li>
      )}

      <Stop time={fmtTime(leg.trainTime)} name={leg.from} line={leg.line} position={isFirst ? 'start' : 'mid'}
        meta={isFirst ? (leg.waitMins > 0 ? `Next train in ${leg.waitMins} min` : 'Train due now') : 'Interchange'} />

      <li className="row" style={lineVars(leg.line)}>
        <span />
        <span className="rail" aria-hidden="true" />
        <div className="leg">
          <p className="leg-title">
            <LineMark line={leg.line} suffix=" Line" /> towards <strong>{leg.term}</strong>
          </p>
          <span className="meta">
            {leg.stops} {leg.stops === 1 ? 'stop' : 'stops'} · {leg.travelMins} min · alight {fmtTime(leg.reach).toUpperCase()}
          </span>
          {leg.upcomingTrains.length > 1 && (
            <div className="departures" aria-label="Upcoming departures">
              {leg.upcomingTrains.map((m, j) => (
                <span key={m} className={`departure${j === 0 ? ' next' : ''}`}>{fmtMins(m).toUpperCase()}</span>
              ))}
            </div>
          )}
          {leg.lastTrain !== null && (
            <span className={`meta${lastSoon ? ' warn' : ''}`}>Last train from here {fmtMins(leg.lastTrain).toUpperCase()}</span>
          )}
          {between.length > 0 && (
            <>
              <button type="button" className="text-btn" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls={listId}>
                {open ? 'Hide' : 'Show'} {between.length} {between.length === 1 ? 'stop' : 'stops'} <ChevronRight />
              </button>
              {open && <ul className="stops-list" id={listId}>{between.map(s => <li key={s}>{s}</li>)}</ul>}
            </>
          )}
        </div>
      </li>
    </>
  )
}
