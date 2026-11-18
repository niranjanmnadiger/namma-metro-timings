import { FARE_SLABS, SMART_CARD_DISCOUNT, type FareResult } from '../utils/fare'

const inr = (n: number) => `₹${Number.isInteger(n) ? n : n.toFixed(2)}`

export default function FareCard({ fare }: { fare: FareResult }) {
  return (
    <section className="panel panel-pad reveal" aria-label="Fare">
      <div className="panel-head">
        <h3>Fare</h3>
        <span className="meta">About {fare.distanceKm} km</span>
      </div>

      <div className="fare-figure">{inr(fare.fare)}</div>
      <span className="label" style={{ display: 'block', marginTop: 8 }}>Token or QR ticket</span>

      <div className="fare-rows">
        <div className="fare-row"><span>Smart card ({SMART_CARD_DISCOUNT * 100}% off)</span><span className="mono">{inr(fare.smartCardFare)}</span></div>
      </div>

      {!fare.officialChart && (
        <div className="slabs" aria-label="Fare by distance">
          {FARE_SLABS.map((s, i) => (
            <div key={i} className={`slab${i === fare.slabIndex ? ' on' : ''}`} aria-current={i === fare.slabIndex ? 'true' : undefined}>
              <b>₹{s.fare}</b>
              {s.maxKm === Infinity ? `${s.minKm}+ km` : `${s.minKm}–${s.maxKm} km`}
            </div>
          ))}
        </div>
      )}

      <p className="note">
        {fare.officialChart
          ? `From the official ${fare.officialChart} Line fare chart.`
          : 'Distance is estimated from average station spacing, so the fare may differ by one slab.'}
        <sup className="fn">2</sup>
      </p>
    </section>
  )
}
