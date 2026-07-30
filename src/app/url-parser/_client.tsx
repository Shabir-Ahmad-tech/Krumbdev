'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check, RotateCcw, Plus, Trash2 } from 'lucide-react'

const SAMPLE_URL = 'https://api.example.com:8080/v1/users/search?query=developer+tools&category=web&page=2&sort=desc#results'

export default function UrlParserClient() {
  const [inputUrl, setInputUrl] = useState(SAMPLE_URL)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const parseUrlString = (urlStr: string) => {
    try {
      const u = new URL(urlStr.trim())
      const params: Array<{ key: string; value: string }> = []
      u.searchParams.forEach((value, key) => {
        params.push({ key, value })
      })

      return {
        valid: true,
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port || (u.protocol === 'https:' ? '443 (default)' : '80 (default)'),
        origin: u.origin,
        pathname: u.pathname,
        search: u.search,
        hash: u.hash || '(none)',
        params,
        error: null,
      }
    } catch (e: any) {
      return {
        valid: false,
        protocol: '',
        hostname: '',
        port: '',
        origin: '',
        pathname: '',
        search: '',
        hash: '',
        params: [],
        error: e?.message || 'Invalid URL string',
      }
    }
  }

  const parsed = parseUrlString(inputUrl)

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(keyName)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const updateParam = (index: number, newKey: string, newVal: string) => {
    try {
      const u = new URL(inputUrl.trim())
      const entries: Array<[string, string]> = []
      let i = 0
      u.searchParams.forEach((val, k) => {
        if (i === index) {
          if (newKey) entries.push([newKey, newVal])
        } else {
          entries.push([k, val])
        }
        i++
      })
      u.search = ''
      entries.forEach(([k, v]) => u.searchParams.append(k, v))
      setInputUrl(u.toString())
    } catch {}
  }

  const removeParam = (index: number) => {
    try {
      const u = new URL(inputUrl.trim())
      const entries: Array<[string, string]> = []
      let i = 0
      u.searchParams.forEach((val, k) => {
        if (i !== index) entries.push([k, val])
        i++
      })
      u.search = ''
      entries.forEach(([k, v]) => u.searchParams.append(k, v))
      setInputUrl(u.toString())
    } catch {}
  }

  const addParam = () => {
    try {
      const u = new URL(inputUrl.trim())
      u.searchParams.append('new_param', 'value')
      setInputUrl(u.toString())
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#F9F9F9] pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#333333] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#888888] mb-2">
          <Link href="/tools" className="hover:text-[#00FF41] transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-[#F9F9F9]">url-parser</span>
        </div>
        <h1 className="font-heading text-2xl md:text-4xl font-bold text-[#F9F9F9] tracking-tight">
          <span className="text-[#00FF41] font-mono text-xl mr-2">&gt;</span>URL Parser & Query Extractor
        </h1>
        <p className="font-mono text-xs md:text-sm text-[#888888] mt-2">
          Deconstruct URLs into protocol, host, pathname, query parameters, and hash with live editor.
        </p>
      </div>

      {/* Input URL */}
      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono text-xs text-[#888888]">
          <span>Target URL String:</span>
          <button
            onClick={() => setInputUrl(SAMPLE_URL)}
            className="text-[#00FF41] hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Sample
          </button>
        </div>
        <input
          type="text"
          value={inputUrl}
          onChange={e => setInputUrl(e.target.value)}
          placeholder="https://example.com/path?key=value#hash"
          className="w-full bg-[#050505] border border-[#333333] px-4 py-3 font-mono text-xs md:text-sm text-[#00FF41] focus:border-[#00FF41] outline-none"
        />
      </div>

      {parsed.valid ? (
        <div className="space-y-6">
          {/* Component Breakdown Table */}
          <div className="border border-[#333333] bg-[#0a0a0a] p-4 font-mono text-xs">
            <h2 className="text-[#F9F9F9] font-bold border-b border-[#222222] pb-2 mb-3">URL Structure Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: 'Protocol', val: parsed.protocol },
                { label: 'Hostname', val: parsed.hostname },
                { label: 'Port', val: parsed.port },
                { label: 'Origin', val: parsed.origin },
                { label: 'Pathname', val: parsed.pathname },
                { label: 'Hash / Anchor', val: parsed.hash },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between bg-[#000000] border border-[#222222] p-2.5">
                  <span className="text-[#888888]">{item.label}:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00FF41] font-bold">{item.val}</span>
                    <button
                      onClick={() => handleCopy(item.val, item.label)}
                      className="text-[#555555] hover:text-[#00FF41]"
                    >
                      {copiedKey === item.label ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Query Parameters Table */}
          <div className="border border-[#333333] bg-[#0a0a0a] p-4 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#222222] pb-2">
              <h2 className="text-[#F9F9F9] font-bold">Query Parameters ({parsed.params.length})</h2>
              <button
                onClick={addParam}
                className="text-[#00FF41] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Parameter
              </button>
            </div>

            {parsed.params.length === 0 ? (
              <div className="text-[#555555] italic py-2">No query parameters found in this URL.</div>
            ) : (
              <div className="space-y-2">
                {parsed.params.map((p, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 bg-[#000000] border border-[#222222] p-2">
                    <input
                      type="text"
                      value={p.key}
                      onChange={e => updateParam(idx, e.target.value, p.value)}
                      className="w-full sm:w-1/3 bg-[#050505] border border-[#333333] px-2 py-1 text-[#F9F9F9] focus:border-[#00FF41] outline-none"
                    />
                    <span className="text-[#555555] hidden sm:inline">=</span>
                    <input
                      type="text"
                      value={p.value}
                      onChange={e => updateParam(idx, p.key, e.target.value)}
                      className="w-full sm:w-2/3 bg-[#050505] border border-[#333333] px-2 py-1 text-[#00FF41] focus:border-[#00FF41] outline-none"
                    />
                    <button
                      onClick={() => removeParam(idx)}
                      className="text-[#FF4444] hover:bg-[#FF4444]/10 p-1.5 transition-colors"
                      title="Remove parameter"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-[#FF4444]/10 border border-[#FF4444] font-mono text-xs text-[#FF4444]">
          Malformed URL: {parsed.error}. Ensure the URL starts with `http://` or `https://`.
        </div>
      )}
    </div>
  )
}
