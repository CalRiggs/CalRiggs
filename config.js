export const config = {
  // ─── HEADER ──────────────────────────────────────────────────
  name: "CALLIE",

  greeting: "HI, I'M",

  roles: ["Software Engineer", "Frontend Architect", "Design Systems"],

  tagline: "6+ years in the React & TypeScript ecosystem",

  // ─── BIO ─────────────────────────────────────────────────────
  // Opening italic quote (shown at the top of the lore card)
  quote:
    "The gap between working and feeling good to use — that's where I live.",

  // Left column body copy — pre-wrapped for ~68 chars at 13px Georgia in a 494px column.
  // Use "" for paragraph breaks. Pre-wrapped at ~65 chars for 13px Georgia in a 494px column.
  bio: [
    // paragraph 1
    "Users don't file bug reports when something feels off — they",
    "just quietly give up. I got tired of watching that happen.",
    "After years building in the React and TypeScript ecosystem,",
    "I started paying attention to the moments before the complaints:",
    "the hesitation, the retry, the silent confusion.",
    // paragraph 2
    "",
    "That's what I fix. Not just the obvious breaks, but the subtle",
    "friction that makes people feel like the tool is working against",
    "them. Whether it's an AI feature that fails without explanation,",
    "a component that's technically accessible but practically unusable,",
    "or a design system that falls apart the moment a second designer",
    "touches it.",
    // paragraph 3
    "",
    "I care about the handoff between what ships and what people",
    "actually experience. That gap is where I do my best work.",
  ],

  // Right callout panel — keep lines under ~32 chars (12px Georgia, 232px text width)
  callout: {
    label: "MY THING",
    lines: [
      "I notice where process, tooling,",
      "or craft has slipped — and I'd",
      "rather fix it than move on. Not",
      "heroics. The gap is there, I can",
      "close it, so I do.",
    ],
    // Proof stat shown below the callout text
    stat: {
      value: "94%",
      label: "coverage after Codecov rollout",
      sublabel: "— up from ~40%",
    },
  },

  // Four skills shown as a 2×2 grid at the bottom of the left column.
  // Descriptions wrap at ~34 chars automatically.
  traits: [
    {
      color: "legendary",
      label: "Accessibility",
      description: "baked in at architecture time, not patched in at review",
    },
    {
      color: "epic",
      label: "Performance",
      description: "where it affects users, not just Lighthouse scores",
    },
    {
      color: "rare",
      label: "Design systems",
      description: "coherent after two years and five designers",
    },
    {
      color: "accent",
      label: "AI/UX",
      description: "interfaces that degrade gracefully when the model is wrong",
    },
  ],

  // ─── STACK ───────────────────────────────────────────────────
  // Four rows of 7 cards each (28 total shown as cards).
  // rarity: "legendary" | "epic" | "rare" | "common"
  // icon: built-in icon key — see ICON KEYS section below
  stack: [
    // ── Row 1: Languages ──
    {row: 1, label: "TypeScript", rarity: "legendary", icon: "typescript"},
    {row: 1, label: "JavaScript", rarity: "legendary", icon: "javascript"},
    {row: 1, label: "Python", rarity: "epic", icon: "python"},
    {row: 1, label: "HTML5", rarity: "epic", icon: "html5"},
    {row: 1, label: "CSS3", rarity: "epic", icon: "css3"},
    {row: 1, label: "SASS", rarity: "rare", icon: "sass"},
    {row: 1, label: "Markdown", rarity: "common", icon: "markdown"},

    // ── Row 2: Frontend ──
    {row: 2, label: "React", rarity: "legendary", icon: "react"},
    {row: 2, label: "Next.js", rarity: "epic", icon: "nextjs"},
    {row: 2, label: "Redux", rarity: "epic", icon: "redux"},
    {row: 2, label: "Storybook", rarity: "legendary", icon: "storybook"},
    {row: 2, label: "Tailwind", rarity: "rare", icon: "tailwind"},
    {row: 2, label: "React Query", rarity: "epic", icon: "reactquery"},
    {row: 2, label: "MUI", rarity: "rare", icon: "mui"},

    // ── Row 3: Testing & Quality ──
    {row: 3, label: "Testing Lib", rarity: "epic", icon: "rtl"},
    {row: 3, label: "Vitest", rarity: "epic", icon: "vitest"},
    {row: 3, label: "Cypress", rarity: "common", icon: "cypress"},
    {row: 3, label: "Codecov", rarity: "legendary", icon: "codecov"},
    {row: 3, label: "Jest", rarity: "rare", icon: "jest"},
    {row: 3, label: "Webpack", rarity: "rare", icon: "webpack"},
    {row: 3, label: "Vite", rarity: "epic", icon: "vite"},

    // ── Row 4: Backend / Infra / Tools ──
    {row: 4, label: "Node.js", rarity: "epic", icon: "nodejs"},
    {row: 4, label: "MySQL", rarity: "rare", icon: "mysql"},
    {row: 4, label: "Postgres", rarity: "rare", icon: "postgres"},
    {row: 4, label: "Redis", rarity: "epic", icon: "redis"},
    {row: 4, label: "Docker", rarity: "common", icon: "docker"},
    {row: 4, label: "GH Actions", rarity: "common", icon: "ghactions"},
    {row: 4, label: "Google Cloud", rarity: "rare", icon: "googlecloud"},
  ],

  // Row section labels
  rowLabels: {
    1: "LANGUAGES",
    2: "FRONTEND FRAMEWORKS & LIBRARIES",
    3: "TESTING & QUALITY",
    4: "BACKEND  ·  INFRA  ·  TOOLS",
  },

  // Row label colors (use palette key or hex)
  rowLabelColors: {
    1: "legendary",
    2: "epic",
    3: "rare",
    4: "accent",
  },

  // ─── PALETTE ─────────────────────────────────────────────────
  palette: {
    legendary: "#f5921e", // orange  — Legendary rarity / name glow / accent
    epic: "#d478b0", // purple — Epic rarity / secondary accents
    rare: "#4dbfff", // light blue   — Rare rarity / borders / section titles
    common: "#b8a0cc", // muted mauve— Common rarity
    accent: "#f0b8d0", // soft rose  — trait 4 / warm highlights
    nameFill: "#f0d4e8", // lightest rose — name crisp layer
    nameGlow: "#f8e0ee", // near-white  — name glow layer
    nameShadow: "#6b1e40", // dark rose   — name shadow layer
    bodyText: "#e8e8f0", // near-white — body copy
    brightText: "#d4c0e8", // lighter — first line / emphasis text
    quoteText: "#f0d4e8", // quote and bold labels
    bgDark: "#1a0a1e", // background dark stop
    bgMid: "#1e0d24", // background mid stop
    bgLight: "#0d0f1e", // background light stop
  },
}

// ─── ICON KEYS ───────────────────────────────────────────────────────────────
// These are the built-in icon keys supported by generate.js.
// To add a new icon, add an entry to the ICONS object in generate.js.
// ─────────────────────────────────────────────────────────────────────────────
