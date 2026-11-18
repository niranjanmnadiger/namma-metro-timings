import type { Theme } from '../hooks'
import { MoonIcon, SunIcon } from './ui'

interface Props { now: Date; theme: Theme; onToggleTheme: () => void }

export default function GlobalNav({ now, theme, onToggleTheme }: Props) {
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <nav className="globalnav" aria-label="Global">
      <div className="wrap">
        <a className="wordmark" href="./" aria-label="Namma Metro Trip Planner, home">
          <img src="icon-192.png" alt="" width={26} height={26} />
          <span className="wordmark-kn" lang="kn">ನಮ್ಮ ಮೆಟ್ರೋ</span>
          <span className="wordmark-en">Namma Metro</span>
        </a>
        <div className="nav-right">
          <div className="nav-clock">
            <time dateTime={now.toISOString()}>
              {now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </time>
            <span className="sep" aria-hidden="true" />
            <span>{now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}</span>
          </div>
          <button className="theme-toggle" onClick={onToggleTheme}
            aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </nav>
  )
}
