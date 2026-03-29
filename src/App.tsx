import { useState, useCallback, useEffect, useRef } from 'react'
import { useClock } from './hooks/useClock'
import { getScheduleKey, computeJourney } from './utils/schedule'
import { calculateFare } from './utils/fare'
import { LINES, type LineKey } from './data/lines'
import type { Journey } from './utils/schedule'
import type { FareResult } from './utils/fare'
import Header from './components/Header'
import LinePicker from './components/LinePicker'
import DayOverride from './components/DayOverride'
import JourneyResult from './components/JourneyResult'
import FareCard from './components/FareCard'
import RouteMap from './components/RouteMap'

export default function App() {
  const now = useClock()

  const [boardLine, setBoardLine]       = useState<LineKey>('purple')
  const [boardStation, setBoardStation] = useState(LINES.purple[0])
  const [dropLine, setDropLine]         = useState<LineKey>('green')
  const [dropStation, setDropStation]   = useState(LINES.green[0])
  const [isHoliday, setIsHoliday]       = useState(false)
  const [is2nd4th, setIs2nd4th]         = useState(false)

  const [journey, setJourney]         = useState<Journey | null>(null)
  const [fare, setFare]               = useState<FareResult | null>(null)
  const [error, setError]             = useState<string | null>(null)
  const [planned, setPlanned]         = useState(false)
  const [lastPlanned, setLastPlanned] = useState<Date | null>(null)

  const planInputs = useRef({ boardLine, boardStation, dropLine, dropStation, isHoliday, is2nd4th })
  useEffect(() => {
    planInputs.current = { boardLine, boardStation, dropLine, dropStation, isHoliday, is2nd4th }
  }, [boardLine, boardStation, dropLine, dropStation, isHoliday, is2nd4th])

  const schedKey = getScheduleKey(now, isHoliday, is2nd4th)

  const runPlan = useCallback((
    bl: LineKey, bs: string, dl: LineKey, ds: string,
    holiday: boolean, sat2nd4th: boolean,
    currentNow: Date, scrollToResults = false
  ) => {
    const sk = getScheduleKey(currentNow, holiday, sat2nd4th)
    setError(null)
    if (bl === dl && bs === ds) {
      setError('Boarding and dropping stations are the same!')
      setJourney(null); setFare(null); setPlanned(true); return
    }
    const result = computeJourney(bl, bs, dl, ds, currentNow, sk)
    if (!result) {
      setError('No trains available at this time. Metro services typically end by 11 PM.')
      setJourney(null); setFare(null)
    } else {
      setJourney(result)
      setFare(calculateFare(bl, bs, dl, ds))
    }
    setPlanned(true)
    setLastPlanned(new Date())
    if (scrollToResults)
      setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior:'smooth', block:'start' }), 50)
  }, [])

  // Auto-replan every 60s
  useEffect(() => {
    if (!planned) return
    const id = setInterval(() => {
      const { boardLine:bl, boardStation:bs, dropLine:dl, dropStation:ds, isHoliday:h, is2nd4th:s } = planInputs.current
      runPlan(bl, bs, dl, ds, h, s, new Date(), false)
    }, 60_000)
    return () => clearInterval(id)
  }, [planned, runPlan])

  function handleBoardLineChange(l: LineKey) { setBoardLine(l); setBoardStation(LINES[l][0]); setJourney(null); setPlanned(false) }
  function handleDropLineChange(l: LineKey)  { setDropLine(l);  setDropStation(LINES[l][0]);  setJourney(null); setPlanned(false) }

  const swap = useCallback(() => {
    const pbl=boardLine, pdl=dropLine, pbs=boardStation, pds=dropStation
    setBoardLine(pdl); setBoardStation(pds); setDropLine(pbl); setDropStation(pbs)
    setJourney(null); setPlanned(false)
  }, [boardLine, dropLine, boardStation, dropStation])

  return (
    <div style={{ maxWidth:560, margin:'0 auto', paddingBottom:80 }}>
      <Header now={now} schedKey={schedKey} isHoliday={isHoliday} is2nd4th={is2nd4th} />

      <div style={{ padding:'16px 16px 0', display:'flex', flexDirection:'column', gap:14 }}>

        <LinePicker role="board" line={boardLine} station={boardStation}
          onLineChange={handleBoardLineChange}
          onStationChange={s => { setBoardStation(s); setJourney(null); setPlanned(false) }} />

        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ flex:1, height:1, background:'var(--border)' }} />
          <button onClick={swap} style={{
            background:'var(--s3)', border:'1px solid var(--border2)',
            borderRadius:8, padding:'8px 16px', fontSize:12,
            color:'var(--muted2)', cursor:'pointer', whiteSpace:'nowrap', transition:'all .15s',
          }}
          onMouseOver={e => { e.currentTarget.style.color='var(--text)'; e.currentTarget.style.borderColor='var(--purple-l)' }}
          onMouseOut={e  => { e.currentTarget.style.color='var(--muted2)'; e.currentTarget.style.borderColor='var(--border2)' }}>
            ⇅ Swap
          </button>
          <div style={{ flex:1, height:1, background:'var(--border)' }} />
        </div>

        <LinePicker role="drop" line={dropLine} station={dropStation}
          onLineChange={handleDropLineChange}
          onStationChange={s => { setDropStation(s); setJourney(null); setPlanned(false) }} />

        <DayOverride isHoliday={isHoliday} is2nd4th={is2nd4th}
          onHolidayChange={v => { setIsHoliday(v); setJourney(null); setPlanned(false) }}
          on2nd4thChange={v  => { setIs2nd4th(v);  setJourney(null); setPlanned(false) }} />

        <button onClick={() => runPlan(boardLine, boardStation, dropLine, dropStation, isHoliday, is2nd4th, now, true)}
          style={{
            background:'linear-gradient(135deg,#6d28d9,#a855f7)', border:'none', borderRadius:12,
            color:'#fff', fontSize:15, fontWeight:700, padding:15, cursor:'pointer', width:'100%',
            letterSpacing:.3, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            boxShadow:'0 4px 20px rgba(109,40,217,0.35)', transition:'box-shadow .2s',
          }}
          onMouseOver={e => (e.currentTarget.style.boxShadow='0 6px 28px rgba(109,40,217,0.55)')}
          onMouseOut={e  => (e.currentTarget.style.boxShadow='0 4px 20px rgba(109,40,217,0.35)')}>
          <span>🚇</span> Plan My Journey
        </button>
      </div>

      <div id="results" style={{ padding:'14px 16px 0', display:'flex', flexDirection:'column', gap:12 }}>

        {planned && error && (
          <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)',
            borderRadius:'var(--r)', padding:20, textAlign:'center', color:'#f87171', fontSize:13, lineHeight:1.6 }}>
            ⚠ {error}
          </div>
        )}

        {planned && journey && lastPlanned && (
          <div style={{ display:'flex', alignItems:'center', gap:6,
            fontSize:10, fontFamily:'var(--mono)', color:'var(--muted2)' }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:'#4ade80',
              display:'inline-block', animation:'pulse 2s infinite' }} />
            Last updated {lastPlanned.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
            &nbsp;· auto-refreshes every minute
          </div>
        )}

        {journey && (
          <>
            <RouteMap legs={journey.legs} />
            <JourneyResult journey={journey} />
            {fare && <FareCard fare={fare} />}
          </>
        )}
      </div>
    </div>
  )
}
