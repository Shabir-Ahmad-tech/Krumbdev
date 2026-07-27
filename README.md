# ToolHub — Developer Tools, One URL

> **Browser-based developer tools for formatting, encoding, validating, generating, and converting code. Most tools are fully client-side; tools that need server logic (DNS, SSL, webhook proxying) use purpose-built edge functions with no payload logging.**

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shabir-Ahmad-tech/toolhub)

---

## What It Is

ToolHub is a **Next.js 16** app that bundles **43 developer utilities** into one focused interface — JSON formatter, JWT decoder, regex tester, code beautifier, JS/HTML minifier, password generator, color palette generator, and more. Every tool runs **100% client-side** using the Web Crypto API and standard browser APIs. Nothing is uploaded to any server.

**No database needed.** ToolHub is a static-first application. User preferences (language selection, tool history) are stored locally in `localStorage`. There are no user accounts, no sessions, and no persistent storage backend. This means deployment is trivial — push to Vercel, Netlify, or any static host and it works.

---

## Features

### Developer Tools (43 total)

| Tool | Slug | Description |
|------|------|-------------|
| **JSON Formatter** | `/json-formatter` | Format, validate, minify JSON with schema support |
| **JWT Decoder** | `/jwt-decoder` | Decode JWT header/payload, check expiry |
| **Code Formatter** | `/code-formatter` | Beautify JS/TS/HTML/CSS/Python/17 languages |
| **Regex Tester** | `/regex-tester` | Test patterns with capture groups and flags |
| **Base64 Encoder/Decoder** | `/base64-encoder` | Encode/decode text and file to Base64 |
| **UUID Generator** | `/uuid-generator` | v1/v3/v4/v5 UUIDs with bulk mode |
| **Hash Generator** | `/hash-generator` | MD5, SHA-1/256/512, HMAC, batch processing |
| **Password Generator** | `/password-generator` | Strong secure passwords with custom charsets |
| **Unix Timestamp Converter** | `/unix-timestamp-converter` | Epoch ↔ date conversion |
| **YAML ↔ JSON Converter** | `/yaml-json-converter` | Two-way conversion with live error alerts |
| **JSON ↔ CSV Converter** | `/json-csv-converter` | Two-way structured data conversion |
| **Diff Checker** | `/diff-checker` | Side-by-side text/code comparison |
| **URL Encoder/Decoder** | `/url-encoder` | Encode/decode URL-safe strings |
| **Hex ↔ RGB Converter** | `/hex-to-rgb` | Color format conversion |
| **Binary Converter** | `/binary-converter` | Decimal/hex/octal/binary ↔ ASCII |
| **HTML Playground** | `/html-playground` | Live HTML/CSS/JS sandbox |
| **Markdown Editor** | `/markdown-editor` | Live preview with export |
| **QR Code Generator/Decoder** | `/qr-code-generator` / `/qr-code-decoder` | Create and read QR codes |
| **Webhook Tester** | `/webhook-tester` | Mock Stripe/GitHub/Shopify payloads |
| **API Response Validator** | `/api-response-validator` | Validate HTTP status + headers |
| **cURL → Code Converter** | `/curl-to-code` | cURL to fetch/Axios/Python/Go snippets |
| **HTTP Status Codes** | `/http-status-codes` | Browse 60+ HTTP status codes with descriptions |
| **SQL Formatter** | `/sql-formatter` | Beautify SQL queries for 17+ dialects |
| **CSS Gradient Generator** | `/css-gradient-generator` | Create linear, radial, conic gradients visually |
| **CSS Box Shadow Generator** | `/css-box-shadow-generator` | Multi-layer box shadows with live preview |
| **CSS Grid Generator** | `/css-grid-generator` | Visual CSS Grid and Flexbox layout builder |
| **Case Converter** | `/case-converter` | Convert between camelCase, snake_case, PascalCase, etc. |
| **Lorem Ipsum Generator** | `/lorem-ipsum-generator` | Generate placeholder text with custom options |
| **HTML to Markdown Converter** | `/html-to-markdown-converter` | Convert HTML to clean Markdown |
| **JavaScript Minifier** | `/js-minifier` | Strip comments, whitespace, compress JS code |
| **HTML Minifier** | `/html-minifier` | Strip comments, collapse whitespace, compress HTML |
| **HTML to JSX Converter** | `/html-to-jsx-converter` | Convert HTML to React-compatible JSX syntax |
| **Color Palette Generator** | `/color-palette-generator` | Generate harmonious color schemes from any color |
| **Cron Expression Builder** | `/cron-expression-builder` | Build cron schedules with visual preview |
| **cURL → Code Converter** | `/curl-to-code` | Convert cURL commands to code snippets |
| **.gitignore Generator** | `/gitignore-generator` | Generate .gitignore files for any tech stack |
| **Code Playground** | `/code-playground` | Live coding environment with multiple languages |
| **JSON → TypeScript** | `/json-to-typescript` | Generate TypeScript interfaces from JSON |
| **SVG to JSX** | `/svg-to-jsx` | Convert SVG markup to React JSX components |
| **Meta Tag Generator** | `/meta-tag-generator` | Generate SEO meta tags for any page |
| **Robots.txt & Sitemap Generator** | `/robots-sitemap-generator` | Create robots.txt and XML sitemaps |
| **IBAN & SWIFT Validator** | `/iban-validator` | Validate and parse IBAN numbers for 80+ countries |
| **DNS Lookup & SSL Checker** | `/dns-ssl-checker` | Lookup DNS records, verify SSL certificates |

