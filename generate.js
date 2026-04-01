import {mkdirSync, writeFileSync} from "fs"

import {config} from "./config.js"

mkdirSync("assets", {recursive: true})

// ─── Simple-icons CDN slug map ────────────────────────────────────────────────
// Maps your config icon key → exact simple-icons slug (filename without .svg)
const SLUG_MAP = {
  // Languages
  typescript: "typescript",
  javascript: "javascript",
  python: "python",
  html5: "html5",
  css3: "css3",
  sass: "sass",
  markdown: "markdown",

  // Frontend frameworks & libraries
  react: "react",
  nextjs: "nextdotjs",
  redux: "redux",
  storybook: "storybook",
  tailwind: "tailwindcss",
  mui: "mui",
  reactquery: "reactquery",
  threejs: "threedotjs",
  reactnative: "react",
  reactrouter: "reactrouter",
  styledcomponents: "styledcomponents",
  chartjs: "chartdotjs",

  // Testing & quality
  rtl: "testinglibrary",
  cypress: "cypress",
  vitest: "vitest",
  jest: "jest",
  codecov: "codecov",
  vite: "vite",
  webpack: "webpack",
  figma: "figma",
  esbuild: "esbuild",
  prettier: "prettier",

  // Backend / infra / tools
  nodejs: "nodedotjs",
  postgres: "postgresql",
  redis: "redis",
  mysql: "mysql",
  docker: "docker",
  ghactions: "githubactions",
  express: "express",
  googlecloud: "googlecloud",
  firebase: "firebase",
  elasticsearch: "elasticsearch",
  fastapi: "fastapi",
  jwt: "jsonwebtokens",

  // Dev tools
  git: "git",
  github: "github",
  jira: "jira",
  notion: "notion",
  postman: "postman",
  swagger: "swagger",
  npm: "npm",
}

// Official simple-icons brand hex colors (light/display color)
const BRAND_HEX = {
  typescript: "#3178C6",
  javascript: "#F7DF1E",
  python: "#3776AB",
  html5: "#E34F26",
  css3: "#1572B6",
  markdown: "#FFFFFF",
  sass: "#CC6699",
  react: "#61DAFB",
  nextjs: "#FFFFFF",
  redux: "#764ABC",
  storybook: "#FF4785",
  tailwind: "#06B6D4",
  mui: "#007FFF",
  threejs: "#FFFFFF",
  reactnative: "#61DAFB",
  reactquery: "#FF4154",
  reactrouter: "#CA4245",
  styledcomponents: "#DB7093",
  chartjs: "#FF6384",
  rtl: "#E33332",
  cypress: "#69D3A7",
  vitest: "#6E9F18",
  jest: "#C21325",
  codecov: "#F01F7A",
  figma: "#F24E1E",
  vite: "#646CFF",
  webpack: "#8DD6F9",
  esbuild: "#FFCF00",
  prettier: "#F7B93E",
  nodejs: "#5FA04E",
  express: "#FFFFFF",
  postgres: "#4169E1",
  redis: "#FF4438",
  mysql: "#4479A1",
  docker: "#2496ED",
  ghactions: "#2088FF",
  firebase: "#DD2C00",
  googlecloud: "#4285F4",
  elasticsearch: "#005571",
  fastapi: "#009688",
  jwt: "#FFFFFF",
  git: "#F05032",
  github: "#FFFFFF",
  jira: "#0052CC",
  notion: "#FFFFFF",
  postman: "#FF6C37",
  swagger: "#85EA2D",
  npm: "#CB3837",
}

// ─── Palette helpers ──────────────────────────────────────────────────────────
const p = config.palette
function color(key) {
  return p[key] ?? key
}
function rarityColor(r) {
  return color(r)
}
function rarityStroke(r) {
  return {legendary: 1.5, epic: 1.2, rare: 0.8, common: 0.6}[r] ?? 0.8
}
function rarityBg(r) {
  return (
    {legendary: "#100a1c", epic: "#0e1828", rare: "#12101e", common: "#0e0e14"}[
      r
    ] ?? "#12101e"
  )
}
function rarityBarOpacity(r) {
  return (
    {legendary: "0.85", epic: "0.80", rare: "0.60", common: "0.50"}[r] ?? "0.60"
  )
}
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

