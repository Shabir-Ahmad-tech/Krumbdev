'use client'

import { useState } from 'react'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { Copy, RefreshCw } from 'lucide-react'

const stringFaq = [
  {
    question: 'Why do strings need to be escaped?',
    answer: 'String escaping converts special characters like quotes, backslashes, newlines, and HTML tags into safe representation formats. This prevents syntax errors, injection attacks (XSS, SQL injection), and formatting bugs when passing strings across programming languages or network protocols.'
  },
  {
    question: 'What target formats are supported?',
    answer: 'This tool supports JavaScript/JSON escaping (e.g. \\n, \\t, \\"), HTML Entities (e.g. &amp;, &lt;, &gt;, &quot;), XML, SQL single-quote escaping (\' -> \'\'), and CSV double-quote escaping.'
  }
]

const stringSeo = (
  <div className="space-y-4">
    <h2 className="text-lg font-heading font-bold text-[#F9F9F9]">String Escaper & Unescaper</h2>
    <p>
      Format and sanitize raw text strings into escaped representations for JavaScript, JSON, HTML, XML, SQL, and CSV. Copy escaped strings directly into source code without syntax errors.
    </p>
  </div>
)

type FormatType = 'javascript' | 'html' | 'xml' | 'sql' | 'csv'

export default function StringEscapeUnescapeClient() {
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape')
  const [format, setFormat] = useState<FormatType>('javascript')
  const [input, setInput] = useState<string>('Hello "World"!\nLine 2 with <tag> & \'quotes\'')
  const [output, setOutput] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const processText = () => {
    if (!input) {
      setOutput('')
      return
    }

    try {
      if (mode === 'escape') {
        if (format === 'javascript') {
          setOutput(JSON.stringify(input).slice(1, -1))
        } else if (format === 'html') {
          setOutput(
            input
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;')
          )
        } else if (format === 'xml') {
          setOutput(
            input
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;')
          )
        } else if (format === 'sql') {
          setOutput(input.replace(/'/g, "''").replace(/\\/g, '\\\\'))
        } else if (format === 'csv') {
          setOutput(`"${input.replace(/"/g, '""')}"`)
        }
      } else {
        // Unescape
        if (format === 'javascript') {
          try {
            setOutput(JSON.parse(`"${input}"`))
          } catch {
            setOutput(
              input
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t')
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\')
            )
          }
        } else if (format === 'html' || format === 'xml') {
          const doc = new DOMParser().parseFromString(input, 'text/html')
          setOutput(doc.documentElement.textContent || input)
        } else if (format === 'sql') {
          setOutput(input.replace(/''/g, "'").replace(/\\\\/g, '\\'))
        } else if (format === 'csv') {
          let s = input
          if (s.startsWith('"') && s.endsWith('"')) {
            s = s.slice(1, -1)
          }
          setOutput(s.replace(/""/g, '"'))
        }
      }
    } catch (err: any) {
      setOutput(`Error: ${err?.message || 'Failed to process string'}`)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolLayout
      title="String Escaper & Unescaper"
      description="Escape and unescape text strings for JavaScript, JSON, HTML entities, XML, SQL, and CSV."
      toolSlug="string-escape-unescape"
      faq={stringFaq}
      seoContent={stringSeo}
    >
      <div className="space-y-6">
        {/* Control bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('escape')}
              className={`terminal-btn ${mode === 'escape' ? 'text-[#00FF41]' : ''}`}
            >
              [<span className="green-chevron">&gt;</span> Escape String]
            </button>
            <button
              type="button"
              onClick={() => setMode('unescape')}
              className={`terminal-btn ${mode === 'unescape' ? 'text-[#00FF41]' : ''}`}
            >
              [<span className="green-chevron">&gt;</span> Unescape String]
            </button>
          </div>

          {/* Format selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#888888]">Format:</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as FormatType)}
              className="px-3 py-1.5 border border-[#444444] bg-[#000000] text-[#F9F9F9] font-mono text-xs focus:border-[#00FF41] focus:outline-none"
            >
              <option value="javascript">JavaScript / JSON</option>
              <option value="html">HTML Entities</option>
              <option value="xml">XML</option>
              <option value="sql">SQL String</option>
              <option value="csv">CSV Field</option>
            </select>
          </div>
        </div>

        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono text-[#888888] uppercase">
              {'>'} INPUT TEXT ({input.length} chars)
            </label>
            {input && (
              <button
                type="button"
                onClick={() => {
                  setInput('')
                  setOutput('')
                }}
                className="text-[10px] font-mono text-[#555555] hover:text-[#F9F9F9] uppercase tracking-wider"
              >
                [ CLEAR ]
              </button>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="Type or paste your text here..."
            className="w-full px-4 py-3 border border-[#F9F9F9] bg-[#000000] text-[#F9F9F9] font-mono text-xs md:text-sm focus:border-2 focus:border-[#00FF41] focus:outline-none resize-y"
          />
        </div>

        <button
          type="button"
          onClick={processText}
          className="terminal-btn bg-[#00FF41] text-[#000000] font-bold hover:bg-[#00CC33]"
        >
          [ &gt; {mode === 'escape' ? 'ESCAPE STRING' : 'UNESCAPE STRING'} ]
        </button>

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono text-[#888888] uppercase">{'>'} RESULT</label>
              <button
                type="button"
                onClick={copyToClipboard}
                className="terminal-btn"
              >
                [<span className="green-chevron">&gt;</span> {copied ? 'COPIED' : 'COPY'}]
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              rows={6}
              className="w-full px-4 py-3 border border-[#00FF41] bg-[#000000] text-[#00FF41] font-mono text-xs md:text-sm focus:outline-none resize-y"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
