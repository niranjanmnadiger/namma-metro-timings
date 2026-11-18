export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <ol className="footnotes">
          <li><span>
            Train times are estimates based on BMRCL's published service frequencies (synced April 2025; Pink Line November 2026).
            Actual trains can run earlier or later due to signalling, crowding or timetable changes, so allow a 5 to 10 minute buffer.
            Short-loop trains that run on the Purple Line at peak hours are not yet included, so central Purple Line waits may be shorter than shown.
          </span></li>
          <li><span>
            Fares follow the BMRCL fare revision effective 9 February 2025. Pink Line trips use the official Pink Line fare chart.
            Smart card fares include the standard discount. Confirm at{' '}
            <a href="https://www.bmrc.co.in" target="_blank" rel="noopener noreferrer">bmrc.co.in</a> or the official Namma Metro app.
          </span></li>
        </ol>
        <div className="footer-bottom">
          <span>
            #NirusCodes · Suggestions? <a href="mailto:niranjanmnadiger@gmail.com">niranjanmnadiger@gmail.com</a>
          </span>
          <nav className="footer-links" aria-label="Footer">
            <a href="https://github.com/niranjanmnadiger/namma-metro-timings" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/niranjan-m-nadiger/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
