<p align="center">
  <img src="public/icons/logo-icon.svg" alt="KRUMB.DEV" width="80" />
</p>

<h1 align="center">KRUMB.DEV</h1>

<p align="center">
  <strong>49 Developer Tools · Zero Signup · Zero Upload · Zero Tracking</strong>
</p>

<p align="center">
  <a href="https://krumb-dev-five.vercel.app/">🌐 Live Site</a> ·
  <a href="https://github.com/Shabir-Ahmad-tech/toolhub">📦 Source</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-live-00FF41?style=flat-square" />
  <img src="https://img.shields.io/badge/tools-49-000000?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-000000?style=flat-square" />
  <img src="https://img.shields.io/badge/privacy-first-00FF41?style=flat-square" />
</p>

---

**KRUMB.DEV is a privacy-first toolkit for developers.** Format JSON, decode JWTs, test regular expressions, minify code, generate passwords, convert between formats, and dozens more — all inside your browser. Nothing is uploaded. Nothing is tracked. No account required.

> If you've ever hesitated before pasting a JWT or a private key into a random website, this is the alternative you've been looking for.

---

## Why KRUMB.DEV?

Most developer tool websites share the same pattern: create an account, hit a rate limit, endure sidebar ads, and wonder if your paste is being logged somewhere. KRUMB.DEV was built differently.

| Other Sites | KRUMB.DEV |
|---|---|
| Your data is sent to a server for processing | **Everything runs in your browser — 100% client-side** |
| Sign up required for basic features | **Zero accounts. Open the page, use the tool.** |
| Ads, popups, and upgrade prompts | **Clean terminal interface. No distractions.** |
| One tool, one bookmark, one tab | **49 tools at a single URL** |
| Unknown data retention policies | **Your data never leaves your device** |

### Privacy, explained plainly

- JSON payloads, tokens, source code, and passwords are processed locally using browser APIs (`Web Crypto`, `TextEncoder`, native parsers)
- Tools that require server interaction (DNS lookups, SSL certificate checks, webhook proxying) use lightweight edge functions that log nothing and retain no payloads
- No analytics scripts run on any tool page
- No cookies, no fingerprinting, no tracking

---

## Tools

All 47 tools are organized by category. Open any one in seconds.

**Formatters & Validators** · JSON Formatter · JSON Validator · Code Beautifier (17 languages) · SQL Formatter (17 dialects) · HTML Minifier · JavaScript Minifier · CSS Grid Generator · API Response Validator

**Encoders & Decoders** · Base64 Encoder/Decoder · URL Encoder/Decoder · JWT Decoder · HTML to Markdown · HTML to JSX · YAML ↔ JSON · JSON ↔ CSV · Case Converter

**Generators** · Password Generator · UUID Generator (v1/v3/v4/v5) · Hash Generator (MD5, SHA, HMAC) · QR Code Generator · Lorem Ipsum Generator · Color Palette Generator · CSS Gradient Generator · CSS Box Shadow Generator · Meta Tag Generator · Robots.txt & Sitemap Generator · .gitignore Generator

**Testing & Debugging** · Regex Tester · Diff Checker · Webhook Tester (Stripe/GitHub/Shopify) · cURL → Code Converter · HTTP Status Code Reference · Cron Expression Builder · Cron Translator

**Converters** · Unix Timestamp Converter · Hex ↔ RGB · Binary Converter · SVG → JSX · JSON → TypeScript · HTML Playground · Markdown Editor

**Network & Security** · DNS Lookup & SSL Checker · QR Code Decoder · IP Address Lookup · IBAN Validator

---

## Design

The terminal interface is not decorative — it's a deliberate constraint. Every tool fits inside a single-column, monospace layout with no sidebar, no floating widgets, and no visual noise. The result is an environment where the tool and its output are the only things on screen.

- **⌘K** opens a command palette to instantly jump to any tool
- Every output block has a one-click copy button
- All state is local — refreshing the page resets nothing on the server because there is no server

---

## Getting Started

```bash
# No installation needed.
# Just open the site:

open https://krumb-dev-five.vercel.app

# Or press ⌘K and type the tool you need.
```

That's it. No `npm install`, no environment variables, no database migrations.

---

## Deployment

KRUMB.DEV is a static-first Next.js application. It requires no database, no API keys, and no backend services to run. To deploy your own instance or contribute:

```bash
git clone https://github.com/Shabir-Ahmad-tech/toolhub.git
cd toolhub
npm install
npm run dev       # local development
npm run build     # static production build
```

---

## License

MIT — use it, modify it, deploy it. Attribution is appreciated but not required.