// ─── Fetch a single icon SVG path from the CDN ───────────────────────────────
// Returns the <path d="..."> string extracted from the full SVG, or null on failure.
async function fetchIconPath(iconKey) {
  const slug = SLUG_MAP[iconKey]
  if (!slug) return null

  const url = `https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${slug}.svg`
  try {
    const res = await fetch(url, {signal: AbortSignal.timeout(8000)})
    if (!res.ok) {
      console.warn(
        `  ⚠ CDN returned ${res.status} for ${slug} — using fallback`,
      )
      return null
    }
    const svg = await res.text()
    // Extract the path data from the SVG
    const match = svg.match(/<path\s+d="([^"]+)"/)
    return match ? match[1] : null
  } catch (err) {
    console.warn(`  ⚠ Failed to fetch ${slug}: ${err.message} — using fallback`)
    return null
  }
}

// Render a simple-icons path into an SVG group centred at (cx, cy) in a 92×80 card
// The simple-icons viewBox is "0 0 24 24" — we scale to fit ~32px, centre in card
function renderRealIcon(pathD, iconKey, cx, cy) {
  const hex = BRAND_HEX[iconKey] ?? "#ffffff"
  // Scale 24→28, translate so the 28px icon is centred at (cx, cy)
  const scale = 28 / 24 // ≈ 1.1667
  const tx = cx - 14 // 28/2 = 14
  const ty = cy - 14
  return `<g transform="translate(${tx},${ty}) scale(${scale.toFixed(4)})">
      <path d="${pathD}" fill="${hex}" opacity="0.92"/>
    </g>`
}

// Fallback: lettered circle when CDN fetch fails
function fallbackIcon(label, iconKey, cx, cy) {
  const hex = BRAND_HEX[iconKey] ?? p.rare
  const initial = (label ?? "?")[0].toUpperCase()
  return `<circle cx="${cx}" cy="${cy}" r="14" fill="${hex}" opacity="0.12"/>
    <circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="${hex}" stroke-width="1.5"/>
    <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-family="'Courier New',monospace" font-size="11" fill="${hex}">${initial}</text>`
}

// ─── Shared SVG fragments ─────────────────────────────────────────────────────
function cornerBrackets(W, H, margin = 10, arm = 32) {
  const tc = p.legendary,
    bc = p.epic
  return `
  <path d="M${margin},${margin + arm} L${margin},${margin} L${margin + arm},${margin}" fill="none" stroke="${tc}" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
  <path d="M${W - margin},${margin + arm} L${W - margin},${margin} L${W - margin - arm},${margin}" fill="none" stroke="${tc}" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
  <path d="M${margin},${H - margin - arm} L${margin},${H - margin} L${margin + arm},${H - margin}" fill="none" stroke="${bc}" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
  <path d="M${W - margin},${H - margin - arm} L${W - margin},${H - margin} L${W - margin - arm},${H - margin}" fill="none" stroke="${bc}" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>`
}

