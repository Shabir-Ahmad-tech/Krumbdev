# KRUMB.DEV — Landing Page Build Prompt

Use this prompt as-is with Claude Code, Cursor, v0, or any AI coding agent. It is structured so an agent can execute it directly without needing clarification.

---

## PROJECT BRIEF

Build a single-page, high-conversion marketing landing page for **KRUMB.DEV** — a suite of 43 free, client-side developer utility tools (JSON formatter, JWT decoder, regex tester, code beautifier, etc). This page is NOT the tools app itself — it is the top-of-funnel marketing page whose only job is to convert a cold visitor into someone who clicks through to the live tools app.

**Primary CTA destination (all CTAs must link here):** `https://krumb.dev/tools` (or `https://krumbdev.netlify.app/tools` if custom domain isn't live yet)

**Funnel logic to build into the page structure** (do not treat this as a flat feature page — structure it as a funnel):
- **TOFU (Awareness) — Hero section:** Hook a cold visitor in under 3 seconds with the core promise: fast, free, private, no-signup dev tools.
- **MOFU (Interest → Consideration) — Features, Proof, Comparison:** Build trust and demonstrate value before asking for anything.
- **BOFU (Decision) — Final CTA band:** Remove all remaining friction (no signup, no cost, instant) and give one final unmissable action.

Every section must end with either a soft CTA (text link) or the page must lead the eye toward the final CTA band. No dead ends.

---

## BRAND SYSTEM (from brand board — follow exactly, do not deviate)

### Visual identity name
"Industrial Cyber" — Anti-trend brutalism. Command-line focus. Tactile, kinetic, engineered — NOT soft, NOT rounded, NOT typical SaaS-friendly.

### Colors (use CSS variables, exact hex)
```css
--krumb-black: #000000;   /* Pure Black — "Void" — primary background */
--krumb-white: #F9F9F9;   /* Bone White — "Blueprint" — primary text/surfaces */
--krumb-green: #00FF41;   /* Acid Green — "Phosphor Accent" — CTAs, links, hover states, terminal cursor ONLY */
```
Acid Green is an accent used sparingly and deliberately (buttons, active states, the blinking cursor, hover borders) — never as a large fill. The base palette is black/white; green is the "signal."

### Typography
- **Display/headings:** Space Grotesk, weight 700 (bold). Large, tight tracking, all-caps for major headers.
- **Code/body/UI labels:** JetBrains Mono. Use for all UI copy, labels, button text, terminal-style strings (e.g. `> INPUT_PAYLOAD]`, `> TOOLS: JSON2CSV | BASE64 | JWT`).
- Mix intentionally: Space Grotesk for big statement headlines, JetBrains Mono for everything that reads like a system/terminal output.

### Shape language
- **0px border radius everywhere.** No rounded corners, no pills, no soft cards. Sharp rectangles only.
- **1px raw borders** on inputs, buttons, cards — thin, high-contrast, functional-looking, not decorative.
- Logo mark: fractured/scrambled triangle formation (as shown in brand board) — use as a loading/hover state motif (triangles scramble and reassemble).

### Textures & effects (use as subtle background/accent layers, never overpowering text legibility)
- CRT scanline texture — thin horizontal line overlay, low opacity, on hero background or dark sections.
- Grain/noise texture — subtle, on section transitions or button hover states.
- Grid overlay — faint technical blueprint grid lines, can appear behind hero content (matches brand board's own background treatment).

### Voice/tone for copy
Terminal/CLI-flavored, direct, no fluff, no corporate SaaS-speak. Examples of the register to write in:
- "SYSTEM STATUS: 43 TOOLS ONLINE"
- "> RUN_TOOL --no-signup --zero-upload"
- "NO ACCOUNTS. NO UPLOADS. NO TRACKING." (only include tracking claims if true — see note at bottom)

---

## PAGE STRUCTURE (build in this exact order)

### 1. Sticky Nav
- Left: KRUMB.DEV logo mark (triangle fracture icon) + wordmark, Space Grotesk bold.
- Right: minimal links — `TOOLS`, `ABOUT` — plus one Acid Green CTA button: `[ RUN TOOLS ]` linking to `/tools`.
- Background: pure black, 1px bottom border in white at low opacity.
- On scroll: add subtle backdrop blur, keep border visible.

### 2. Hero (TOFU — Awareness)
- Full-bleed black background with CRT scanline texture (low opacity) and faint grid lines.
- Terminal-style pre-headline: blinking cursor animation, typewriter effect cycling through: `> json_formatter`, `> jwt_decoder`, `> regex_tester`... (cycles through 3-5 tool names, deletes and retypes)
- Massive headline, Space Grotesk 700, all caps, e.g.: **"43 DEV TOOLS. ZERO UPLOAD. ZERO SIGNUP."**
- Subheadline in JetBrains Mono, Bone White at 80% opacity: one sentence stating the core promise (fast, private, free, runs in your browser).
- Primary CTA button: `[ RUN_TOOLS ]` in Acid Green outline (ghost button style from brand board), with a subtle green glow/border animation on hover.
- Secondary CTA: plain text link, `> view source on github`, muted white, underline on hover.
- Background animation: fractured triangle logo mark, faint, slowly rotating/drifting in the far background (parallax on scroll, very subtle, do not distract from text).

### 3. Social Proof Strip (thin band, immediately after hero)
- Single horizontal line, JetBrains Mono, small caps: e.g. `TRUSTED BY DEVELOPERS AT` or, if no logos yet, use a stat-driven line instead: `100% CLIENT-SIDE · 0 SERVER UPLOADS · 43 TOOLS · MIT LICENSED`
- Render as a scrolling/marquee ticker (infinite horizontal scroll, pauses on hover) — keeps kinetic brand feel even with sparse content.

### 4. Feature Grid (MOFU — Interest)
- Section header: `WHAT'S INSIDE` (Space Grotesk bold)
- Grid of 6-8 featured tool cards (not all 43 — curate the best/most-searched: JSON Formatter, JWT Decoder, Regex Tester, Password Generator, Hash Generator, Code Formatter, Diff Checker, UUID Generator).
- Each card: 1px white border, black background, tool name in Space Grotesk, one-line description in JetBrains Mono, small `[RUN]` tag in top-right corner (from brand board's UI element reference).
- On hover: border shifts to Acid Green, card lifts 2-4px with a hard drop-shadow (no blur, keep it sharp/brutalist — offset shadow, not soft glow), subtle scramble-text effect on the tool name (letters glitch briefly then resolve — ties to the "SCRAMBLING..." brand board motif).
- Below grid: text CTA — `> browse all 43 tools →` linking to `/tools`.

### 5. Why Client-Side Matters (MOFU — Consideration / differentiation)
- Two-column layout: left = headline + copy explaining the privacy/speed angle ("Your code never leaves your browser"); right = animated terminal window mockup showing a mock JSON input being formatted live (looping animation, monospace, green cursor blink).
- Use this section to honestly state what IS and ISN'T server-processed (see correction note below) — don't overclaim.
- Include 3 short proof-point rows with icon + stat, e.g.:
  - `⚡ INSTANT` — no network round-trip for core tools
  - `🔒 PRIVATE` — no payload storage for client-side tools
  - `🆓 FREE` — no account, no paywall, no limits

### 6. Comparison Band (MOFU → BOFU bridge)
- Simple two-column "old way vs KRUMB.DEV way" table, styled like the brand board's own X/checkmark comparison graphic:
  - ❌ "Upload your code to a random site" → ✅ "Runs entirely in your browser"
  - ❌ "Sign up just to format JSON" → ✅ "Zero accounts, ever"
  - ❌ "Cluttered ad-heavy tool sites" → ✅ "Clean terminal-inspired interface"
  - ❌ "One tool per bookmark" → ✅ "43 tools, one URL"
- Red X in a dark muted red, green check in Acid Green, both on black cards with 1px borders — matches brand board iconography exactly.

### 7. Final CTA Band (BOFU — Decision)
- Full-width, high-contrast black section, grid/scanline texture at higher visibility here (this is the climax moment).
- Large centered headline: **"STOP SEARCHING. START RUNNING."** (or similar terminal-command-styled CTA copy)
- One single, unmissable Acid Green button: `[ RUN_TOOLS.EXE ]` — largest CTA on the page, with a jittery micro-animation on load (ties to "jittery animations" in brand board philosophy) and a hard glow-border pulse every few seconds to draw the eye.
- Directly below: reassurance microcopy in JetBrains Mono, small, muted: `no signup · no credit card · runs instantly`

### 8. Footer
- Black background, 1px top border.
- Left: logo mark + `© 2026 KRUMB.DEV`
- Right: links — `Tools`, `About`, `Privacy`, `Terms`, `Report Bug`, GitHub icon link.
- Keep minimal — this is not a content-heavy footer, matches the brutalist "no navigation clutter" philosophy.

---

## ANIMATION SPEC (build with Framer Motion if React/Next.js, or CSS + minimal JS if static HTML)

1. **Typewriter cycle** in hero (tool names cycling) — 60-80ms per character, 1.5s pause, backspace, repeat.
2. **Scramble-text hover effect** on feature card titles — scramble through random characters for ~300ms before resolving to real text (classic "decoding" effect, matches brand board's `[SCRAMBLING...]` UI element).
3. **Ghost button hover** — border color transition black/white → Acid Green over 150ms, no fill change (matches brand board "Hover Border" spec exactly).
4. **Card hover lift** — translateY(-4px) with a hard offset box-shadow (e.g. `4px 4px 0px var(--krumb-green)`), NOT a soft blurred shadow — must feel mechanical, not soft-SaaS.
5. **Scroll-triggered fade/slide-up** on each section as it enters viewport (staggered children, 400-500ms, ease-out) — subtle, not bouncy.
6. **Background triangle logo drift** — slow continuous rotation/translation in hero background, very low opacity, GPU-accelerated transform only (no layout thrashing).
7. **Marquee ticker** in social proof strip — CSS animation, infinite loop, pause-on-hover.
8. **Final CTA pulse** — border-glow keyframe animation, subtle, repeats every 4-6s, stops on hover (replaced by direct hover state).

Performance rule: every animation must use `transform`/`opacity` only — no animating `width`, `height`, `top`/`left`, or `box-shadow` blur radius (causes jank). Respect `prefers-reduced-motion` — disable non-essential motion (typewriter can stay, but scramble/pulse/drift should turn off).

---

## TECHNICAL REQUIREMENTS

- Framework: match existing stack — Next.js 16, TypeScript strict, Tailwind CSS 4 (consistent with the main ToolHub app so this can live in the same repo as a `/` marketing route, or as a separate static page).
- Fully responsive: mobile-first, hero headline scales down gracefully, feature grid collapses to single column below 640px, marquee/comparison sections stack vertically on mobile.
- All CTAs (`RUN_TOOLS`, `browse all tools`, footer `Tools` link) point to the live tools app — do not leave any as placeholder `#` links.
- Accessibility: sufficient contrast (Acid Green on black passes AA for large text — verify for small text/buttons and adjust size/weight if needed), all interactive elements keyboard-navigable, `prefers-reduced-motion` respected as noted above, semantic HTML landmarks.
- SEO: proper meta title/description for the landing page itself (distinct from the tool pages), OG image showing the brand board aesthetic, single canonical URL.

---

## ⚠️ IMPORTANT CORRECTION — READ BEFORE WRITING ANY "NO TRACKING / ZERO SERVER" COPY

Your current site copy claims "strict zero-server-call architecture" and "we do not track your payload data," but your own README lists three live server-side routes: `track`, `webhook-proxy`, and `dns-ssl-lookup`. Do NOT repeat the blanket "zero server, no tracking" claim on this new landing page — it will be directly contradicted by anyone checking devtools' network tab, and undermines the trust angle you're building the whole page around.

Instead, write it accurately, e.g.:
> "Most tools — formatting, encoding, hashing, generating — run 100% in your browser. A small number of tools (DNS/SSL lookups, webhook testing) require a lightweight edge function, clearly noted on those tool pages."

This is more credible, not less — precision reads as more trustworthy than a blanket claim to a developer audience, who will actively verify it.
