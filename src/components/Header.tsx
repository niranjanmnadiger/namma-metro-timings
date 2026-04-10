import type { ScheduleKey } from '../data/timetable'
import { scheduleLabel } from '../utils/schedule'

interface Props {
  now: Date
  schedKey: ScheduleKey
  isHoliday: boolean
  is2nd4th: boolean
}

const BADGE_STYLE: Record<ScheduleKey, React.CSSProperties> = {
  monday: { background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.35)', color: '#a5b4fc' },
  weekday: { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' },
  saturday: { background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: '#fde047' },
  sunday: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' },
}

const PULSE_COLOR: Record<ScheduleKey, string> = {
  monday: '#a5b4fc', weekday: '#4ade80', saturday: '#fde047', sunday: '#f87171',
}

export default function Header({ now, schedKey, isHoliday, is2nd4th }: Props) {
  const label = scheduleLabel(schedKey, now, isHoliday, is2nd4th)

  return (
    <header style={{
      background: 'linear-gradient(160deg,#0e0520 0%,#0a1505 55%,#120e00 100%)',
      borderBottom: '1px solid var(--border)',
      padding: '24px 18px 18px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* glow blobs */}
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 260, height: 260,
        background: 'radial-gradient(circle,rgba(123,47,190,0.18) 0%,transparent 65%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: -40, left: '30%', width: 200, height: 200,
        background: 'radial-gradient(circle,rgba(22,163,74,0.1) 0%,transparent 65%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 3, color: 'var(--muted2)',
        textTransform: 'uppercase', marginBottom: 6
      }}>
        ನಮ್ಮ ಮೆಟ್ರೋ ಬೆಂಗಳೂರು | Namma Metro Bengaluru
      </div>

      <h1 style={{
        margin: 0,
        fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
        fontWeight: 600,
        letterSpacing: '-0.04em',
        lineHeight: 1.2,
        color: '#f5f5f7',
      }}>
        <span style={{ display: 'block' }}>ನಮ್ಮ ಮೆಟ್ರೋ</span>
        <span style={{ display: 'block', color: '#b48eff' }}>Trip Planner</span>
      </h1>

      {/* clock chips */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'Date', value: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
          { label: 'Time', value: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
          { label: 'Day', value: now.toLocaleDateString('en-IN', { weekday: 'long' }) },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '8px 12px', fontFamily: 'var(--mono)',
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            <span style={{ fontSize: 8, color: 'var(--muted2)', letterSpacing: 1.5, textTransform: 'uppercase' }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* schedule badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10,
        padding: '5px 11px', borderRadius: 20, fontFamily: 'var(--mono)',
        fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
        ...BADGE_STYLE[schedKey],
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: PULSE_COLOR[schedKey],
          animation: 'pulse 2s infinite',
          display: 'inline-block',
        }} />
        {label}
      </div>

      {/* disclaimer banner */}
      <div style={{
        marginTop: 14,
        padding: '10px 13px',
        borderRadius: 10,
        background: 'rgba(234,179,8,0.05)',
        border: '1px solid rgba(234,179,8,0.18)',
        fontFamily: 'var(--mono)',
        fontSize: 10,
        color: 'rgba(253,224,71,0.65)',
        lineHeight: 1.65,
        letterSpacing: 0.2,
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5, color: 'rgba(253,224,71,0.85)', fontSize: 9 }}>
          heads up — static timetable
        </div>
        Times shown are <strong style={{ color: 'rgba(253,224,71,0.85)' }}>estimates</strong> based on BMRC's published headway windows (last synced Apr 2025).
        Actual trains may arrive earlier or later due to operational variability, signal holds, or last-minute schedule changes.
        <span style={{ display: 'block', marginTop: 5 }}>
          Also: BMRC runs <strong style={{ color: 'rgba(253,224,71,0.85)' }}>short-loop trains</strong> on L1 (Purple) during peak hours — e.g. Kempegowda to Baiyappanahalli — which share the main track and effectively increase frequency in the central corridor. This app does not yet model those loops, so peak-hour estimates for inner-city Purple Line journeys may show longer waits than reality. Loop support is planned for a future update.
        </span>
        <span style={{ display: 'block', marginTop: 5 }}>
          Always cross-check at <a href="https://www.bmrc.co.in" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(253,224,71,0.9)', textDecoration: 'underline' }}>bmrc.co.in</a> or the official Namma Metro app.
        </span>
      </div>
    </header>
  )
}