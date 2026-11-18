import { useEffect, useMemo, useRef, useState } from 'react'
import { LINES, LINE_META, LINE_ORDER, STATIONS, STATION_ALIASES, type LineKey, type StationInfo } from '../data/lines'
import { CloseIcon, LineMark, SearchIcon, lineVars } from './ui'

interface Props {
  title: string
  selected: string | null
  recents: string[]
  onPick: (station: string) => void
  onClose: () => void
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

/** Relevance score for a query; 0 means no match. */
function score(st: StationInfo, q: string): number {
  const name = norm(st.name)
  const aliases = (STATION_ALIASES[st.name] ?? []).map(norm)
  if (name.startsWith(q)) return 3
  if (aliases.some(a => a.startsWith(q))) return 2.5
  if (name.split(' ').some(w => w.startsWith(q))) return 2
  if (name.includes(q) || aliases.some(a => a.includes(q))) return 1
  if (name.replace(/ /g, '').includes(q.replace(/ /g, ''))) return 0.5
  return 0
}

export default function StationPicker({ title, selected, recents, onPick, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<LineKey | 'all'>('all')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Focus the search field, lock page scroll, restore focus on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    inputRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev; opener?.focus() }
  }, [])

  const results = useMemo(() => {
    const q = norm(query)
    const pool = filter === 'all'
      ? STATIONS
      : LINES[filter].map(n => STATIONS.find(s => s.name === n)!)
    if (!q) return pool
    return pool
      .map(s => ({ s, sc: score(s, q) }))
      .filter(x => x.sc > 0)
      .sort((a, b) => b.sc - a.sc)
      .map(x => x.s)
  }, [query, filter])

  const showRecents = !query && filter === 'all' && recents.length > 0
  const recentInfos = showRecents
    ? (recents.map(r => STATIONS.find(s => s.name === r)).filter(Boolean) as StationInfo[])
    : []
  const flat = [...recentInfos, ...results]

  useEffect(() => setActive(0), [query, filter])
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, flat.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter' && flat[active]) { e.preventDefault(); onPick(flat[active].name) }
  }

  const option = (s: StationInfo, idx: number) => (
    <button key={`${idx}-${s.name}`} type="button" className="option" role="option" id={`opt-${idx}`}
      data-idx={idx} data-active={idx === active} aria-selected={s.name === selected}
      onMouseEnter={() => setActive(idx)} onClick={() => onPick(s.name)}>
      <span className="option-name">{s.name}</span>
      <span className="option-lines">{s.lines.map(l => <LineMark key={l} line={l} />)}</span>
    </button>
  )

  return (
    <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }} onKeyDown={onKey}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="picker-title">
        <div className="sheet-head">
          <div className="sheet-title">
            <h2 id="picker-title">{title}</h2>
            <button type="button" className="close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
          </div>
          <label className="search">
            <SearchIcon />
            <span className="sr-only">Search stations</span>
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search stations" autoComplete="off" spellCheck={false}
              role="combobox" aria-expanded="true" aria-controls="station-results"
              aria-activedescendant={flat.length ? `opt-${active}` : undefined} />
            {query && (
              <button type="button" className="close" onClick={() => setQuery('')} aria-label="Clear search">
                <CloseIcon size={12} />
              </button>
            )}
          </label>
          <div className="filters" role="group" aria-label="Filter by line">
            <button type="button" className="pill" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All lines</button>
            {LINE_ORDER.map(l => (
              <button type="button" key={l} className="pill" aria-pressed={filter === l} onClick={() => setFilter(l)}>
                <span className="line-dots" aria-hidden="true"><span style={lineVars(l)} /></span>
                {LINE_META[l].name}
              </button>
            ))}
          </div>
        </div>

        <div className="results" id="station-results" role="listbox" aria-label="Stations" ref={listRef}>
          {showRecents && <div className="label" role="presentation">Recent</div>}
          {recentInfos.map((s, i) => option(s, i))}
          {showRecents && <div className="label" role="presentation">All stations</div>}
          {results.length === 0
            ? <p className="empty">No stations match “{query}”.</p>
            : results.map((s, i) => option(s, i + recentInfos.length))}
        </div>
      </div>
    </div>
  )
}
