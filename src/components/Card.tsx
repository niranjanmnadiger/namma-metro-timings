import type { ReactNode } from 'react'

interface Props {
  title: string
  icon?: string
  children: ReactNode
  style?: React.CSSProperties
}

export default function Card({ title, icon, children, style }: Props) {
  return (
    <div style={{
      background: 'var(--s1)', border: '1px solid var(--border)',
      borderRadius: 'var(--r)',
      // overflow must be visible so absolute dropdowns inside aren't clipped
      overflow: 'visible',
      ...style,
    }}>
      <div style={{
        padding: '10px 16px', fontFamily:'var(--mono)', fontSize:9,
        letterSpacing:2, textTransform:'uppercase', color:'var(--muted2)',
        borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:8,
        // header still needs clip so its own border-radius corners show cleanly
        borderRadius: 'var(--r) var(--r) 0 0',
        overflow: 'hidden',
      }}>
        {icon && <span>{icon}</span>}
        {title}
      </div>
      <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:12 }}>
        {children}
      </div>
    </div>
  )
}