function cardAnimCSS(n) {
  return Array.from(
    {length: n},
    (_, i) =>
      `.c${i + 1}{animation:hG 3.2s ease-in-out infinite ${(i * 0.15).toFixed(2)}s}`,
  ).join("\n      ")
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════════════════════
function generateHeader() {
  const W = 850,
    H = 240
  const name = esc(config.name)
  const roles = config.roles.map(esc).join("  ·  ")
  const tagline = esc(config.tagline)

  const sparkles = [
    [52, 54, 9, p.legendary, 0.0],
    [118, 200, 7, p.epic, 0.5],
    [182, 44, 6, p.rare, 1.1],
    [44, 170, 10, p.accent, 1.7],
    [790, 50, 8, p.legendary, 0.3],
    [820, 188, 6, p.epic, 0.9],
    [756, 202, 9, p.rare, 1.4],
    [684, 38, 7, p.accent, 2.0],
    [316, 200, 6, p.legendary, 0.7],
    [544, 206, 7, p.epic, 1.9],
    [384, 32, 6, p.rare, 1.3],
    [474, 30, 7, p.legendary, 0.6],
  ]
    .map(
      ([x, y, fs, fill, d]) =>
        `<text x="${x}" y="${y}" font-size="${fs}" fill="${fill}" class="sp" style="animation-delay:${d}s">✦</text>`,
    )
    .join("\n  ")

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgG" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="${p.bgDark}"/>
      <stop offset="50%"  stop-color="${p.bgMid}"/>
      <stop offset="100%" stop-color="${p.bgLight}"/>
    </linearGradient>
    <radialGradient id="cO" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="${p.legendary}" stop-opacity="0.20"/>
      <stop offset="60%"  stop-color="${p.rare}"      stop-opacity="0.05"/>
      <stop offset="100%" stop-color="${p.rare}"      stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="lO" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stop-color="${p.epic}" stop-opacity="0.13"/>
      <stop offset="100%" stop-color="${p.epic}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="rO" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="${p.legendary}" stop-opacity="0.09"/>
      <stop offset="100%" stop-color="${p.legendary}" stop-opacity="0"/>
    </radialGradient>
    <filter id="nG"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="lG"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <pattern id="dg" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="0.5" fill="${p.rare}" opacity="0.14"/>
    </pattern>
    <style>
      @keyframes sp{0%,100%{opacity:.12;transform:scale(.6)}50%{opacity:1;transform:scale(1)}}
      @keyframes sh{0%,100%{opacity:.25}50%{opacity:.7}}
      @keyframes gl{0%,92%,100%{transform:none}94%{transform:translate(3px,0)}96%{transform:translate(-2px,0)}98%{transform:none}}
      @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      .sp{animation:sp 3s ease-in-out infinite}.sh{animation:sh 4s ease-in-out infinite}
      .gl{animation:gl 9s ease-in-out infinite}
      .f0{animation:fu .8s ease-out 0s both}.f1{animation:fu .8s ease-out .2s both}
      .f2{animation:fu .8s ease-out .5s both}.f3{animation:fu .8s ease-out .7s both}
    </style>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bgG)"/>
  <rect width="${W}" height="${H}" fill="url(#dg)"/>
  <ellipse cx="425" cy="120" rx="340" ry="200" fill="url(#cO)"/>
  <ellipse cx="70"  cy="120" rx="180" ry="150" fill="url(#lO)"/>
  <ellipse cx="790" cy="110" rx="160" ry="140" fill="url(#rO)"/>
  <rect x="12" y="12" width="826" height="216" fill="none" stroke="${p.rare}"      stroke-width="1"   rx="10" opacity="0.22"/>
  <rect x="16" y="16" width="818" height="208" fill="none" stroke="${p.legendary}" stroke-width="0.5" rx="8"  opacity="0.12"/>
  ${cornerBrackets(W, H, 12, 36)}
  <circle cx="12"  cy="12"  r="3" fill="${p.legendary}" opacity=".70"/>
  <circle cx="838" cy="12"  r="3" fill="${p.legendary}" opacity=".70"/>
  <circle cx="12"  cy="228" r="3" fill="${p.epic}"      opacity=".70"/>
  <circle cx="838" cy="228" r="3" fill="${p.epic}"      opacity=".70"/>
  <polygon points="425,12  431,18  425,24  419,18"  fill="${p.legendary}" opacity=".55"/>
  <polygon points="425,216 431,222 425,228 419,222" fill="${p.epic}"      opacity=".55"/>
  <polygon points="12,120  18,126  12,132  6,126"   fill="${p.rare}"      opacity=".40"/>
  <polygon points="838,120 844,126 838,132 832,126"  fill="${p.rare}"      opacity=".40"/>
  <line x1="36"  y1="129" x2="228" y2="129" stroke="${p.rare}"      stroke-width=".8" opacity=".28" filter="url(#lG)"/>
  <line x1="36"  y1="134" x2="210" y2="134" stroke="${p.legendary}" stroke-width=".4" opacity=".16"/>
  <line x1="36"  y1="124" x2="192" y2="124" stroke="${p.epic}"      stroke-width=".3" opacity=".13"/>
  <polygon points="228,129 235,134 228,139 221,134" fill="${p.legendary}" opacity=".55" filter="url(#lG)"/>
  <line x1="814" y1="129" x2="622" y2="129" stroke="${p.rare}"      stroke-width=".8" opacity=".28" filter="url(#lG)"/>
  <line x1="814" y1="134" x2="640" y2="134" stroke="${p.legendary}" stroke-width=".4" opacity=".16"/>
  <line x1="814" y1="124" x2="658" y2="124" stroke="${p.epic}"      stroke-width=".3" opacity=".13"/>
  <polygon points="622,129 615,134 622,139 629,134" fill="${p.legendary}" opacity=".55" filter="url(#lG)"/>
  ${sparkles}
  <text x="425" y="66" text-anchor="middle" font-family="'Georgia','Times New Roman',serif"
    font-size="13" fill="rgba(255,255,255,0.90)" letter-spacing="6" opacity="1" class="f0">${esc(config.greeting)}</text>
  <text x="428" y="138" text-anchor="middle" font-family="'Georgia','Times New Roman',serif"
    font-size="72" font-weight="bold" fill="${p.nameShadow}" letter-spacing="6" opacity=".30">${name}</text>
  <text x="425" y="135" text-anchor="middle" font-family="'Georgia','Times New Roman',serif"
    font-size="72" font-weight="bold" fill="${p.nameGlow}" letter-spacing="6"
    filter="url(#nG)" class="gl f1">${name}</text>
  <text x="425" y="135" text-anchor="middle" font-family="'Georgia','Times New Roman',serif"
    font-size="72" font-weight="bold" fill="${p.nameFill}" letter-spacing="6" class="f1">${name}</text>
  <line x1="248" y1="148" x2="602" y2="148" stroke="${p.rare}" stroke-width=".8" opacity=".35" class="f2"/>
  <polygon points="425,143 431,148 425,153 419,148" fill="${p.legendary}" opacity=".75"/>
  <text x="425" y="170" text-anchor="middle" font-family="'Georgia','Times New Roman',serif"
    font-size="14" fill="#e0cced" letter-spacing="2" class="f2">${roles}</text>
  <text x="425" y="192" text-anchor="middle" font-family="'Georgia','Times New Roman',serif"
    font-size="13" fill="#b898d4" letter-spacing="1" font-style="italic" class="f3">${tagline}</text>
  <line x1="140" y1="210" x2="710" y2="210" stroke="${p.rare}" stroke-width=".5" opacity=".10" class="sh"/>
</svg>`
}

// ═══════════════════════════════════════════════════════════════════════════════
// BIO
// ═══════════════════════════════════════════════════════════════════════════════
function generateBio() {
  const W = 850

  // ── Accent colours (bio-specific green system from the redesign) ──
  const GREEN  = "#5DCAA5"   // terminal prompt, dots, checkmarks
  const GREEN2 = "#1D9E75"   // stat number, "feels good" italic emphasis
  const AMBER  = "#EF9F27"   // terminal warning line
  const MUT    = "#96a0c0"   // muted labels — 7.1:1 on main bg, 7.2:1 on card bg (WCAG AAA)
  const DIM    = "rgba(255,255,255,0.82)"  // terminal output text — ~11:1 on #161b22
  const CBORD  = "rgba(255,255,255,0.14)"   // card / separator border
  const CBACK  = "#0e1220"   // skill & callout card background
  const TERMBG = "#0d1117"   // terminal dark background — distinct from page gradient
  const TERMBAR= "#161b27"   // terminal title-bar fill

  // ── Column geometry ──
  const LX  = 36             // left col x start
  const LW  = 494            // left col width  → right edge x=530
  const RX  = LX + LW + 16  // right col x start = 546
  const RW  = 814 - RX       // right col width = 268
  const RIN = RX + 16        // right col inner text x = 562
  const ROUT= 814 - 16       // right col inner text right edge = 798

  // ── Body text ──
  const LEAD = 20   // line height
  const PGAP = 14   // extra gap between paragraphs
  let y = 100
  const bodyEls = []
  for (const raw of config.bio) {
    if (raw === "") {
      y += PGAP
      continue
    }

    if (raw.includes("feels good")) {
      const pivot = raw.indexOf("feels good")
      const pre   = esc(raw.slice(0, pivot))
      const post  = esc(raw.slice(pivot + 10))
      bodyEls.push(
        `<text x="${LX}" y="${y}" font-family="'Georgia',serif" font-size="13" fill="${p.bodyText}">${pre}<tspan font-style="italic" fill="${GREEN2}">feels good</tspan>${post}</text>`,
      )
    } else {
      bodyEls.push(
        `<text x="${LX}" y="${y}" font-family="'Georgia',serif" font-size="13" fill="${p.bodyText}">${esc(raw)}</text>`,
      )
    }
    y += LEAD
  }

  const bodyBottom = y

  // ── Skills grid (2 × 2) ──
  const skillRuleY  = bodyBottom + 14
  const skillStartY = skillRuleY  + 14
  const CELL_W = Math.floor((LW - 8) / 2)   // 243 px
  const CELL_H = 68
  const CELL_GAP = 8
  const skillEls = []

  config.traits.forEach((t, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const cx  = LX + col * (CELL_W + CELL_GAP)
    const cy  = skillStartY + row * (CELL_H + CELL_GAP)
    const tc  = color(t.color)

    // Wrap description at ~34 chars
    const desc = t.description
    const brk  = desc.lastIndexOf(" ", 34)
    const dl1  = esc(brk > 0 && desc.length > 34 ? desc.slice(0, brk) : desc)
    const dl2  = brk > 0 && desc.length > 34 ? esc(desc.slice(brk + 1)) : ""

    skillEls.push(`
  <rect x="${cx}" y="${cy}" width="${CELL_W}" height="${CELL_H}" rx="5" fill="${CBACK}" stroke="${CBORD}" stroke-width="1"/>
  <rect x="${cx}" y="${cy}" width="${CELL_W}" height="3" rx="2" fill="${tc}" opacity=".85"/>
  <text x="${cx + 12}" y="${cy + 21}" font-family="'Courier New',monospace" font-size="12" fill="${p.brightText}">${esc(t.label)}</text>
  <text x="${cx + 12}" y="${cy + 39}" font-family="'Georgia',serif" font-size="11" fill="${MUT}">${dl1}</text>
  ${dl2 ? `<text x="${cx + 12}" y="${cy + 53}" font-family="'Georgia',serif" font-size="11" fill="${MUT}">${dl2}</text>` : ""}`)
  })

  const leftBottom = skillStartY + 2 * (CELL_H + CELL_GAP)

  // ── Terminal card ──
  const termCardY  = 100
  const TBAH = 26     // title-bar height
  const TPAD = 14     // body vertical padding
  const TLH  = 17     // line height
  let ty = termCardY + TBAH + 2 + TPAD
  const termEls = []

  const termLines = [
    {t: "cmd",  s: "npm run build:ds --coverage"},
    {t: "ok",   s: " components compiled (48)"},
    {t: "ok",   s: " a11y: 0 violations"},
    {t: "ok",   s: " coverage 94% (+54% vs baseline)"},
    {t: "warn", s: " Modal focus trap — needs review"},
    {t: "cur"},
  ]

  for (const tl of termLines) {
    if (tl.t === "cur") {
      termEls.push(`
  <text x="${RIN}" y="${ty}" font-family="'Courier New',monospace" font-size="12" fill="${GREEN}">›</text>
  <rect x="${RIN + 13}" y="${ty - 10}" width="7" height="12" rx=".5" fill="${GREEN}">
    <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/>
  </rect>`)
    } else {
      const sym = tl.t === "cmd" ? "›" : tl.t === "ok" ? "✓" : "⚠"
      const sc  = tl.t === "warn" ? AMBER : GREEN
      const tc  = tl.t === "cmd" ? "rgba(255,255,255,0.92)" : DIM
      termEls.push(`
  <text x="${RIN}" y="${ty}" font-family="'Courier New',monospace" font-size="12" fill="${sc}">${sym}</text>
  <text x="${RIN + 13}" y="${ty}" font-family="'Courier New',monospace" font-size="12" fill="${tc}">${esc(tl.s)}</text>`)
    }
    ty += TLH
  }

  const termCardBot = ty + TPAD
  const termCardH   = termCardBot - termCardY

  // ── Total height ──
  const H = Math.max(leftBottom, termCardBot) + 44

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bBg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="${p.bgMid}"/>
      <stop offset="100%" stop-color="#0e1e20"/>
    </linearGradient>
    <style>
      @keyframes spkB{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:.9;transform:scale(1)}}
      @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      .spB{animation:spkB 3s ease-in-out infinite}
      .f0{animation:fu .8s ease-out 0s    both}
      .f1{animation:fu .8s ease-out .2s   both}
      .f2{animation:fu .8s ease-out .45s  both}
      .f3{animation:fu .8s ease-out .65s  both}
      .f4{animation:fu .8s ease-out .85s  both}
    </style>
  </defs>

  <!-- Background & border -->
  <rect width="${W}" height="${H}" fill="url(#bBg)" rx="8"/>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="${p.rare}" stroke-width="1" rx="8" opacity=".28"/>
  ${cornerBrackets(W, H, 10, 32)}

  <!-- Sparkle decorations -->
  <text x="820" y="140" font-size="10" fill="${p.legendary}" class="spB" style="animation-delay:0s">✦</text>
  <text x="826" y="260" font-size="7"  fill="${p.epic}"      class="spB" style="animation-delay:1.2s">✦</text>
  <text x="824" y="420" font-size="8"  fill="${GREEN}"        class="spB" style="animation-delay:0.7s">✦</text>

  <!-- LORE header -->
  <text x="36" y="38" font-family="'Georgia',serif" font-size="12" fill="${p.rare}" letter-spacing="4" opacity=".95" class="f0">✦ LORE</text>
  <line x1="90" y1="46" x2="814" y2="46" stroke="${p.rare}" stroke-width=".5" opacity=".18"/>

  <!-- Quote -->
  <text x="${LX}" y="68" font-family="'Georgia',serif" font-size="17" font-style="italic" fill="${p.quoteText}" opacity=".95" class="f1">${esc(config.quote)}</text>
  <line x1="${LX}" y1="82" x2="814" y2="82" stroke="${CBORD}" stroke-width=".7" opacity=".8"/>

  <!-- Left column body text -->
  <g class="f2">
  ${bodyEls.join("\n  ")}
  </g>

  <!-- Skills grid separator -->
  <line x1="${LX}" y1="${skillRuleY}" x2="${LX + LW}" y2="${skillRuleY}" stroke="${CBORD}" stroke-width=".7" opacity=".8" class="f3"/>
  <g class="f3">
  ${skillEls.join("")}
  </g>

  <!-- Terminal card -->
  <g class="f3">
  <rect x="${RX}" y="${termCardY}" width="${RW}" height="${termCardH}" rx="7" fill="${TERMBG}" stroke="${GREEN}" stroke-opacity="0.30" stroke-width="1"/>
  <rect x="${RX}" y="${termCardY}" width="${RW}" height="${TBAH}" rx="7" fill="${TERMBAR}"/>
  <rect x="${RX}" y="${termCardY + TBAH - 6}" width="${RW}" height="6" fill="${TERMBAR}"/>
  <line x1="${RX}" y1="${termCardY + TBAH}" x2="${RX + RW}" y2="${termCardY + TBAH}" stroke="${GREEN}" stroke-opacity="0.15" stroke-width=".5"/>
  <circle cx="${RX + 14}" cy="${termCardY + 13}" r="4.5" fill="#FF5F56"/>
  <circle cx="${RX + 27}" cy="${termCardY + 13}" r="4.5" fill="#FFBD2E"/>
  <circle cx="${RX + 40}" cy="${termCardY + 13}" r="4.5" fill="#27C93F"/>
  <text x="${RX + RW / 2}" y="${termCardY + 18}" text-anchor="middle" font-family="'Courier New',monospace" font-size="10" fill="rgba(255,255,255,0.70)">callie@dev ~</text>
  ${termEls.join("")}
  </g>
</svg>`
}

