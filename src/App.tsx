import { useEffect, useMemo, useState } from 'react'
import { useClock, usePersistentState, useTheme } from './hooks'
import { STATION_LINES } from './data/lines'
import { computeJourney, getScheduleKey, scheduleLabel } from './utils/schedule'
import { calculateFare } from './utils/fare'
import GlobalNav from './components/GlobalNav'
import Planner from './components/Planner'
import StationPicker from './components/StationPicker'
import { Itinerary, JourneySummary } from './components/JourneyView'
import FareCard from './components/FareCard'
import Home from './components/Home'
import NetworkMap from './components/NetworkMap'
import { Footer } from './components/Footer'

type Which = 'from' | 'to'

const valid = (s: string | null | undefined): string | null => (s && STATION_LINES[s] ? s : null)

function fromUrl(key: Which): string | null {
  try { return valid(new URLSearchParams(location.search).get(key)) } catch { return null }
}

export default function App() {
  const now = useClock()
  const { theme, toggle } = useTheme()

  const [savedFrom, setSavedFrom] = usePersistentState<string | null>('nm.from', null)
  const [savedTo, setSavedTo] = usePersistentState<string | null>('nm.to', null)
  const [from, setFrom] = useState<string | null>(() => fromUrl('from') ?? valid(savedFrom))
  const [to, setTo] = useState<string | null>(() => fromUrl('to') ?? valid(savedTo))
  const [recents, setRecents] = usePersistentState<string[]>('nm.recents', [])

  const [picker, setPicker] = useState<Which | null>(null)
  const [holiday, setHoliday] = useState(false)

  // Persist the route and keep it in the URL so it can be shared.
  useEffect(() => {
    setSavedFrom(from)
    setSavedTo(to)
    try {
      const url = new URL(location.href)
      if (from) url.searchParams.set('from', from); else url.searchParams.delete('from')
      if (to) url.searchParams.set('to', to); else url.searchParams.delete('to')
      history.replaceState(null, '', url)
    } catch { /* ignore */ }
  }, [from, to, setSavedFrom, setSavedTo])

  function pick(which: Which, station: string) {
    if (which === 'from') setFrom(station); else setTo(station)
    setRecents(r => [station, ...r.filter(x => x !== station)].slice(0, 5))
    setPicker(null)
  }

  // Plans from the current minute and re-plans as the clock ticks over.
  const minute = Math.floor(now.getTime() / 60_000)
  const departAt = useMemo(() => new Date(minute * 60_000), [minute])

  const schedKey = getScheduleKey(departAt, holiday)
  const journey = useMemo(
    () => (from && to && from !== to ? computeJourney(from, to, departAt, holiday) : null),
    [from, to, departAt, holiday],
  )
  const fare = useMemo(() => (journey ? calculateFare(journey.legs) : null), [journey])
  const hasRoute = Boolean(from && to)

  return (
    <>
      <a className="sr-only" href="#main">Skip to content</a>
      <GlobalNav now={now} theme={theme} onToggleTheme={toggle} />

      <main id="main" className="wrap">
        <header className="hero">
          <span className="hero-kn" lang="kn">ನಮ್ಮ ಮೆಟ್ರೋ</span>
          <h1>Plan your ride.</h1>
          <p>Live train times, interchanges and fares across the Purple, Green, Yellow and Pink lines.</p>
        </header>

        <NetworkMap active={journey ? [...new Set(journey.legs.map(l => l.line))] : undefined} />

        <Planner
          from={from} to={to}
          openPicker={picker}
          onOpenPicker={setPicker}
          onSwap={() => { setFrom(to); setTo(from) }}
          holiday={holiday} onHoliday={setHoliday}
          scheduleText={scheduleLabel(departAt, holiday)}
        />

        <div aria-live="polite">
          {hasRoute && from === to && (
            <div className="panel error section">Origin and destination are the same. Choose a different station.</div>
          )}
          {hasRoute && from !== to && !journey && (
            <div className="panel error section">No trains found for this trip. Check the stations and try again.</div>
          )}
          {journey && (
            <div className="section">
              <JourneySummary journey={journey} live />
              <div className="grid-2">
                <Itinerary journey={journey} now={now} />
                {fare && <FareCard fare={fare} />}
              </div>
            </div>
          )}
        </div>

        {!hasRoute && <Home schedKey={schedKey} onQuick={(a, b) => { setFrom(a); setTo(b) }} />}
      </main>

      <Footer />

      {picker && (
        <StationPicker
          title={picker === 'from' ? 'Choose a station' : 'Choose a destination'}
          selected={picker === 'from' ? from : to}
          recents={recents}
          onPick={s => pick(picker, s)}
          onClose={() => setPicker(null)}
        />
      )}
    </>
  )
}
