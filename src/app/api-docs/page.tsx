import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About This Project',
  description: 'KRUMB.DEV is a collection of browser-based developer tools. Most tools are fully client-side; some use lightweight edge APIs for operations browsers cannot perform natively.',
  alternates: {
    canonical: './'
  }
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#F9F9F9]">
      <div className="pt-24 md:pt-32 pb-16 px-6 md:px-10 space-y-10">
        <div className="space-y-4 border-b border-[#333333] pb-6">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-[#F9F9F9] leading-none tracking-tight">
            <span className="text-[#00FF41] font-mono text-lg mr-3">$</span> ABOUT / FAQ
          </h1>
          <p className="font-mono text-xs md:text-sm text-[#888888]">
            <span className="text-[#555555]">#</span> How this project works.
          </p>
        </div>

        <div className="space-y-10 font-mono text-xs md:text-sm text-[#888888] leading-relaxed">
          <section className="space-y-3 border-l-2 border-[#333333] pl-5">
            <h2 className="font-heading text-lg md:text-xl font-bold text-[#F9F9F9] flex items-center gap-2">
              <span className="text-[#00FF41] font-mono text-sm">01</span>
              CLIENT-SIDE FIRST
            </h2>
          <p>
            Most tools on KRUMB.DEV run entirely in your browser — JSON formatting, code beautification, hash generation, Base64 encoding, regex testing, and more. For these tools, your data never leaves your device and everything works offline after the initial page load.
          </p>
          <p>
            A small number of tools (DNS/SSL lookup, webhook testing, IP lookup) require lightweight edge API calls for operations browsers cannot perform natively. These APIs do not log your data and are purpose-built for each tool. We are transparent about which tools use them.
          </p>
        </section>

        <section className="space-y-3 border-l-2 border-[#333333] pl-5">
          <h2 className="font-heading text-lg md:text-xl font-bold text-[#F9F9F9] flex items-center gap-2">
            <span className="text-[#00FF41] font-mono text-sm">02</span>
            USING THE TOOLS PROGRAMMATICALLY
          </h2>
          <p>
            Since most tools are client-side, you can open your browser&apos;s developer tools, inspect the JavaScript, and reuse the logic in your own projects. The site is open for you to learn from and build upon. For tools that use edge APIs, the request format is visible in the browser network tab.
          </p>
        </section>
      </div>

      {/* Terminal footer */}
      <div className="border-t border-[#333333] pt-6">
        <p className="font-mono text-[10px] text-[#555555]">
          <span className="text-[#444444]">$</span> EOF
        </p>
      </div>
    </div>
  </div>
  )
}
