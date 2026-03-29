import type { Journey } from '../utils/schedule'
import { fmtTime, durStr, INTERCHANGE_BUFFER } from '../utils/schedule'
import { LINE_COLORS } from '../data/lines'

interface Props { journey: Journey }

function minsToTime(mins: number): string {
  const h24 = Math.floor(((mins % 1440) + 1440) % 1440 / 60)
  const mm   = ((mins % 1440) + 1440) % 1440 % 60
  const suf  = h24 >= 12 ? 'PM' : 'AM'
  const h12  = h24 % 12 || 12
  return `${String(h12).padStart(2,'0')}:${String(mm).padStart(2,'0')} ${suf}`
}

export default function JourneyResult({ journey }: Props) {
  const { legs, schedKey, firstTrain, finalArrive, totalMins } = journey

  return (
    <div className="animate-fadeUp" style={{ display:'flex', flexDirection:'column', gap:12 }}>

      {/* ── TIMELINE ── */}
      <div style={{
        background:'var(--s1)', border:'1px solid var(--border)',
        borderRadius:'var(--r)', overflow:'hidden',
      }}>
        <div style={{ padding:'10px 16px', fontFamily:'var(--mono)', fontSize:9,
          letterSpacing:2, textTransform:'uppercase', color:'var(--muted2)',
          borderBottom:'1px solid var(--border)' }}>
          🗺 &nbsp;Journey Timeline
        </div>
        <div style={{ padding:'14px 16px' }}>
          {legs.map((leg, i) => {
            const c = LINE_COLORS[leg.line]
            const isLast = i === legs.length - 1
            return (
              <div key={i}>
                {/* departure row */}
                <div style={{ display:'flex', gap:12 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:16, flexShrink:0 }}>
                    <div style={{
                      width:10, height:10, borderRadius:'50%', marginTop:5, flexShrink:0,
                      border: `2px solid ${leg.isInterchange ? '#fde047' : c.dot}`,
                      background: leg.isInterchange ? 'rgba(234,179,8,0.15)' : c.bg,
                    }} />
                    <div style={{
                      flex:1, width:2, minHeight:14, margin:'2px auto',
                      background:`linear-gradient(180deg,${c.dot}80,${c.dot}20)`,
                    }} />
                  </div>
                  <div style={{ flex:1, paddingBottom:14 }}>
                    <div style={{ fontSize:13, fontWeight:700, marginTop:2 }}>{leg.from}</div>
                    <div style={{ fontSize:10, color:'var(--muted2)', fontFamily:'var(--mono)', marginTop:2 }}>
                      {leg.line.charAt(0).toUpperCase() + leg.line.slice(1)} Line
                      {leg.isInterchange && ' · 🔄 Interchange'}
                    </div>
                    <div style={{ fontFamily:'var(--mono)', fontSize:11, fontWeight:700, marginTop:4, color: c.text }}>
                      Board {fmtTime(leg.trainTime)} &nbsp;·&nbsp; Towards {leg.term}
                    </div>
                    <div style={{ fontSize:10, color:'var(--muted2)', fontFamily:'var(--mono)', marginTop:3 }}>
                      {leg.stops} stop{leg.stops !== 1 ? 's' : ''} &nbsp;·&nbsp; ~{leg.travelMins} min ride
                    </div>
                  </div>
                </div>
                {/* arrival row (last leg only) */}
                {isLast && (
                  <div style={{ display:'flex', gap:12 }}>
                    <div style={{ width:16, flexShrink:0, display:'flex', justifyContent:'center' }}>
                      <div style={{
                        width:10, height:10, borderRadius:'50%', marginTop:5,
                        background: c.dot, border:`2px solid ${c.dot}`,
                      }} />
                    </div>
                    <div style={{ flex:1, paddingBottom:4 }}>
                      <div style={{ fontSize:13, fontWeight:700, marginTop:2 }}>{leg.to}</div>
                      <div style={{ fontFamily:'var(--mono)', fontSize:11, fontWeight:700, marginTop:4, color:'var(--green-ll)' }}>
                        Arrive ~{fmtTime(leg.reach)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── SUMMARY ── */}
      <div style={{
        background:'linear-gradient(135deg,rgba(109,40,217,0.12),rgba(21,128,61,0.08))',
        border:'1px solid rgba(168,85,247,0.2)', borderRadius:'var(--r)', padding:16,
      }}>
        <div style={{ fontFamily:'var(--mono)', fontSize:8, letterSpacing:2.5,
          textTransform:'uppercase', color:'var(--muted2)', marginBottom:12 }}>
          Journey Summary
        </div>

        {/* big times */}
        <div style={{ display:'flex', marginBottom:14, background:'var(--s1)',
          borderRadius:10, overflow:'hidden', border:'1px solid var(--border)' }}>
          {[
            { label:'Board at',  val: fmtTime(firstTrain),  color:'var(--purple-ll)', sub: legs[0].from },
            { label:'Arrive by', val: fmtTime(finalArrive), color:'var(--green-ll)',  sub: legs[legs.length-1].to },
          ].map(({ label, val, color, sub }) => (
            <div key={label} style={{ flex:1, padding:'12px 14px',
              borderRight: label==='Board at' ? '1px solid var(--border)' : undefined }}>
              <span style={{ display:'block', fontSize:8, fontFamily:'var(--mono)',
                letterSpacing:1.5, textTransform:'uppercase', color:'var(--muted2)', marginBottom:4 }}>
                {label}
              </span>
              <div style={{ fontFamily:'var(--mono)', fontSize:22, fontWeight:700, lineHeight:1, color }}>{val}</div>
              <div style={{ fontSize:10, color:'var(--muted2)', marginTop:3 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* meta rows */}
        {[
          { label:'Total duration',  val: `~${durStr(totalMins)}` },
          { label:'Interchanges',    val: legs.length > 1 ? `${legs.length-1} change${legs.length>2?'s':''}` : 'Direct — no change' },
          { label:'Total stops',     val: String(legs.reduce((a,l) => a+l.stops, 0)) },
          { label:'Schedule',        val: schedKey.charAt(0).toUpperCase() + schedKey.slice(1) },
          ...(legs[0].waitMins > 0 ? [{ label:'Wait for first train', val:`~${legs[0].waitMins} min` }] : []),
        ].map(({ label, val }) => (
          <div key={label} style={{ display:'flex', justifyContent:'space-between',
            alignItems:'center', padding:'6px 0', borderBottom:'1px solid var(--border)' }}>
            <span style={{ fontSize:11, color:'var(--muted2)' }}>{label}</span>
            <span style={{ fontSize:12, fontFamily:'var(--mono)', fontWeight:700 }}>{val}</span>
          </div>
        ))}
      </div>

      {/* ── LEG CARDS ── */}
      {legs.map((leg, i) => {
        const c = LINE_COLORS[leg.line]
        const lineName = leg.line.charAt(0).toUpperCase() + leg.line.slice(1)
        return (
          <div key={i} style={{ border:'1px solid var(--border)', borderRadius:'var(--r)', overflow:'hidden' }}>

            {/* leg header */}
            <div style={{
              padding:'11px 15px', display:'flex', alignItems:'center', gap:9,
              fontWeight:700, fontSize:11, fontFamily:'var(--mono)',
              background: c.bg, borderBottom:`1px solid ${c.border}`,
            }}>
              <div style={{ width:9, height:9, borderRadius:'50%', background:c.dot, flexShrink:0 }} />
              LEG {i+1} OF {legs.length} &nbsp;·&nbsp; {leg.line.toUpperCase()} LINE
            </div>

            <div style={{ background:'var(--s1)', padding:'12px 15px',
              display:'flex', flexDirection:'column', gap:7 }}>

              {/* interchange alert */}
              {leg.isInterchange && (
                <div style={{
                  background:'rgba(234,179,8,0.08)', border:'1px solid rgba(234,179,8,0.25)',
                  borderRadius:9, padding:'9px 12px', fontSize:11, color:'#fde047',
                  lineHeight:1.5, marginBottom:4,
                }}>
                  🔄 <strong style={{ color:'#fbbf24' }}>Interchange at {leg.from}</strong><br/>
                  Walk to the <strong>{lineName} Line</strong> platform. Next train at{' '}
                  <strong>{fmtTime(leg.trainTime)}</strong>. Allow ~{INTERCHANGE_BUFFER} min.
                </div>
              )}

              {/* wait pill */}
              {i === 0 && leg.waitMins > 0 && (
                <div>
                  <span style={{
                    display:'inline-flex', alignItems:'center', gap:4,
                    background:'rgba(234,179,8,0.08)', border:'1px solid rgba(234,179,8,0.2)',
                    borderRadius:20, padding:'2px 8px', fontSize:10,
                    fontFamily:'var(--mono)', color:'#fde047', marginBottom:2,
                  }}>
                    ⏱ Wait ~{leg.waitMins} min for next train
                  </span>
                </div>
              )}

              {/* leg details */}
              {[
                { label:'From',      val: leg.from },
                { label:'To',        val: leg.to },
                { label:'Direction', val: `${leg.forward?'→':'←'} Towards ${leg.term}`, mono:true, muted:true },
              ].map(({ label, val, mono, muted }) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between',
                  alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:9, fontFamily:'var(--mono)', letterSpacing:1,
                    color:'var(--muted2)', textTransform:'uppercase', flexShrink:0 }}>{label}</span>
                  <span style={{
                    fontSize: mono ? 10 : 12, textAlign:'right', lineHeight:1.35,
                    fontFamily: mono ? 'var(--mono)' : undefined,
                    color: muted ? 'var(--muted2)' : undefined,
                    background: muted ? 'rgba(255,255,255,0.04)' : undefined,
                    border: muted ? '1px solid var(--border)' : undefined,
                    borderRadius: muted ? 5 : undefined,
                    padding: muted ? '2px 7px' : undefined,
                  }}>{val}</span>
                </div>
              ))}

              <div style={{ height:1, background:'var(--border)', margin:'3px 0' }} />

              {[
                { label:'Board at',   val: fmtTime(leg.trainTime), color:'var(--purple-ll)' },
                { label:'Stops',      val: String(leg.stops) },
                { label:'Ride time',  val: `~${leg.travelMins} min` },
                { label:'Alight at',  val: fmtTime(leg.reach), color:'var(--green-ll)' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between',
                  alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:9, fontFamily:'var(--mono)', letterSpacing:1,
                    color:'var(--muted2)', textTransform:'uppercase', flexShrink:0 }}>{label}</span>
                  <span style={{
                    fontSize:12, fontFamily:'var(--mono)', fontWeight:700,
                    color: color ?? 'var(--text)',
                  }}>{val}</span>
                </div>
              ))}

              {/* next 3 trains */}
              {leg.upcomingTrains.length > 0 && (
                <div style={{ marginTop:4 }}>
                  <div style={{ fontSize:9, fontFamily:'var(--mono)', letterSpacing:1,
                    color:'var(--muted2)', textTransform:'uppercase', marginBottom:6 }}>
                    Next trains from {leg.from}
                  </div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {leg.upcomingTrains.map((m, j) => (
                      <span key={j} style={{
                        fontFamily:'var(--mono)', fontSize:11, fontWeight:700,
                        padding:'4px 10px', borderRadius:20,
                        background: j===0 ? c.bg : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${j===0 ? c.border : 'var(--border)'}`,
                        color: j===0 ? c.text : 'var(--muted2)',
                      }}>
                        {j===0 && '→ '}{minsToTime(m)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )
      })}
    </div>
  )
}
