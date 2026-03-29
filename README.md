# Namma Metro Trip Planner

React + Vite + TypeScript app for planning Bengaluru Namma Metro trips.

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  data/
    lines.ts         # All station lists for Purple, Green, Yellow lines
    timetable.ts     # Full headway windows for weekday / Saturday / Sunday
  utils/
    schedule.ts      # All logic: next train, journey computation, path building
  hooks/
    useClock.ts      # Live clock hook (re-renders every second)
  components/
    Header.tsx       # Live clock display + schedule badge
    Card.tsx         # Reusable card shell
    LinePicker.tsx   # Line tab selector + station search + dropdown
    DayOverride.tsx  # Holiday / 2nd-4th-Saturday checkboxes
    JourneyResult.tsx# Timeline, summary, leg cards, next 3 trains
  App.tsx            # Root — wires all state and components
  main.tsx
  index.css          # CSS variables / global reset
```

## Features

- **Live clock** — updates every second, shows current date/time/day
- **Smart schedule** — auto-detects weekday / Saturday / Sunday
- **Day overrides** — checkboxes for Public Holiday and 2nd/4th Saturday (both switch to Sunday timetable)
- **Station search** — type to filter stations within the selected line
- **All interchange cases** — Purple↔Green (Majestic), Green↔Yellow (RV Road), Purple→Green→Yellow (3-leg)
- **Journey timeline** — visual route overview before detailed leg cards
- **Next 3 trains** — shown per leg so you can plan if you miss the first one
- **Swap** — one tap to flip boarding ↔ dropping
- **Direction-aware** — forward vs reverse direction uses correct timetable windows