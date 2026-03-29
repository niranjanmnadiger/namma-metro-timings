import type { FareResult } from '../utils/fare'

interface Props { fare: FareResult }

export default function FareCard({ fare }: Props) {
  return (
    <div style={{
      background: 'var(--s1)', border: '1px solid var(--border)',
      borderRadius: 'var(--r)', overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 16px', fontFamily: 'var(--mono)', fontSize: 9,
        letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted2)',
        borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        &nbsp;Fare Estimate
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* main fare display */}
        <div style={{
          display: 'flex', gap: 8,
        }}>
          <FareTile
            label="Token / QR"
            amount={`₹${fare.tokenFare}`}
            sub={`~${fare.distanceKm} km`}
            highlight
          />
          <FareTile
            label="Smart Card"
            amount={`₹${fare.smartCardFare}`}
            sub="5% discount"
          />
        </div>

        {/* slab info */}
        <div style={{
          fontSize: 10, color: 'var(--muted2)', fontFamily: 'var(--mono)',
          lineHeight: 1.6, padding: '8px 10px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 8, border: '1px solid var(--border)',
        }}>
          <FareSlab distanceKm={fare.distanceKm} />
        </div>

        <div style={{
          fontSize: 10, color: 'var(--muted2)', lineHeight: 1.5,
        }}>
          💡 Smart card holders get 10% off. Top up at any station's TVMs or the Namma Metro app.
        </div>
      </div>
    </div>
  )
}

function FareTile({
  label, amount, sub, highlight,
}: {
  label: string; amount: string; sub: string; highlight?: boolean
}) {
  return (
    <div style={{
      flex: 1, padding: '12px 14px', borderRadius: 10,
      background: highlight ? 'rgba(109,40,217,0.1)' : 'var(--s2)',
      border: `1px solid ${highlight ? 'rgba(168,85,247,0.3)' : 'var(--border)'}`,
    }}>
      <div style={{
        fontSize: 8, fontFamily: 'var(--mono)', letterSpacing: 1.5,
        textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: 4,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 700, lineHeight: 1,
        color: highlight ? 'var(--purple-ll)' : 'var(--text)',
      }}>{amount}</div>
      <div style={{ fontSize: 10, color: 'var(--muted2)', marginTop: 4 }}>{sub}</div>
    </div>
  )
}

const SLABS = [
  { maxKm: 2, fare: 10 }, { maxKm: 4, fare: 20 }, { maxKm: 6, fare: 25 },
  { maxKm: 10, fare: 30 }, { maxKm: 15, fare: 35 }, { maxKm: 20, fare: 40 },
  { maxKm: 25, fare: 45 }, { maxKm: 30, fare: 50 }, { maxKm: 35, fare: 55 },
]

function FareSlab({ distanceKm }: { distanceKm: number }) {
  const activeIdx = SLABS.findIndex(s => distanceKm <= s.maxKm)

  return (
    <div>
      <div style={{ marginBottom: 6, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' }}>
        Fare slabs
      </div>
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {SLABS.map((s, i) => {
          const lo = i === 0 ? 0 : SLABS[i - 1].maxKm
          const isActive = i === activeIdx
          return (
            <div key={i} style={{
              padding: '3px 6px', borderRadius: 5, fontSize: 9,
              fontFamily: 'var(--mono)',
              background: isActive ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isActive ? 'rgba(168,85,247,0.5)' : 'var(--border)'}`,
              color: isActive ? 'var(--purple-ll)' : 'var(--muted)',
              fontWeight: isActive ? 700 : 400,
            }}>
              {lo}–{s.maxKm}km · ₹{s.fare}
            </div>
          )
        })}
      </div>
    </div>
  )
}