### SEO Variant Pages (Programmatic)

Each tool has **targeted landing pages** for specific long-tail search queries — automatically generated at build time:

- `/code-formatter/javascript` — "JavaScript code formatter"
- `/code-formatter/typescript` — "TypeScript code formatter"
- `/code-formatter/python` — "Python code formatter"
- `/code-formatter/html` — "HTML code formatter"
- `/json-formatter/validate` — "JSON validator"
- `/json-formatter/beautifier` — "JSON beautifier"
- `/password-generator/strong` — "strong password generator"
- `/password-generator/secure` — "secure password generator for devs"
- `/regex-tester/javascript` — "JavaScript regex tester"
- `/regex-tester/python` — "Python regex tester"
- `/unix-timestamp-converter/epoch-to-date` — "epoch to date converter"
- `/unix-timestamp-converter/date-to-epoch` — "date to epoch converter"

Each variant has unique metadata, 400+ words of original content, FAQPage + BreadcrumbList JSON-LD, and internal links to related tools. The variant registry lives in `src/lib/seo-variants.ts` — add more variants by appending to the array and they are automatically generated at the next build.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript (strict) |
| **UI** | React 19, Tailwind CSS 4, lucide-react |
| **Styling** | Tailwind CSS 4 with custom terminal theme |
| **State** | Local state (React hooks), `localStorage` for history |
| **Crypto** | Web Crypto API (`crypto.getRandomValues()`) |
| **Static Generation** | `generateStaticParams` for tool variants |
| **Deploy** | Vercel (pre-configured) |

---

## Project Structure

```
toolhub/
├── src/
│   ├── app/
│   │   ├── [slug]/[variant]/   ← Programmatic SEO variant pages
│   │   ├── <tool-slug>/        ← Individual tool directories
│   │   │   ├── page.tsx        ← Server component (metadata + re-export)
│   │   │   └── _client.tsx     ← Client component (tool UI)
│   │   ├── layout.tsx          ← Root layout
│   │   ├── sitemap.ts          ← Dynamic sitemap (tools + variants)
│   │   └── robots.ts           ← Robots configuration
│   ├── components/
│   │   ├── layout/             ← TopBar, Footer
│   │   ├── tools/              ← ToolLayout, RelatedTools, ShareButtons
│   │   └── ui/                 ← TerminalButton, CopyButton, Toast
│   ├── lib/
│   │   ├── constants.ts        ← Tool registry (TOOLS array)
│   │   ├── seo-variants.ts     ← SEO variant definitions
│   │   └── utils.ts            ← Helpers
│   └── types/                  ← Global TypeScript types
├── CONTENT_TEMPLATE.md         ← Content structure for each tool page
├── public/                     ← Static assets
└── README.md
```

---

## Getting Started

```bash
# Install
npm install

# Development
npm run dev        # → http://localhost:3000

# Build
npm run build      # Static generation of all tools + variants

# Preview production build
npm run start

# Lint
npm run lint
```

---

## Deploy to Vercel

### One-Click

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shabir-Ahmad-tech/toolhub)

### Manual

1. Push to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. **Framework preset:** Next.js (auto-detected)
5. **Build command:** `npm run build` (default)
6. **Output directory:** `.next` (default)
7. **Environment variables:** None required

The app requires **zero environment variables** to function. No database URL, no API keys, no secrets.

### What Vercel Handles

| Concern | How It's Handled |
|---------|-----------------|
| **Build** | `npm run build` — generates all tools + SEO variants statically |
| **Routing** | Next.js App Router — all routes pre-rendered at build time |
| **API routes** | Three minimal routes (`track`, `webhook-proxy`, `dns-ssl-lookup`) — run as Vercel Edge Functions |
| **Static pages** | 65 pages generated (47 tools + 12 SEO variants + static pages + API routes) |
| **SSL** | Auto-provisioned by Vercel |
| **CDN** | Vercel Edge Network |

### Troubleshooting

**Q: Build fails with "Legacy octal escape is not permitted in strict mode"**  
This error comes from unescaped `\0` sequences in template literals. Fix: replace `\033` with `\\033` (escaped backslash) or `\\x1b` in any string that contains ANSI escape codes. The current codebase has all instances properly fixed — this error should not reappear.

**Q: 404 on variant pages after deploy**  
Ensure you deployed the latest commit. Variant pages are generated by `generateStaticParams` in `src/app/[slug]/[variant]/page.tsx` — they only exist for entries defined in `src/lib/seo-variants.ts`.

---

## Adding a New Tool

1. Create `src/app/<tool-slug>/page.tsx` with metadata export
2. Create `src/app/<tool-slug>/_client.tsx` with the tool component
3. Add the tool entry to `src/lib/constants.ts` in the `TOOLS` array
4. Add the slug to `BUILT_TOOLS` in `src/lib/constants.ts`
5. Add SEO variants in `src/lib/seo-variants.ts` if desired
6. The sitemap will pick up the new tool automatically

---

## License

MIT — do whatever you want with it.
