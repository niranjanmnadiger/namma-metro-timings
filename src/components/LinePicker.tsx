import { useState, useRef, useEffect, useCallback } from 'react'
import { LINES, LINE_COLORS, type LineKey } from '../data/lines'
import Card from './Card'

interface Props {
  role: 'board' | 'drop'
  line: LineKey
  station: string
  onLineChange: (l: LineKey) => void
  onStationChange: (s: string) => void
}

const LINE_LABELS: Record<LineKey, string> = {
  purple: 'Purple', green: 'Green', yellow: 'Yellow',
}

interface DropdownPos { top: number; left: number; width: number }

export default function LinePicker({ role, line, station, onLineChange, onStationChange }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen]   = useState(false)
  const [pos, setPos]     = useState<DropdownPos | null>(null)
  const triggerRef        = useRef<HTMLButtonElement>(null)
  const dropdownRef       = useRef<HTMLDivElement>(null)
  const inputRef          = useRef<HTMLInputElement>(null)

  const icon  = role === 'board' ? '⬆' : '⬇'
  const title = role === 'board' ? 'Boarding Station' : 'Dropping Station'
  const c     = LINE_COLORS[line]

  const filtered = LINES[line].filter(s =>
    !query.trim() || s.toLowerCase().includes(query.toLowerCase())
  )

  // Calculate position of the fixed dropdown from the trigger button
  const calcPos = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
  }, [])

  function openDropdown() {
    calcPos()
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 30)
  }

  function closeDropdown() {
    setOpen(false)
    setQuery('')
  }

  function pickStation(s: string) {
    onStationChange(s)
    closeDropdown()
  }

  function handleLineChange(l: LineKey) {
    onLineChange(l)
    onStationChange(LINES[l][0])
    setQuery('')
    setOpen(false)
  }

  // Close on outside click — but only if click is outside BOTH trigger and dropdown
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      const target = e.target as Node
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return
      closeDropdown()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Reposition on scroll/resize
  useEffect(() => {
    if (!open) return
    function update() { calcPos() }
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, calcPos])

  return (
    <Card title={title} icon={icon}>

      {/* ── Line tabs ── */}
      <div>
        <span style={{ display:'block', fontSize:9, fontFamily:'var(--mono)',
          letterSpacing:1.5, textTransform:'uppercase', color:'var(--muted2)', marginBottom:6 }}>
          Select Line
        </span>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:5 }}>
          {(['purple','green','yellow'] as LineKey[]).map(l => {
            const active = line === l
            const lc = LINE_COLORS[l]
            return (
              <button key={l} onClick={() => handleLineChange(l)} style={{
                border: `1.5px solid ${active ? lc.dot : 'var(--border)'}`,
                background: active ? lc.bg : 'var(--s2)',
                borderRadius: 10, padding: '9px 4px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700,
                color: lc.text, cursor: 'pointer', transition: 'all .18s', letterSpacing: .5,
              }}>
                <div style={{ width:20, height:3, borderRadius:2, background:lc.dot }} />
                {LINE_LABELS[l].toUpperCase()}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Station trigger button ── */}
      <div>
        <span style={{ display:'block', fontSize:9, fontFamily:'var(--mono)',
          letterSpacing:1.5, textTransform:'uppercase', color:'var(--muted2)', marginBottom:6 }}>
          Station
        </span>
        <button
          ref={triggerRef}
          onClick={() => open ? closeDropdown() : openDropdown()}
          style={{
            width: '100%', background: 'var(--s2)',
            border: `1.5px solid ${open ? c.dot : 'var(--border2)'}`,
            borderRadius: 9, color: 'var(--text)', padding: '10px 12px',
            fontSize: 13, textAlign: 'left', cursor: 'pointer',
            transition: 'border-color .15s', fontFamily: 'var(--sans)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          }}
        >
          <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>
            {station}
          </span>
          <span style={{
            fontSize: 9, color: open ? c.dot : 'var(--muted2)', flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform .2s, color .15s',
          }}>▼</span>
        </button>
      </div>

      {/* ── Dropdown portal — fixed so it escapes all overflow:hidden parents ── */}
      {open && pos && (
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            width: pos.width,
            zIndex: 9999,
            background: 'var(--s2)',
            border: `1.5px solid ${c.dot}`,
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
          }}
        >
          {/* Search */}
          <div style={{ padding:'8px 10px', borderBottom:'1px solid var(--border)' }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search station…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%', background: 'var(--s3)',
                border: '1px solid var(--border)', borderRadius: 7,
                color: 'var(--text)', padding: '7px 10px',
                fontSize: 13, outline: 'none', fontFamily: 'var(--sans)',
              }}
            />
          </div>

          {/* Station list */}
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding:14, textAlign:'center', fontSize:11,
                color:'var(--muted2)', fontFamily:'var(--mono)' }}>
                No stations match "{query}"
              </div>
            ) : (
              filtered.map((s, i) => {
                const isSel = s === station
                return (
                  <button
                    key={s}
                    onClick={() => pickStation(s)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '9px 14px',
                      background: isSel ? c.bg : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                      border: 'none',
                      borderBottom: '1px solid var(--border)',
                      color: isSel ? c.text : 'var(--text)',
                      fontSize: 13, cursor: 'pointer', fontFamily: 'var(--sans)',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                      background: isSel ? c.dot : 'transparent',
                      border: isSel ? 'none' : `1px solid var(--border)`,
                    }} />
                    <span>{s}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
