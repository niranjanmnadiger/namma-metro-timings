import Card from './Card'

interface Props {
  isHoliday: boolean
  is2nd4th: boolean
  onHolidayChange: (v: boolean) => void
  on2nd4thChange: (v: boolean) => void
}

interface CbxProps {
  checked: boolean
  onChange: (v: boolean) => void
  title: string
  sub: string
}

function Checkbox({ checked, onChange, title, sub }: CbxProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '12px 14px', borderRadius: 10,
        border: checked ? '1.5px solid rgba(168,85,247,0.5)' : '1.5px solid var(--border)',
        background: checked ? 'rgba(109,40,217,0.1)' : 'var(--s2)',
        cursor: 'pointer', transition: 'all .18s', textAlign: 'left', width: '100%',
      }}
    >
      {/* box */}
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        border: checked ? '2px solid var(--purple-l)' : '2px solid var(--border2)',
        background: checked ? 'var(--purple-l)' : 'var(--s3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .18s',
      }}>
        {checked && <span style={{ fontSize: 12, fontWeight: 700, color: 'white', lineHeight: 1 }}>✓</span>}
      </div>
      {/* labels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: checked ? 'var(--purple-ll)' : 'var(--text)',
        }}>{title}</span>
        <span style={{
          fontSize: 10, fontFamily: 'var(--mono)', letterSpacing: .5,
          color: checked ? 'rgba(168,85,247,0.8)' : 'var(--muted2)',
        }}>{sub}</span>
      </div>
    </button>
  )
}

export default function DayOverride({ isHoliday, is2nd4th, onHolidayChange, on2nd4thChange }: Props) {
  return (
    <Card title="Day Override" >
      <Checkbox
        checked={isHoliday}
        onChange={onHolidayChange}
        title="Today is a Public Holiday"
        sub="Uses Sunday timetable"
      />
      <Checkbox
        checked={is2nd4th}
        onChange={on2nd4thChange}
        title="Today is a 2nd or 4th Saturday"
        sub="Uses Sunday timetable"
      />
    </Card>
  )
}
