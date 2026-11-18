import { STATION_LINES } from '../data/lines'
import { LineDots, SwapIcon } from './ui'

type Which = 'from' | 'to'

interface Props {
  from: string | null
  to: string | null
  openPicker: Which | null
  onOpenPicker: (which: Which) => void
  onSwap: () => void
  holiday: boolean
  onHoliday: (v: boolean) => void
  scheduleText: string
}

function Field({ which, value, expanded, onOpen }: { which: Which; value: string | null; expanded: boolean; onOpen: () => void }) {
  const label = which === 'from' ? 'From' : 'To'
  return (
    <button type="button" className="field" onClick={onOpen} aria-haspopup="dialog" aria-expanded={expanded}>
      <span className="label">{label}</span>
      <span className="field-value">
        <span className={`field-name${value ? '' : ' is-empty'}`}>
          {value ?? (which === 'from' ? 'Choose a station' : 'Choose a destination')}
        </span>
        {value && <LineDots lines={STATION_LINES[value] ?? []} />}
      </span>
    </button>
  )
}

export default function Planner(p: Props) {
  return (
    <section className="panel panel-pad" aria-label="Plan a trip">
      <div className="od">
        <Field which="from" value={p.from} expanded={p.openPicker === 'from'} onOpen={() => p.onOpenPicker('from')} />
        <button type="button" className="swap" onClick={p.onSwap} aria-label="Swap origin and destination">
          <SwapIcon />
        </button>
        <Field which="to" value={p.to} expanded={p.openPicker === 'to'} onOpen={() => p.onOpenPicker('to')} />
      </div>

      <div className="controls">
        <button type="button" className="switch" role="switch" aria-checked={p.holiday} onClick={() => p.onHoliday(!p.holiday)}>
          <span className="switch-track" aria-hidden="true" />
          Public holiday
        </button>

        <span className="status meta" aria-live="polite">{p.scheduleText}</span>
      </div>
    </section>
  )
}