// ═══════════════════════════════════════════════════════════════════════════════
// STACK  (fetches real icons)
// ═══════════════════════════════════════════════════════════════════════════════
async function generateStack(iconPaths) {
  const W = 850
  const CARD_W = 92,
    CARD_H = 80,
    GAP = 10,
    STEP = CARD_W + GAP,
    START_X = 36

  const rows = {}
  for (const c of config.stack) {
    if (!rows[c.row]) rows[c.row] = []
    rows[c.row].push(c)
  }
  const rowNums = Object.keys(rows).map(Number).sort()

  let currentY = 74
  const rowLayouts = []
  for (const rn of rowNums) {
    const labelY = currentY,
      cardsY = labelY + 16
    rowLayouts.push({rowNum: rn, labelY, cardsY, cardBottom: cardsY + CARD_H})
    currentY = cardsY + CARD_H + 24
  }

  const lastBottom = rowLayouts.at(-1).cardBottom
  const bottomLabelY = lastBottom + 36
  const H = bottomLabelY + 20
  const total = config.stack.length

  const cardSVGs = []
  let idx = 0

  for (const {rowNum, labelY, cardsY} of rowLayouts) {
    const rowCards = rows[rowNum]
    const labelColor = color(config.rowLabelColors?.[rowNum] ?? "rare")
    const rowLabel = esc(config.rowLabels?.[rowNum] ?? `ROW ${rowNum}`)
    cardSVGs.push(
      `<text x="36" y="${labelY}" font-family="'Courier New',monospace" font-size="11" fill="${labelColor}" letter-spacing="1.5" opacity="1">${rowLabel}</text>`,
    )

    for (let col = 0; col < rowCards.length; col++) {
      const card = rowCards[col]
      idx++
      const cx = START_X + col * STEP
      const cy = cardsY
      const centerX = cx + CARD_W / 2
      const iconCY = cy + 32 // slightly higher — brand icons look better centred here
      const textY = cy + CARD_H - 10
      const rc = rarityColor(card.rarity)
      const rsw = rarityStroke(card.rarity)
      const rbg = rarityBg(card.rarity)
      const barOp = rarityBarOpacity(card.rarity)
      const isLeg = card.rarity === "legendary"
      const transformOrigin = `${centerX}px ${cy + CARD_H / 2}px`

      // Get the fetched path, or fall back
      const pathD = iconPaths[card.icon]
      const iconSVG = pathD
        ? renderRealIcon(pathD, card.icon, centerX, iconCY)
        : fallbackIcon(card.label, card.icon, centerX, iconCY)

      const labelFontSize = card.label.length > 9 ? 8 : 9

      cardSVGs.push(`
  <!-- ${card.label} — ${card.rarity} -->
  <g class="c${idx}${isLeg ? " leg" : ""}" style="transform-origin:${transformOrigin}">
    <rect x="${cx}" y="${cy}" width="${CARD_W}" height="${CARD_H}" rx="6" fill="${rbg}" stroke="${rc}" stroke-width="${rsw}"/>
    <rect x="${cx}" y="${cy}" width="${CARD_W}" height="5" rx="3" fill="${rc}" opacity="${barOp}"/>
    ${iconSVG}
    <text x="${centerX}" y="${textY}" text-anchor="middle" font-family="'Courier New',monospace" font-size="${labelFontSize}" fill="#f0d4e8">${esc(card.label)}</text>
  </g>`)
    }
  }

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skBg" x1="0" y1="0" x2=".5" y2="1">
      <stop offset="0%"   stop-color="${p.bgMid}"/>
      <stop offset="100%" stop-color="#0c1820"/>
    </linearGradient>
    <style>
      @keyframes hG{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
      @keyframes lSh{0%,88%,100%{stroke:${p.legendary};stroke-opacity:.7}94%{stroke:#fff;stroke-opacity:1}}
      ${cardAnimCSS(total)}
      .leg>rect:first-child{animation:lSh 5s ease-in-out infinite}
    </style>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#skBg)" rx="8"/>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="${p.rare}" stroke-width="1" rx="8" opacity=".28"/>
  ${cornerBrackets(W, H, 10, 32)}
  <text x="36" y="34" font-family="'Georgia',serif" font-size="12" fill="${p.rare}" letter-spacing="4">✦ SPELLBOOK  ·  ABILITIES &amp; TECH STACK</text>
  <line x1="36" y1="44" x2="814" y2="44" stroke="${p.rare}" stroke-width=".5" opacity=".18"/>
  <!-- Rarity legend — sits below the separator, text vertically centred on the indicator squares -->
  <rect x="752" y="49" width="10" height="10" rx="2" fill="#1e1428" stroke="${p.common}"    stroke-width=".6"/>
  <text x="766" y="54" dominant-baseline="middle" font-family="'Courier New',monospace" font-size="9" fill="${p.common}"    opacity=".9">Common</text>
  <rect x="694" y="49" width="10" height="10" rx="2" fill="#1e0e30" stroke="${p.rare}"      stroke-width=".8"/>
  <text x="708" y="54" dominant-baseline="middle" font-family="'Courier New',monospace" font-size="9" fill="${p.rare}"      opacity=".9">Rare</text>
  <rect x="636" y="49" width="10" height="10" rx="2" fill="#0e2e28" stroke="${p.epic}"      stroke-width="1"/>
  <text x="650" y="54" dominant-baseline="middle" font-family="'Courier New',monospace" font-size="9" fill="${p.epic}"      opacity=".9">Epic</text>
  <rect x="562" y="49" width="10" height="10" rx="2" fill="#3d1a5e" stroke="${p.legendary}" stroke-width="1.2"/>
  <text x="576" y="54" dominant-baseline="middle" font-family="'Courier New',monospace" font-size="9" fill="${p.legendary}" opacity=".9">Legendary</text>
  ${cardSVGs.join("")}
  <text x="${W / 2}" y="${bottomLabelY}" text-anchor="middle" font-family="'Courier New',monospace" font-size="9"
    fill="${p.rare}" letter-spacing="3">✦ EQUIPPED LOADOUT  ·  ${config.stack.length} TECHNOLOGIES ✦</text>
</svg>`
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("✦ Fetching icons from simple-icons CDN...")

  // Collect unique icon keys from the stack
  const uniqueKeys = [...new Set(config.stack.map((c) => c.icon))]

  // Fetch all in parallel
  const results = await Promise.all(
    uniqueKeys.map(async (key) => {
      const slug = SLUG_MAP[key]
      if (!slug) {
        console.log(`  · ${key} — no slug mapped, using fallback`)
        return [key, null]
      }
      process.stdout.write(`  · Fetching ${key} (${slug})...`)
      const path = await fetchIconPath(key)
      console.log(path ? " ✓" : " ✗ (fallback)")
      return [key, path]
    }),
  )

  const iconPaths = Object.fromEntries(results)

  console.log("\n✦ Generating SVGs...")
  writeFileSync("assets/callie-header-clean.svg", generateHeader())
  console.log("  ✓ assets/callie-header-clean.svg")

  writeFileSync("assets/callie-bio.svg", generateBio())
  console.log("  ✓ assets/callie-bio.svg")

  writeFileSync("assets/callie-stack.svg", await generateStack(iconPaths))
  console.log("  ✓ assets/callie-stack.svg")

  console.log("\n✦ Done.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
