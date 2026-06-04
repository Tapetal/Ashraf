# Portfolio  tapetal.dev

A highly interactive developer portfolio built with SvelteKit, TypeScript, and Tailwind CSS.

## 🌐 Live Demo
[Add deployed URL here]

---

## ⚙️ Setup

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production build
npm run preview  # Preview production
```

---

## 🏗️ Architecture

```
src/
├── routes/
│   ├── +layout.svelte      Global layout  Nav + Footer + page transitions
│   ├── +page.svelte        Home  Hero, FeaturedProjects, Skills, Timeline, Contact
│   ├── +error.svelte       Error page
│   ├── projects/           All projects with category filter
│   ├── about/              Bio, stats, available banner, Skills, Timeline
│   └── contact/            Contact form page
└── lib/
    ├── components/
    │   ├── layout/
    │   │   └── Nav.svelte           Sticky nav + ⌘K command palette + mobile menu
    │   └── sections/
    │       ├── Hero.svelte          Typewriter, animated entrance, CTAs, socials
    │       ├── FeaturedProjects.svelte  Alternating project cards with accent theming
    │       ├── Skills.svelte        Tech grid grouped by category
    │       ├── Timeline.svelte      Alternating vertical timeline
    │       └── ContactSection.svelte Form with validation + contact links
    └── utils/
        └── data.ts          All portfolio content  projects, skills, timeline, me
```

---

## 🎬 Animation Decisions

| Element | Technique | Why |
|---------|-----------|-----|
| Hero entrance | CSS `@keyframes fadeUp` with staggered `animation-delay` | Zero JS, smooth, respects `prefers-reduced-motion` via Tailwind |
| Typewriter | Svelte `onMount` + `setTimeout` state machine | Fully reactive, self-cleaning |
| Page transitions | `.page-enter` CSS class applied via `afterNavigate` | SvelteKit-native, no FOUC |
| Hover effects | CSS `transition` + `group-hover` | GPU-composited, no layout recalc |
| Scan line | CSS `@keyframes scan` | Pure CSS, zero JS overhead |
| Counter pulse | CSS `animate-pulse` | Native browser animation |

---

## ⚡ Performance Optimisation

- **Font preconnect**  Google Fonts loaded with `display=swap`
- **No animation library**  all transitions are pure CSS keyframes via Tailwind
- **Component code splitting**  SvelteKit auto-splits per route
- **`afterNavigate` scroll reset**  prevents stale scroll position on navigation
- **`passive` scroll listener** in Nav  prevents blocking the main thread
- **Lazy section rendering**  sections below the fold render on scroll into view
- **SVG icons inline**  no icon library bundle, zero requests

---

## ♿ Accessibility

- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`
- All interactive elements are `<a>` or `<button>`  keyboard accessible
- `aria-label` on icon-only buttons
- Visible `:focus-visible` ring on all focusable elements (2px accent-500)
- Skip navigation via keyboard  Tab to first link
- Color contrast: all text meets WCAG AA (4.5:1 on dark bg)
- Command palette: `⌘K` keyboard shortcut, `Escape` to close, arrow navigation

---

## 🎨 Creative Feature

**⌘K Command Palette**  press `Ctrl/Cmd + K` anywhere to open a keyboard-driven navigation overlay. Navigate to any page or trigger actions without touching the mouse. Closes on Escape.

---

## ⚠️ Trade-offs

- **No GSAP/Motion One**  keeping the bundle lean; CSS animations cover all use cases here
- **No 3D/WebGL**  decided against Three.js to prioritise load speed and accessibility
- **Static contact form**  no email backend in demo; easy to wire up Resend/Formspree
- **Data in `data.ts`**  no CMS; for a portfolio this size, a flat file is faster and simpler
