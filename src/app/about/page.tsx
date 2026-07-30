import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About KRUMB.DEV — Privacy-First Developer Tools',
  description: 'KRUMB.DEV is a collection of 55 free developer tools that run entirely in your browser. No signup, no uploads, no tracking. Built for developers who value privacy.',
  alternates: {
    canonical: './'
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#F9F9F9]">
      <div className="pt-24 md:pt-32 pb-16 px-6 md:px-10 max-w-4xl mx-auto space-y-12">

        {/* Page Header */}
        <div className="space-y-4 border-b border-[#333333] pb-8">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-[#F9F9F9] tracking-tight">
            <span className="text-[#00FF41] font-mono text-xl mr-3">&gt;</span>ABOUT
          </h1>
          <p className="font-mono text-xs md:text-sm text-[#888888] leading-relaxed">
            A privacy-first toolkit for developers. 55 tools. Zero servers. Zero signup.
          </p>
        </div>

        {/* What */}
        <div className="space-y-4 font-mono text-xs md:text-sm text-[#888888] leading-relaxed">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-[#F9F9F9]">
            What KRUMB.DEV Is
          </h2>
          <p>
            KRUMB.DEV is a collection of developer utilities — JSON formatters, JWT decoders, regex testers, code beautifiers, generators, converters, and more — packaged into a single, keyboard-friendly interface. Every tool runs in your browser. Nothing is uploaded.
          </p>
          <p>
            It was built because the existing options are fragmented (one bookmark per tool), invasive (signup walls, tracking scripts, data leakage), or cluttered with ads and upgrade prompts. KRUMB.DEV is none of those things.
          </p>
        </div>

        {/* Why */}
        <div className="space-y-4 font-mono text-xs md:text-sm text-[#888888] leading-relaxed border-t border-[#333333] pt-8">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-[#F9F9F9]">
            Why It Exists
          </h2>
          <p>
            Every developer has had this moment: you need to quickly format some JSON, decode a JWT, or test a regex. You search, find a tool, paste your data — and hesitate. Is this site logging my token? Do I need another account? Will my data end up in someone else's training set?
          </p>
          <p>
            KRUMB.DEV removes that hesitation entirely. Your data never leaves your device because the tools don't need a server. For the few operations that genuinely need one (DNS lookups, SSL checks), the server functions are minimal, stateless, and log nothing.
          </p>
        </div>

        {/* How It Works */}
        <div className="space-y-6 border-t border-[#333333] pt-8">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-[#F9F9F9] font-mono text-xs md:text-sm">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#333333] p-5 hover:border-[#00FF41] transition-colors duration-300">
              <div className="text-[#00FF41] font-mono text-sm mb-3">01</div>
              <h3 className="font-heading text-base font-bold text-[#F9F9F9] mb-2">Open the page</h3>
              <p className="font-mono text-xs text-[#888888] leading-relaxed">
                No account, no installation. Every tool is one click away from the homepage or ⌘K command palette.
              </p>
            </div>
            <div className="border border-[#333333] p-5 hover:border-[#00FF41] transition-colors duration-300">
              <div className="text-[#00FF41] font-mono text-sm mb-3">02</div>
              <h3 className="font-heading text-base font-bold text-[#F9F9F9] mb-2">Use the tool</h3>
              <p className="font-mono text-xs text-[#888888] leading-relaxed">
                Paste, type, or generate. The tool processes everything locally using your browser's native APIs.
              </p>
            </div>
            <div className="border border-[#333333] p-5 hover:border-[#00FF41] transition-colors duration-300">
              <div className="text-[#00FF41] font-mono text-sm mb-3">03</div>
              <h3 className="font-heading text-base font-bold text-[#F9F9F9] mb-2">Copy and go</h3>
              <p className="font-mono text-xs text-[#888888] leading-relaxed">
                One-click copy. No data stored, no history saved on a server. Close the tab when you're done.
              </p>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#333333] pt-8">
          <div className="border border-[#333333] p-5 hover:border-[#00FF41] transition-colors duration-300">
            <h3 className="font-heading text-base font-bold text-[#F9F9F9] mb-2 flex items-center gap-2">
              <span className="text-[#00FF41] font-mono text-xs">01/</span> Client-Side by Default
            </h3>
            <p className="font-mono text-xs text-[#888888] leading-relaxed">
              All core tools — formatting, encoding, decoding, generating, validating — execute in your browser using Web APIs. No data is transmitted to any server.
            </p>
          </div>
          <div className="border border-[#333333] p-5 hover:border-[#00FF41] transition-colors duration-300">
            <h3 className="font-heading text-base font-bold text-[#F9F9F9] mb-2 flex items-center gap-2">
              <span className="text-[#00FF41] font-mono text-xs">02/</span> No Tracking
            </h3>
            <p className="font-mono text-xs text-[#888888] leading-relaxed">
              No analytics scripts, no cookies, no fingerprinting, no session recording. What you do on KRUMB.DEV stays on your machine.
            </p>
          </div>
          <div className="border border-[#333333] p-5 hover:border-[#00FF41] transition-colors duration-300">
            <h3 className="font-heading text-base font-bold text-[#F9F9F9] mb-2 flex items-center gap-2">
              <span className="text-[#00FF41] font-mono text-xs">03/</span> No Accounts
            </h3>
            <p className="font-mono text-xs text-[#888888] leading-relaxed">
              There is no signup flow, no user database, no "forgot password" email. Every visitor gets the full experience immediately.
            </p>
          </div>
          <div className="border border-[#333333] p-5 hover:border-[#00FF41] transition-colors duration-300">
            <h3 className="font-heading text-base font-bold text-[#F9F9F9] mb-2 flex items-center gap-2">
              <span className="text-[#00FF41] font-mono text-xs">04/</span> Open Source
            </h3>
            <p className="font-mono text-xs text-[#888888] leading-relaxed">
              The entire codebase is MIT-licensed on GitHub. You can audit it, fork it, deploy your own instance, or contribute improvements.
            </p>
          </div>
        </div>

        {/* Tech */}
        <div className="space-y-4 font-mono text-xs md:text-sm text-[#888888] leading-relaxed border-t border-[#333333] pt-8">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-[#F9F9F9]">
            The Tech Behind It
          </h2>
          <p>
            Built with Next.js, TypeScript, and Tailwind CSS. Deployed as a static site with serverless edge functions for the few operations that require server interaction. No database. No background workers. No external services. This makes it fast, cheap to run, and trivially deployable anywhere that supports Node.js.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-[#333333]">
          <Link
            href="/tools"
            className="terminal-btn"
          >
            [<span className="green-chevron">&gt;</span> Browse All Tools]
          </Link>
          <Link
            href="https://github.com/Shabir-Ahmad-tech/toolhub"
            className="terminal-btn text-[#888888] hover:text-[#00FF41]"
          >
            [<span className="green-chevron">&gt;</span> View Source]
          </Link>
        </div>

      </div>
    </div>
  )
}
