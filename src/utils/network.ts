import { LINES, LINE_ORDER, EXTRA_TRANSFERS, LINE_META, type LineKey } from '../data/lines'

/** Minutes allowed to walk between platforms at an interchange. */
export const INTERCHANGE_BUFFER = 7
/** Extra routing cost per change (expected wait), so the router prefers fewer changes. */
const TRANSFER_PENALTY = 6

export interface PathLeg {
  line: LineKey
  from: string
  to: string
}

type NodeId = string // `${line}::${station}`
const id = (line: LineKey, station: string): NodeId => `${line}::${station}`
const parse = (n: NodeId) => {
  const [line, station] = n.split('::')
  return { line: line as LineKey, station }
}

interface Edge { to: NodeId; cost: number; transfer: boolean }

// Build the network graph once from the line data.
const GRAPH: Map<NodeId, Edge[]> = (() => {
  const g = new Map<NodeId, Edge[]>()
  const add = (a: NodeId, b: NodeId, cost: number, transfer: boolean) => {
    if (!g.has(a)) g.set(a, [])
    g.get(a)!.push({ to: b, cost, transfer })
  }

  const byStation = new Map<string, LineKey[]>()
  for (const line of LINE_ORDER) {
    const stations = LINES[line]
    const ride = LINE_META[line].minsPerStop
    stations.forEach((s, i) => {
      if (!g.has(id(line, s))) g.set(id(line, s), [])
      if (!byStation.has(s)) byStation.set(s, [])
      byStation.get(s)!.push(line)
      if (i > 0) {
        add(id(line, stations[i - 1]), id(line, s), ride, false)
        add(id(line, s), id(line, stations[i - 1]), ride, false)
      }
    })
  }

  const tCost = INTERCHANGE_BUFFER + TRANSFER_PENALTY
  for (const [station, lines] of byStation) {
    for (const a of lines) for (const b of lines) {
      if (a !== b) add(id(a, station), id(b, station), tCost, true)
    }
  }
  for (const { a, b } of EXTRA_TRANSFERS) {
    add(id(a[0], a[1]), id(b[0], b[1]), tCost, true)
    add(id(b[0], b[1]), id(a[0], a[1]), tCost, true)
  }
  return g
})()

/**
 * Fastest route between two stations (by name), as a list of single-line legs.
 * Works for any number of lines / interchanges.
 */
export function findRoute(from: string, to: string): PathLeg[] | null {
  if (from === to) return null
  const starts = LINE_ORDER.filter(l => LINES[l].includes(from)).map(l => id(l, from))
  const goals = new Set(LINE_ORDER.filter(l => LINES[l].includes(to)).map(l => id(l, to)))
  if (!starts.length || !goals.size) return null

  const dist = new Map<NodeId, number>()
  const prev = new Map<NodeId, NodeId>()
  const queue: Array<[number, NodeId]> = []
  for (const s of starts) { dist.set(s, 0); queue.push([0, s]) }

  let reached: NodeId | null = null
  while (queue.length) {
    queue.sort((a, b) => a[0] - b[0])
    const [d, node] = queue.shift()!
    if (d > (dist.get(node) ?? Infinity)) continue
    if (goals.has(node)) { reached = node; break }
    for (const e of GRAPH.get(node) ?? []) {
      const nd = d + e.cost
      if (nd < (dist.get(e.to) ?? Infinity)) {
        dist.set(e.to, nd)
        prev.set(e.to, node)
        queue.push([nd, e.to])
      }
    }
  }
  if (!reached) return null

  const nodes: NodeId[] = [reached]
  while (prev.has(nodes[0])) nodes.unshift(prev.get(nodes[0])!)

  // Compress consecutive nodes on the same line into legs.
  const legs: PathLeg[] = []
  let cur: PathLeg | null = null
  for (const n of nodes) {
    const { line, station } = parse(n)
    if (!cur || cur.line !== line) {
      if (cur && cur.from !== cur.to) legs.push(cur)
      cur = { line, from: station, to: station }
    } else {
      cur.to = station
    }
  }
  if (cur && cur.from !== cur.to) legs.push(cur)
  return legs.length ? legs : null
}

/** Ordered list of stations a leg passes through, inclusive. */
export function legStations(leg: PathLeg): string[] {
  const arr = LINES[leg.line]
  const a = arr.indexOf(leg.from)
  const b = arr.indexOf(leg.to)
  return a <= b ? arr.slice(a, b + 1) : arr.slice(b, a + 1).reverse()
}
