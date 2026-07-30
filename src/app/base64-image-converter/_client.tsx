'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Copy, Check, Download, Upload, Image as ImageIcon } from 'lucide-react'

export default function Base64ImageConverterClient() {
  const [tab, setTab] = useState<'encode' | 'decode'>('encode')
  const [base64Output, setBase64Output] = useState('')
  const [base64Input, setBase64Input] = useState('')
  const [imageMeta, setImageMeta] = useState<{ name: string; type: string; size: number } | null>(null)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Encode Image -> Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageMeta({
      name: file.name,
      type: file.type || 'image/png',
      size: file.size,
    })

    const reader = new FileReader()
    reader.onload = () => {
      setBase64Output(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleCopyBase64 = () => {
    navigator.clipboard.writeText(base64Output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Decode Base64 -> Image
  const getCleanDataUri = (input: string) => {
    const trimmed = input.trim()
    if (trimmed.startsWith('data:image')) return trimmed
    // Default to png if no data uri prefix provided
    return `data:image/png;base64,${trimmed}`
  }

  const handleDownloadDecodedImage = () => {
    if (!base64Input.trim()) return
    const uri = getCleanDataUri(base64Input)
    const a = document.createElement('a')
    a.href = uri
    a.download = 'decoded_image.png'
    a.click()
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#F9F9F9] pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#333333] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#888888] mb-2">
          <Link href="/tools" className="hover:text-[#00FF41] transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-[#F9F9F9]">base64-image-converter</span>
        </div>
        <h1 className="font-heading text-2xl md:text-4xl font-bold text-[#F9F9F9] tracking-tight">
          <span className="text-[#00FF41] font-mono text-xl mr-2">&gt;</span>Base64 to Image & Image to Base64
        </h1>
        <p className="font-mono text-xs md:text-sm text-[#888888] mt-2">
          Convert image files (PNG, JPG, SVG, WebP) to Base64 Data URIs or decode Base64 back into image files.
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-3 font-mono text-xs border-b border-[#333333] pb-4">
        <button
          onClick={() => setTab('encode')}
          className={`px-4 py-2 border transition-colors ${
            tab === 'encode'
              ? 'border-[#00FF41] text-[#00FF41] bg-[#00FF41]/10 font-bold'
              : 'border-[#333333] text-[#888888] hover:text-[#F9F9F9]'
          }`}
        >
          [ Image to Base64 ]
        </button>
        <button
          onClick={() => setTab('decode')}
          className={`px-4 py-2 border transition-colors ${
            tab === 'decode'
              ? 'border-[#00FF41] text-[#00FF41] bg-[#00FF41]/10 font-bold'
              : 'border-[#333333] text-[#888888] hover:text-[#F9F9F9]'
          }`}
        >
          [ Base64 to Image ]
        </button>
      </div>

      {tab === 'encode' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Upload Box */}
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#333333] hover:border-[#00FF41] bg-[#050505] p-8 text-center cursor-pointer transition-colors space-y-3 flex flex-col items-center justify-center min-h-[300px]"
            >
              <Upload className="w-8 h-8 text-[#00FF41]" />
              <div className="font-mono text-xs text-[#F9F9F9] font-bold">
                Click to upload an Image File
              </div>
              <div className="font-mono text-[11px] text-[#666666]">
                Supports PNG, JPG, SVG, WebP, GIF (Max 10MB)
              </div>
            </div>

            {imageMeta && (
              <div className="bg-[#0a0a0a] border border-[#333333] p-3 font-mono text-xs space-y-1">
                <div className="text-[#00FF41] font-bold">File Information:</div>
                <div className="text-[#888888]">Name: <span className="text-[#F9F9F9]">{imageMeta.name}</span></div>
                <div className="text-[#888888]">Type: <span className="text-[#F9F9F9]">{imageMeta.type}</span></div>
                <div className="text-[#888888]">Size: <span className="text-[#F9F9F9]">{(imageMeta.size / 1024).toFixed(1)} KB</span></div>
              </div>
            )}
          </div>

          {/* Base64 Output Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs text-[#888888]">
              <span>Base64 Data URI:</span>
              <button
                onClick={handleCopyBase64}
                disabled={!base64Output}
                className="text-[#00FF41] hover:underline flex items-center gap-1 disabled:opacity-30"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Data URI'}
              </button>
            </div>
            <textarea
              readOnly
              value={base64Output}
              placeholder="Base64 Data URI will appear here after selecting an image..."
              className="w-full h-[380px] bg-[#050505] border border-[#333333] p-4 font-mono text-xs text-[#00FF41] outline-none resize-none"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Base64 Input Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs text-[#888888]">
              <span>Paste Base64 String or Data URI:</span>
            </div>
            <textarea
              value={base64Input}
              onChange={e => setBase64Input(e.target.value)}
              placeholder="Paste data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
              className="w-full h-[380px] bg-[#050505] border border-[#333333] p-4 font-mono text-xs text-[#F9F9F9] focus:border-[#00FF41] outline-none resize-none"
            />
          </div>

          {/* Image Preview & Download */}
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-[#888888]">
              <span>Decoded Image Preview:</span>
              <button
                onClick={handleDownloadDecodedImage}
                disabled={!base64Input.trim()}
                className="text-[#00FF41] hover:underline flex items-center gap-1 disabled:opacity-30"
              >
                <Download className="w-3.5 h-3.5" /> Download Image
              </button>
            </div>

            <div className="border border-[#333333] bg-[#050505] p-4 min-h-[380px] flex items-center justify-center">
              {base64Input.trim() ? (
                <img
                  src={getCleanDataUri(base64Input)}
                  alt="Decoded Preview"
                  className="max-h-[340px] max-w-full object-contain border border-[#222222]"
                  onError={(e) => {
                    ;(e.target as HTMLElement).style.display = 'none'
                  }}
                />
              ) : (
                <div className="text-[#444444] font-mono text-xs flex flex-col items-center gap-2">
                  <ImageIcon className="w-8 h-8 text-[#333333]" />
                  <span>No Base64 string entered yet</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
