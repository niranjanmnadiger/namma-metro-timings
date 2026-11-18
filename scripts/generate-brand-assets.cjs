/**
 * Generates the Namma Metro brand images into /public and /docs:
 *   public/icon-512.png, icon-192.png, apple-touch-icon.png, favicon-32.png
 *   public/og-image.png          (1200 x 630 social preview)
 *   docs/typography.png          (type specimen)
 *
 * Usage:  npx playwright install chromium   (once)
 *         node scripts/generate-brand-assets.cjs
 *
 * Fonts load from Google Fonts; if offline, install Anek Latin, Anek Kannada,
 * Hind and Martian Mono locally and they are picked up by name.
 */
const path = require('path')
const fs = require('fs')
const { chromium } = require('playwright')

const ROOT = path.resolve(__dirname, '..')
const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Anek+Kannada:wdth,wght@75..125,400..800&family=Anek+Latin:wdth,wght@75..125,400..800&family=Hind:wght@400;500;600&family=Martian+Mono:wdth,wght@75..112.5,400..600&display=block" rel="stylesheet">`

const C = { purple: '#a66cff', green: '#30d158', yellow: '#ffd60a', pink: '#ff5fa2' }

const BASE_CSS = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#000;color:#f5f5f7;-webkit-font-smoothing:antialiased}
  .kn{font-family:'Anek Kannada',sans-serif}
  .disp{font-family:'Anek Latin',sans-serif;font-stretch:88%;font-variation-settings:'wdth' 88}
  .text{font-family:'Hind',sans-serif}
  .mono{font-family:'Martian Mono',monospace;font-stretch:87.5%;font-variation-settings:'wdth' 87.5}
`

const MAP = (w) => `
<svg width="${w}" viewBox="0 0 960 390" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M40 150 H920" stroke="${C.purple}"/>
    <path d="M250 20 L380 150 L380 270 L300 350" stroke="${C.green}"/>
    <path d="M380 270 H470 L550 350 H760" stroke="${C.yellow}"/>
    <path d="M450 350 V205" stroke="${C.pink}"/>
  </g>
  <g fill="#000" stroke="#f5f5f7" stroke-width="4">
    <circle cx="380" cy="150" r="12"/><circle cx="380" cy="270" r="12"/><circle cx="450" cy="270" r="12"/>
  </g>
</svg>`

const ICON = (size) => `
<div style="width:${size}px;height:${size}px;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${size * 0.05}px">
  <div class="kn" style="font-size:${size * 0.56}px;font-weight:800;line-height:.9;color:#f5f5f7;margin-top:${size * 0.04}px">ನ</div>
  <div style="display:flex;gap:${size * 0.025}px">
    ${Object.values(C).map(c => `<span style="display:block;width:${size * 0.12}px;height:${size * 0.045}px;border-radius:${size}px;background:${c}"></span>`).join('')}
  </div>
</div>`

const OG = `
<div style="width:1200px;height:630px;background:#000;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden">
  <div>
    <div class="kn" style="font-size:44px;font-weight:700;color:#a1a1a6">ನಮ್ಮ ಮೆಟ್ರೋ</div>
    <div class="disp" style="font-size:112px;font-weight:800;line-height:.95;letter-spacing:-.01em;margin-top:8px">Trip Planner</div>
    <div class="text" style="font-size:28px;color:#a1a1a6;margin-top:22px;max-width:640px;line-height:1.35">Next trains, interchanges and fares across the Purple, Green, Yellow and Pink lines.</div>
  </div>
  <div class="mono" style="font-size:16px;letter-spacing:.1em;color:#86868b;text-transform:uppercase">Bengaluru · Namma Metro</div>
  <div style="position:absolute;right:-40px;bottom:40px;opacity:.95">${MAP(620)}</div>
</div>`

const SPEC = `
<div style="width:1600px;padding:80px;background:#000">
  <div class="mono" style="font-size:14px;letter-spacing:.12em;color:#86868b;text-transform:uppercase">Namma Metro · Type system</div>
  <div class="disp" style="font-size:72px;font-weight:800;margin:10px 0 56px">Three families, one voice.</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:28px">
    ${[
      ['Display', 'Anek Latin + Anek Kannada', 'Ek Type', 'Headings, wordmark, big times and fares. Condensed and upright, like station signage, with a Kannada partner drawn to match.',
        `<div class="kn" style="font-size:60px;font-weight:800;line-height:1.1;white-space:nowrap">ನಮ್ಮ ಮೆಟ್ರೋ</div><div class="disp" style="font-size:64px;font-weight:800;line-height:1.05;margin-top:8px">Majestic<br>8:42 PM</div>`],
      ['Text', 'Hind', 'Indian Type Foundry', 'Body copy and controls. A humanist sans designed in India, open and readable at small sizes.',
        `<div class="text" style="font-size:30px;line-height:1.35">Change to the Yellow Line at RV Road. Allow about 7 minutes to reach the platform.</div>`],
      ['Small &amp; data', 'Martian Mono', 'Evil Martians', 'Labels, metadata and departure times. A departure-board mono with even figures that line up in columns.',
        `<div class="mono" style="font-size:22px;line-height:1.9;color:#f5f5f7">8:06 PM&nbsp;&nbsp;8:16 PM<br>8:26 PM&nbsp;&nbsp;8:29 PM</div><div class="mono" style="font-size:13px;letter-spacing:.1em;color:#86868b;margin-top:14px">NEXT TRAIN IN 5 MIN</div>`],
    ].map(([role, fam, foundry, use, sample]) => `
      <div style="background:#161617;border-radius:28px;padding:36px;display:flex;flex-direction:column;gap:22px">
        <div class="mono" style="font-size:13px;letter-spacing:.12em;color:#86868b;text-transform:uppercase">${role}</div>
        <div class="disp" style="font-size:36px;font-weight:700;line-height:1.05">${fam}<div class="mono" style="font-size:13px;color:#86868b;margin-top:8px;font-weight:400">${foundry}</div></div>
        <div style="flex:1;border-top:1px solid rgba(255,255,255,.1);padding-top:24px">${sample}</div>
        <div class="text" style="font-size:18px;color:#a1a1a6;line-height:1.45">${use}</div>
      </div>`).join('')}
  </div>
  <div style="display:flex;gap:14px;margin-top:40px;align-items:center">
    ${Object.entries(C).map(([k, c]) => `<div style="display:flex;align-items:center;gap:10px" class="mono"><span style="width:44px;height:8px;border-radius:4px;background:${c}"></span><span style="font-size:14px;color:#a1a1a6;text-transform:uppercase;letter-spacing:.08em">${k}</span></div>`).join('')}
  </div>
</div>`

async function shot(browser, html, width, height, out, fullPage = false) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}</style></head><body>${html}</body></html>`)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  await page.screenshot({ path: out, fullPage, omitBackground: false })
  await page.close()
  console.log('wrote', path.relative(ROOT, out))
}

;(async () => {
  const browser = await chromium.launch()
  for (const [size, name] of [[512, 'icon-512.png'], [192, 'icon-192.png'], [180, 'apple-touch-icon.png'], [32, 'favicon-32.png']]) {
    await shot(browser, ICON(size), size, size, path.join(ROOT, 'public', name))
  }
  await shot(browser, OG, 1200, 630, path.join(ROOT, 'public', 'og-image.png'))
  await shot(browser, SPEC, 1600, 900, path.join(ROOT, 'docs', 'typography.png'), true)
  await browser.close()
})()
