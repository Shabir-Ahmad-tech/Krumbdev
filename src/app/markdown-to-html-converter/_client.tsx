'use client'

import { useState } from 'react'
import Link from 'next/link'
import TurndownService from 'turndown'
import { Copy, Check, Download, ArrowLeftRight } from 'lucide-react'

const SAMPLE_MD = `# Welcome to Markdown to HTML

This is a **live Markdown to HTML** converter.

## Features:
- Converts **headings**, *italics*, and **bold** text.
- Formats [links](https://krumb.dev) and inline \`code\`.
- Supports code blocks and blockquotes.

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

\`\`\`javascript
const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
};
greet("KRUMB.DEV");
\`\`\`
`

export default function MarkdownToHtmlClient() {
  const [mode, setMode] = useState<'md2html' | 'html2md'>('md2html')
  const [inputText, setInputText] = useState(SAMPLE_MD)
  const [copied, setCopied] = useState(false)

  // Markdown -> HTML parser
  const mdToHtml = (md: string) => {
    if (!md.trim()) return ''
    let html = md
      // Escaping HTML characters slightly
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // Code blocks
    html = html.replace(/```(\w+)?\r?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
    })

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

    // Blockquotes
    html = html.replace(/^\&gt;\s?(.*$)/gim, '<blockquote>$1</blockquote>')

    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

    // Lists
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')

    // Paragraphs
    const lines = html.split(/\r?\n\r?\n/)
    return lines
      .map(line => {
        const trimmed = line.trim()
        if (
          trimmed.startsWith('<h') ||
          trimmed.startsWith('<pre') ||
          trimmed.startsWith('<ul') ||
          trimmed.startsWith('<blockquote')
        ) {
          return trimmed
        }
        return `<p>${trimmed.replace(/\r?\n/g, '<br />')}</p>`
      })
      .join('\n\n')
  }

  // HTML -> Markdown parser using Turndown
  const htmlToMd = (html: string) => {
    if (!html.trim()) return ''
    try {
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
      })
      return turndownService.turndown(html)
    } catch {
      return 'Error parsing HTML to Markdown'
    }
  }

  const outputText = mode === 'md2html' ? mdToHtml(inputText) : htmlToMd(inputText)

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const ext = mode === 'md2html' ? 'html' : 'md'
    const mime = mode === 'md2html' ? 'text/html' : 'text/markdown'
    const blob = new Blob([outputText], { type: `${mime};charset=utf-8` })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `output.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleMode = () => {
    const newMode = mode === 'md2html' ? 'html2md' : 'md2html'
    setMode(newMode)
    setInputText(outputText)
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#F9F9F9] pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#333333] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#888888] mb-2">
          <Link href="/tools" className="hover:text-[#00FF41] transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-[#F9F9F9]">markdown-to-html-converter</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-4xl font-bold text-[#F9F9F9] tracking-tight">
              <span className="text-[#00FF41] font-mono text-xl mr-2">&gt;</span>
              {mode === 'md2html' ? 'Markdown to HTML Converter' : 'HTML to Markdown Converter'}
            </h1>
            <p className="font-mono text-xs md:text-sm text-[#888888] mt-2">
              Convert Markdown markup to HTML or convert HTML back into clean Markdown.
            </p>
          </div>

          <button
            onClick={toggleMode}
            className="flex items-center gap-2 font-mono text-xs font-bold text-[#00FF41] border border-[#00FF41] px-4 py-2 hover:bg-[#00FF41]/10 transition-colors w-fit"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Switch to {mode === 'md2html' ? 'HTML ↔ Markdown' : 'Markdown ↔ HTML'}
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-[#888888]">
            <span>{mode === 'md2html' ? 'Markdown Input:' : 'HTML Input:'}</span>
            <button
              onClick={() => setInputText(SAMPLE_MD)}
              className="text-[#00FF41] hover:underline"
            >
              Load Sample
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={mode === 'md2html' ? 'Type or paste Markdown here...' : 'Type or paste HTML markup here...'}
            className="w-full h-[450px] bg-[#050505] border border-[#333333] p-4 font-mono text-xs text-[#F9F9F9] focus:border-[#00FF41] outline-none resize-none"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-[#888888]">
            <span>{mode === 'md2html' ? 'HTML Output:' : 'Markdown Output:'}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="text-[#00FF41] hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="text-[#00FF41] hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={outputText}
            className="w-full h-[450px] bg-[#050505] border border-[#333333] p-4 font-mono text-xs text-[#00FF41] outline-none resize-none select-all"
          />
        </div>
      </div>
    </div>
  )
}
