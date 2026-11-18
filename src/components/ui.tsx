import type { CSSProperties, ReactNode } from 'react'
import { LINE_META, type LineKey } from '../data/lines'

/** Exposes a line's colour as --lc, using the themed token when the stylesheet defines one. */
export const lineVars = (line: LineKey): CSSProperties =>
  ({ '--lc': `var(--line-${line}, ${LINE_META[line].color})` } as CSSProperties)

export function LineMark({ line, suffix = '' }: { line: LineKey; suffix?: string }) {
  return <span className="line-mark" style={lineVars(line)}>{LINE_META[line].name}{suffix}</span>
}

export function LineDots({ lines }: { lines: LineKey[] }) {
  return (
    <span className="line-dots" role="img" aria-label={lines.map(l => `${LINE_META[l].name} Line`).join(', ')}>
      {lines.map(l => <span key={l} style={lineVars(l)} />)}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Icons: 24px grid, 1.75 stroke, inherit currentColor. Decorative by default.
// ---------------------------------------------------------------------------
type IconProps = { size?: number }
const icon = (size: number, children: ReactNode) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {children}
  </svg>
)

export const SwapIcon = ({ size = 18 }: IconProps) => icon(size, <path d="M7 4v16m0-16L3.5 7.5M7 4l3.5 3.5M17 20V4m0 16-3.5-3.5M17 20l3.5-3.5" />)
export const SearchIcon = ({ size = 18 }: IconProps) => icon(size, <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>)
export const CloseIcon = ({ size = 16 }: IconProps) => icon(size, <path d="M6 6l12 12M18 6 6 18" />)
export const ChevronRight = ({ size = 14 }: IconProps) => icon(size, <path d="m9 6 6 6-6 6" />)
export const ArrowRight = ({ size = 16 }: IconProps) => icon(size, <path d="M4 12h15m-5-5 5 5-5 5" />)
export const SunIcon = ({ size = 18 }: IconProps) => icon(size, <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></>)
export const MoonIcon = ({ size = 18 }: IconProps) => icon(size, <path d="M20 14.2A8 8 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2Z" />)
