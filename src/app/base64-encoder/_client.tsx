'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { useToast } from '@/components/ui/Toast'
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  File,
  Trash2,
  AlertTriangle,
  Download,
  Music,
  Film
} from 'lucide-react'

const base64Faq = [
  {
    question: 'What is Base64 encoding used for?',
    answer: 'Base64 encodes binary data into ASCII characters. It is commonly used for embedding images in CSS/HTML, transmitting binary files via HTTP, and encoding JWT tokens. The encoding increases data size by approximately 33%, making it inefficient for large files.'
  },
  {
    question: 'Is my file data secure when encoding or decoding?',
    answer: 'Yes. All encoding and decoding happen 100% client-side in your browser. No files or Base64 strings are uploaded to any server, and no data leaves your device.'
  },
  {
    question: 'How does Base64 file decoding work?',
    answer: 'Paste any Base64 string or Data URL (e.g. data:image/png;base64,...). The tool automatically parses the binary header and magic bytes to detect the file type (PNG, JPG, PDF, ZIP, MP3, etc.), renders an interactive preview, and lets you download the exact decoded file with 1 click.'
  },
  {
    question: 'What is the difference between Base64 and Base64URL?',
    answer: 'Standard Base64 uses + and / as the 63rd and 64th characters, which are not URL-safe. Base64URL replaces them with - and _ respectively, and omits padding (=). Enable URL-SAFE mode to decode URL-encoded Base64 strings.'
  },
  {
    question: 'Why does Base64 increase the data size by about 33%?',
    answer: 'Base64 maps every 3 bytes (24 bits) of input into 4 ASCII characters (6 bits each = 24 bits). For every 3 input bytes, you get 4 output characters. The overhead ratio is 4/3 = 1.33, hence ~33% larger.'
  }
]

const base64Seo = (
  <div className="space-y-4">
    <h2 className="text-lg font-heading font-bold text-[#F9F9F9]">Base64 File & Text Encoder / Decoder</h2>
    <h3 className="text-sm font-heading font-bold text-[#F9F9F9]">What It Is</h3>
    <p>
      This tool encodes text or files to Base64 strings and decodes Base64 strings back to their original binary files or plain text, entirely in the browser. Developers use it to convert images to Data URIs, inspect binary file contents, test API payloads, and restore Base64-encoded files back to PNG, JPEG, PDF, ZIP, MP3, and document formats.
    </p>
    <h3 className="text-sm font-heading font-bold text-[#F9F9F9]">How File Decoding Works</h3>
    <p>
      When decoding a Base64 string back to a file, the tool reads the binary byte sequence and detects magic byte signatures (e.g., <code className="px-1.5 py-0.5 bg-[#0a0a0a] text-xs font-mono text-[#818cf8]">89 50 4E 47</code> for PNG, <code className="px-1.5 py-0.5 bg-[#0a0a0a] text-xs font-mono text-[#818cf8]">FF D8 FF</code> for JPEG, <code className="px-1.5 py-0.5 bg-[#0a0a0a] text-xs font-mono text-[#818cf8]">25 50 44 46</code> for PDF). It creates a client-side Blob URL allowing instant previewing and downloading of the restored file without server intervention.
    </p>
  </div>
)

interface TextHistoryItem {
  id: string
  type: 'text'
  mode: 'encode' | 'decode'
  input: string
  output: string
  timestamp: number
}

interface FileHistoryItem {
  id: string
  type: 'file'
  mode: 'encode' | 'decode'
  name: string
  size: number
  mimeType: string
  timestamp: number
}

type HistoryItem = TextHistoryItem | FileHistoryItem

function detectFileFromBytes(bytes: Uint8Array, fallbackMime: string = ''): { mimeType: string; extension: string } {
  if (fallbackMime && fallbackMime !== 'application/octet-stream') {
    const ext = mimeToExt(fallbackMime)
    return { mimeType: fallbackMime, extension: ext }
  }

  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    return { mimeType: 'image/png', extension: '.png' }
  }
  if (bytes.length >= 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return { mimeType: 'image/jpeg', extension: '.jpg' }
  }
  if (bytes.length >= 4 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return { mimeType: 'image/gif', extension: '.gif' }
  }
  if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
    return { mimeType: 'image/webp', extension: '.webp' }
  }
  if (bytes.length >= 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return { mimeType: 'application/pdf', extension: '.pdf' }
  }
  if (bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04) {
    return { mimeType: 'application/zip', extension: '.zip' }
  }
  if (bytes.length >= 4 && bytes[0] === 0x4F && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) {
    return { mimeType: 'audio/ogg', extension: '.ogg' }
  }
  if ((bytes.length >= 3 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) || (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFB)) {
    return { mimeType: 'audio/mpeg', extension: '.mp3' }
  }
  if (bytes.length >= 4 && bytes[0] === 0x1A && bytes[1] === 0x45 && bytes[2] === 0xDF && bytes[3] === 0xA3) {
    return { mimeType: 'video/webm', extension: '.webm' }
  }
  if (bytes.length >= 12 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    return { mimeType: 'video/mp4', extension: '.mp4' }
  }

  try {
    const textSnippet = new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(0, Math.min(bytes.length, 512))).trim()
    if (textSnippet.startsWith('<svg') || textSnippet.includes('xmlns="http://www.w3.org/2000/svg"')) {
      return { mimeType: 'image/svg+xml', extension: '.svg' }
    }
    if (textSnippet.startsWith('<?xml') || textSnippet.startsWith('<')) {
      return { mimeType: 'text/xml', extension: '.xml' }
    }
    if ((textSnippet.startsWith('{') && textSnippet.endsWith('}')) || (textSnippet.startsWith('[') && textSnippet.endsWith(']'))) {
      return { mimeType: 'application/json', extension: '.json' }
    }
    let isText = true
    for (let i = 0; i < Math.min(bytes.length, 256); i++) {
      const b = bytes[i]
      if (b < 9 || (b > 13 && b < 32) || b === 127) {
        isText = false
        break
      }
    }
    if (isText) {
      return { mimeType: 'text/plain', extension: '.txt' }
    }
  } catch {
    // Binary fallback
  }

  return { mimeType: 'application/octet-stream', extension: '.bin' }
}

function mimeToExt(mime: string): string {
  if (mime.includes('png')) return '.png'
  if (mime.includes('jpeg') || mime.includes('jpg')) return '.jpg'
  if (mime.includes('gif')) return '.gif'
  if (mime.includes('webp')) return '.webp'
  if (mime.includes('svg')) return '.svg'
  if (mime.includes('pdf')) return '.pdf'
  if (mime.includes('zip')) return '.zip'
  if (mime.includes('json')) return '.json'
  if (mime.includes('xml')) return '.xml'
  if (mime.includes('html')) return '.html'
  if (mime.includes('text')) return '.txt'
  if (mime.includes('audio/mpeg') || mime.includes('mp3')) return '.mp3'
  if (mime.includes('video/mp4')) return '.mp4'
  return '.bin'
}

export default function Base64EncoderClient() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text')

  // Text Tab State
  const [textMode, setTextMode] = useState<'encode' | 'decode'>('encode')
  const [textInput, setTextInput] = useState<string>('Hello, World!')
  const [textOutput, setTextOutput] = useState<string>('')

  // URL-safe mode toggle
  const [urlSafe, setUrlSafe] = useState(false)

  // File Tab State
  const [fileTabMode, setFileTabMode] = useState<'encode' | 'decode'>('encode')

  // File Encoder State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileBase64, setFileBase64] = useState<string>('')
  const [fileDataUrl, setFileDataUrl] = useState<string>('')
  const [fileError, setFileError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isProcessingFile, setIsProcessingFile] = useState(false)

  // File Decoder State
  const [fileDecodeInput, setFileDecodeInput] = useState<string>('')
  const [decodedBytes, setDecodedBytes] = useState<Uint8Array | null>(null)
  const [decodedMimeType, setDecodedMimeType] = useState<string>('')
  const [decodedExtension, setDecodedExtension] = useState<string>('')
  const [decodedFileName, setDecodedFileName] = useState<string>('decoded_file')
  const [decodedBlobUrl, setDecodedBlobUrl] = useState<string>('')
  const [fileDecodeError, setFileDecodeError] = useState<string | null>(null)
  const [decodedTextPreview, setDecodedTextPreview] = useState<string | null>(null)

  // Copy and UI State
  const [copiedText, setCopiedText] = useState<'output' | 'dataUrl' | 'rawBase64' | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const fileDecoderInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (decodedBlobUrl) {
        URL.revokeObjectURL(decodedBlobUrl)
      }
    }
  }, [decodedBlobUrl])

  useEffect(() => {
    const saved = localStorage.getItem('base64_history')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading history:', e)
      }
    }
  }, [])

  const encodeText = (str: string) => {
    try {
      const bytes = new TextEncoder().encode(str)
      const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("")
      let base64 = btoa(binString)
      if (urlSafe) {
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      }
      return base64
    } catch {
      return 'Error: Could not encode text'
    }
  }

  const decodeText = (str: string) => {
    try {
      let input = str.trim()
      if (urlSafe) {
        input = input.replace(/-/g, '+').replace(/_/g, '/')
        while (input.length % 4) input += '='
      }
      const binString = atob(input)
      const bytes = Uint8Array.from(binString, (char) => char.charCodeAt(0))
      return new TextDecoder().decode(bytes)
    } catch {
      return 'Error: Invalid Base64 input'
    }
  }

  const handleTextConvert = () => {
    if (!textInput.trim()) {
      setTextOutput('')
      return
    }

    let result = ''
    if (textMode === 'encode') {
      result = encodeText(textInput)
    } else {
      result = decodeText(textInput)
    }

    setTextOutput(result)

    const item: TextHistoryItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      type: 'text',
      mode: textMode,
      input: textInput,
      output: result,
      timestamp: Date.now()
    }
    saveToHistory(item)
  }

  const handleClearText = () => {
    setTextInput('')
    setTextOutput('')
  }

  const handleDecodeFileFromBase64 = (rawInput?: string) => {
    const input = (rawInput !== undefined ? rawInput : fileDecodeInput).trim()
    setFileDecodeError(null)
    setDecodedBytes(null)
    setDecodedTextPreview(null)

    if (decodedBlobUrl) {
      URL.revokeObjectURL(decodedBlobUrl)
      setDecodedBlobUrl('')
    }

    if (!input) return

    try {
      let cleaned = input
      let headerMime = ''

      const dataUrlMatch = cleaned.match(/^data:([^;]+);base64,(.*)$/s)
      if (dataUrlMatch) {
        headerMime = dataUrlMatch[1]
        cleaned = dataUrlMatch[2].trim()
      }

      cleaned = cleaned.replace(/-/g, '+').replace(/_/g, '/')
      cleaned = cleaned.replace(/[^A-Za-z0-9+/=]/g, '')

      while (cleaned.length % 4 !== 0) {
        cleaned += '='
      }

      if (!cleaned) {
        setFileDecodeError('Invalid or empty Base64 string.')
        return
      }

      const binaryString = atob(cleaned)
      const len = binaryString.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      const detected = detectFileFromBytes(bytes, headerMime)
      setDecodedBytes(bytes)
      setDecodedMimeType(detected.mimeType)
      setDecodedExtension(detected.extension)

      const blob = new Blob([bytes], { type: detected.mimeType })
      const blobUrl = URL.createObjectURL(blob)
      setDecodedBlobUrl(blobUrl)

      if (detected.mimeType.startsWith('text/') || detected.mimeType === 'application/json' || detected.mimeType === 'image/svg+xml') {
        try {
          const text = new TextDecoder('utf-8').decode(bytes.subarray(0, 2000))
          setDecodedTextPreview(text)
        } catch {
          setDecodedTextPreview(null)
        }
      }

      const item: FileHistoryItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        type: 'file',
        mode: 'decode',
        name: `decoded_file${detected.extension}`,
        size: len,
        mimeType: detected.mimeType,
        timestamp: Date.now()
      }
      saveToHistory(item)

    } catch (err: any) {
      setFileDecodeError(err?.message || 'Failed to decode Base64 into binary file. Check that the input is a valid Base64 string.')
    }
  }

  const handleDownloadDecodedFile = () => {
    if (!decodedBlobUrl || !decodedBytes) return
    const link = document.createElement('a')
    link.href = decodedBlobUrl
    const fullFileName = decodedFileName.endsWith(decodedExtension)
      ? decodedFileName
      : `${decodedFileName}${decodedExtension}`
    link.download = fullFileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDecoderFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result as string
      setFileDecodeInput(content)
      handleDecodeFileFromBase64(content)
    }
    reader.onerror = () => {
      setFileDecodeError('Error reading uploaded text file.')
    }
    reader.readAsText(file)
  }

  const stats = useMemo(() => {
    if (activeTab === 'text' && textInput && textOutput && !textOutput.startsWith('Error')) {
      const inputBytes = new TextEncoder().encode(textInput).length
      const outputBytes = new TextEncoder().encode(textOutput).length
      const overhead = inputBytes > 0 ? ((outputBytes - inputBytes) / inputBytes * 100) : 0
      return { inputBytes, outputBytes, overhead, reduction: 0 }
    }
    if (activeTab === 'file' && fileTabMode === 'encode' && uploadedFile && fileBase64) {
      const inputBytes = uploadedFile.size
      const outputBytes = new TextEncoder().encode(fileBase64).length
      const overhead = inputBytes > 0 ? ((outputBytes - inputBytes) / inputBytes * 100) : 0
      return { inputBytes, outputBytes, overhead, reduction: 0 }
    }
    if (activeTab === 'file' && fileTabMode === 'decode' && decodedBytes && fileDecodeInput) {
      const inputBytes = fileDecodeInput.length
      const outputBytes = decodedBytes.length
      const reduction = inputBytes > 0 ? ((inputBytes - outputBytes) / inputBytes * 100) : 0
      return { inputBytes, outputBytes, overhead: 0, reduction }
    }
    return null
  }, [activeTab, fileTabMode, textInput, textOutput, uploadedFile, fileBase64, decodedBytes, fileDecodeInput])

  const handleFile = (file: File) => {
    setFileError(null)
    setUploadedFile(null)
    setFileBase64('')
    setFileDataUrl('')

    setIsProcessingFile(true)
    const reader = new FileReader()

    reader.onload = () => {
      const dataUrl = reader.result as string
      const base64Raw = dataUrl.split(',')[1] || ''

      setFileDataUrl(dataUrl)
      setFileBase64(base64Raw)
      setUploadedFile(file)
      setFileError(null)
      setIsProcessingFile(false)

      const item: FileHistoryItem = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        type: 'file',
        mode: 'encode',
        name: file.name,
        size: file.size,
        mimeType: file.type,
        timestamp: Date.now()
      }
      saveToHistory(item)
    }

    reader.onerror = () => {
      setFileError("Error occurred while reading the file.")
      setIsProcessingFile(false)
    }

    reader.readAsDataURL(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (fileTabMode === 'encode') {
        handleFile(e.dataTransfer.files[0])
      } else {
        handleDecoderFileUpload(e.dataTransfer.files[0])
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const clearFile = () => {
    setUploadedFile(null)
    setFileBase64('')
    setFileDataUrl('')
    setFileError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const clearDecoderFile = () => {
    setFileDecodeInput('')
    setDecodedBytes(null)
    setDecodedMimeType('')
    setDecodedExtension('')
    setDecodedTextPreview(null)
    setFileDecodeError(null)
    if (decodedBlobUrl) {
      URL.revokeObjectURL(decodedBlobUrl)
      setDecodedBlobUrl('')
    }
  }

  const saveToHistory = (item: HistoryItem) => {
    setHistory((prev) => {
      let next = [item, ...prev]
      next = next.slice(0, 15)
      localStorage.setItem('base64_history', JSON.stringify(next))
      return next
    })
  }

  const clearHistory = () => {
    localStorage.removeItem('base64_history')
    setHistory([])
  }

  const loadHistoryItem = (item: HistoryItem) => {
    if (item.type === 'text') {
      setActiveTab('text')
      setTextMode(item.mode)
      setTextInput(item.input)
      setTextOutput(item.output)
    } else {
      setActiveTab('file')
      setFileTabMode(item.mode || 'encode')
      toast(`"${item.name}" (${formatBytes(item.size)}) logged. Upload file or paste Base64 to view.`, 'info')
    }
  }

  const copyToClipboard = (text: string, key: 'output' | 'dataUrl' | 'rawBase64') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(key)
      setTimeout(() => setCopiedText(null), 2000)
    }).catch(err => {
      console.error('Failed to copy: ', err)
    })
  }

  const handleDownload = () => {
    if (!fileDataUrl) return
    const element = document.createElement("a")
    const file = new Blob([fileDataUrl], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${uploadedFile?.name || 'file'}_base64.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleDownloadDecoded = () => {
    if (!textOutput || textMode !== 'decode' || textOutput.startsWith('Error')) return
    const blob = new Blob([textOutput], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'decoded-text.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  const getDisplayValue = (str: string) => {
    if (str.length > 5000) {
      return str.substring(0, 5000) + '\n\n... [Preview truncated for speed. Click Copy to get full data] ...'
    }
    return str
  }

  const getFileRawBase64 = () => {
    if (!fileBase64) return ''
    if (urlSafe) {
      return fileBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }
    return fileBase64
  }

  return (
    <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Encode and decode text or files to Base64 instantly. Client-side processing, no data leaves your browser."
      toolSlug="base64-encoder"
      faq={base64Faq}
      seoContent={base64Seo}
    >
      <div className="space-y-6">
        <div className="flex border-b border-[#333333]">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-3 text-center border-b-2 text-xs font-mono font-bold uppercase tracking-wider transition-none ${
              activeTab === 'text'
                ? 'border-[#F9F9F9] text-[#F9F9F9]'
                : 'border-transparent text-[#555555] hover:text-[#F9F9F9]'
            }`}
          >
            {`>`} Text Base64
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-3 text-center border-b-2 text-xs font-mono font-bold uppercase tracking-wider transition-none ${
              activeTab === 'file'
                ? 'border-[#F9F9F9] text-[#F9F9F9]'
                : 'border-transparent text-[#555555] hover:text-[#F9F9F9]'
            }`}
          >
            {`>`} File Base64
          </button>
        </div>

        {activeTab === 'text' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTextMode('encode')}
                  className={`terminal-btn ${textMode === 'encode' ? 'text-[#00FF41]' : ''}`}
                >
                  [<span className="green-chevron">&gt;</span> Encode Text]
                </button>
                <button
                  type="button"
                  onClick={() => setTextMode('decode')}
                  className={`terminal-btn ${textMode === 'decode' ? 'text-[#00FF41]' : ''}`}
                >
                  [<span className="green-chevron">&gt;</span> Decode Text]
                </button>
              </div>
              <button
                type="button"
                onClick={() => setUrlSafe(!urlSafe)}
                className={`terminal-btn ${urlSafe ? 'text-[#00FF41]' : ''}`}
              >
                [<span className="green-chevron">&gt;</span> URL-SAFE: {urlSafe ? 'ON' : 'OFF'}]
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono text-[#888888] uppercase">
                  {textMode === 'encode' ? <>{'>'} TEXT TO ENCODE</> : <>{'>'} BASE64 TO DECODE</>}
                </label>
                {textInput && (
                  <button
                    type="button"
                    onClick={handleClearText}
                    className="text-[10px] font-mono text-[#555555] hover:text-[#F9F9F9] uppercase tracking-wider"
                  >
                    [ CLEAR ]
                  </button>
                )}
              </div>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border border-[#F9F9F9] bg-[#000000] text-[#F9F9F9] font-mono text-xs md:text-sm focus:border-2 focus:border-[#00FF41] focus:outline-none resize-y"
              />
            </div>

            <button
              type="button"
              onClick={handleTextConvert}
              className="terminal-btn"
            >
              [<span className="green-chevron">&gt;</span> {textMode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}]
            </button>

            {textOutput && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-mono text-[#888888] uppercase">{'>'} RESULT</label>
                  <div className="flex gap-2">
                    {textMode === 'decode' && !textOutput.startsWith('Error') && (
                      <button
                        type="button"
                        onClick={handleDownloadDecoded}
                        className="terminal-btn"
                      >
                        [<span className="green-chevron">&gt;</span> DOWNLOAD .TXT]
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(textOutput, 'output')}
                      className="terminal-btn"
                    >
                      [<span className="green-chevron">&gt;</span> {copiedText === 'output' ? 'COPIED' : 'COPY'}]
                    </button>
                  </div>
                </div>
                <textarea
                  value={textOutput}
                  readOnly
                  rows={5}
                  className="w-full px-4 py-3 border border-[#F9F9F9] bg-[#000000] text-[#F9F9F9] font-mono text-xs md:text-sm focus:outline-none resize-y"
                />

                {stats && !textOutput.startsWith('Error') && (
                  <div className="mt-2 p-3 border border-[#333333] bg-[#000000]">
                    <p className="text-[10px] font-mono text-[#666666] uppercase tracking-wider mb-1.5">{'>'} STATS</p>
                    <div className="flex gap-4 text-xs font-mono">
                      <span className="text-[#888888]">
                        Input: <span className="text-[#F9F9F9]">{formatBytes(stats.inputBytes)}</span>
                      </span>
                      <span className="text-[#888888]">
                        Output: <span className="text-[#F9F9F9]">{formatBytes(stats.outputBytes)}</span>
                      </span>
                      <span className="text-[#888888]">
                        Overhead: <span className={`${(stats.overhead || 0) >= 0 ? 'text-[#FFD700]' : 'text-[#00FF41]'}`}>
                          {(stats.overhead || 0) >= 0 ? '+' : ''}{(stats.overhead || 0).toFixed(1)}%
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'file' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFileTabMode('encode')}
                  className={`terminal-btn ${fileTabMode === 'encode' ? 'text-[#00FF41]' : ''}`}
                >
                  [<span className="green-chevron">&gt;</span> Encode File to Base64]
                </button>
                <button
                  type="button"
                  onClick={() => setFileTabMode('decode')}
                  className={`terminal-btn ${fileTabMode === 'decode' ? 'text-[#00FF41]' : ''}`}
                >
                  [<span className="green-chevron">&gt;</span> Decode Base64 to File]
                </button>
              </div>
              <button
                type="button"
                onClick={() => setUrlSafe(!urlSafe)}
                className={`terminal-btn ${urlSafe ? 'text-[#00FF41]' : ''}`}
              >
                [<span className="green-chevron">&gt;</span> URL-SAFE: {urlSafe ? 'ON' : 'OFF'}]
              </button>
            </div>

            {fileTabMode === 'encode' && (
              <div className="space-y-4">
                {!uploadedFile && !isProcessingFile && (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center border-2 border-dashed p-8 cursor-pointer transition-none ${
                      dragActive
                        ? 'border-[#00FF41] bg-[#000000]'
                        : 'border-[#444444] hover:border-[#F9F9F9] bg-[#000000]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <UploadCloud className="w-12 h-12 text-[#555555] mb-3" />
                    <p className="text-sm font-mono text-[#F9F9F9] text-center">{'>'} DRAG & DROP FILE HERE, OR CLICK TO BROWSE</p>
                    <p className="text-[10px] font-mono text-[#555555] mt-1.5 text-center">
                      Supports images, PDFs, documents, audio, zip files - 100% client-side
                    </p>
                  </div>
                )}

                {isProcessingFile && (
                  <div className="flex flex-col items-center justify-center py-12 border border-[#333333] bg-[#000000]">
                    <div className="w-10 h-10 border-2 border-t-transparent border-[#F9F9F9] mb-3" style={{animation: 'spin 1s linear infinite'}} />
                    <p className="text-xs font-mono text-[#666666]">{'>'} PROCESSING FILE...</p>
                  </div>
                )}

                {fileError && (
                  <div className="p-4 border border-[#F9F9F9] bg-[#000000] text-[#F9F9F9] flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-mono text-[#F9F9F9] underline">{'>'} ERROR PROCESSING FILE</p>
                      <p className="text-[10px] font-mono mt-0.5 text-[#888888]">{fileError}</p>
                    </div>
                  </div>
                )}

                {uploadedFile && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-[#333333] bg-[#000000]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 border border-[#444444] bg-[#000000] text-[#888888] flex-shrink-0">
                          {uploadedFile.type.startsWith('image/') ? (
                            <ImageIcon className="w-6 h-6" />
                          ) : (
                            <FileText className="w-6 h-6" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-mono text-[#F9F9F9] truncate max-w-[200px] sm:max-w-md">
                            {uploadedFile.name}
                          </p>
                          <p className="text-[10px] font-mono text-[#555555] mt-0.5">
                            {formatBytes(uploadedFile.size)} {uploadedFile.type || 'Unknown Type'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearFile}
                        className="p-1.5 text-[#555555] hover:text-[#F9F9F9] transition-none"
                        title="Remove file"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {uploadedFile.type.startsWith('image/') && fileDataUrl && (
                      <div className="border border-[#333333] p-4 bg-[#000000]">
                        <p className="text-xs font-mono text-[#666666] mb-2">Image Preview</p>
                        <div className="flex justify-center">
                          <img
                            src={fileDataUrl}
                            alt="Preview"
                            className="max-h-64 object-contain border border-[#333333] bg-[#000000] p-1"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[10px] font-mono text-[#666666] uppercase tracking-wider">Base64 Data URL</label>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(fileDataUrl, 'dataUrl')}
                              className="terminal-btn"
                            >
                              [<span className="green-chevron">&gt;</span> {copiedText === 'dataUrl' ? 'COPIED' : 'COPY DATA URL'}]
                            </button>
                            <button
                              type="button"
                              onClick={handleDownload}
                              className="terminal-btn"
                            >
                              [<span className="green-chevron">&gt;</span> Download (.txt)]
                            </button>
                          </div>
                        </div>
                        <textarea
                          value={getDisplayValue(fileDataUrl)}
                          readOnly
                          rows={4}
                          className="w-full px-4 py-3 border border-[#F9F9F9] bg-[#000000] text-[#F9F9F9] font-mono text-xs focus:outline-none resize-y"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-semibold text-[#888888]">Raw Base64 String</label>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(getFileRawBase64(), 'rawBase64')}
                            className="terminal-btn"
                          >
                            [<span className="green-chevron">&gt;</span> {copiedText === 'rawBase64' ? 'COPIED' : 'COPY RAW BASE64'}]
                          </button>
                        </div>
                        <textarea
                          value={getDisplayValue(getFileRawBase64())}
                          readOnly
                          rows={4}
                          className="w-full px-4 py-3 border border-[#F9F9F9] bg-[#000000] text-[#F9F9F9] font-mono text-xs focus:outline-none resize-y"
                        />
                      </div>
                    </div>

                    {stats && (
                      <div className="p-3 border border-[#333333] bg-[#000000]">
                        <p className="text-[10px] font-mono text-[#666666] uppercase tracking-wider mb-1.5">{'>'} STATS</p>
                        <div className="flex gap-4 text-xs font-mono">
                          <span className="text-[#888888]">
                            Input (file): <span className="text-[#F9F9F9]">{formatBytes(stats.inputBytes)}</span>
                          </span>
                          <span className="text-[#888888]">
                            Base64 size: <span className="text-[#F9F9F9]">{formatBytes(stats.outputBytes)}</span>
                          </span>
                          <span className="text-[#888888]">
                            Overhead: <span className="text-[#FFD700]">+{stats.overhead?.toFixed(1)}%</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {fileTabMode === 'decode' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-mono text-[#888888] uppercase">
                      {'>'} BASE64 STRING OR DATA URL TO DECODE TO FILE
                    </label>
                    <div className="flex gap-2">
                      <input
                        ref={fileDecoderInputRef}
                        type="file"
                        accept=".txt,.b64,.log"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleDecoderFileUpload(e.target.files[0])
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileDecoderInputRef.current?.click()}
                        className="text-[10px] font-mono text-[#888888] hover:text-[#F9F9F9] uppercase tracking-wider"
                      >
                        [ UPLOAD .TXT FILE ]
                      </button>
                      {fileDecodeInput && (
                        <button
                          type="button"
                          onClick={clearDecoderFile}
                          className="text-[10px] font-mono text-[#555555] hover:text-[#F9F9F9] uppercase tracking-wider"
                        >
                          [ CLEAR ]
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    value={fileDecodeInput}
                    onChange={(e) => {
                      setFileDecodeInput(e.target.value)
                      if (e.target.value.trim()) {
                        handleDecodeFileFromBase64(e.target.value)
                      } else {
                        clearDecoderFile()
                      }
                    }}
                    placeholder="Paste Base64 string or data:image/png;base64,... here"
                    rows={6}
                    className="w-full px-4 py-3 border border-[#F9F9F9] bg-[#000000] text-[#F9F9F9] font-mono text-xs md:text-sm focus:border-2 focus:border-[#00FF41] focus:outline-none resize-y"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecodeFileFromBase64()}
                    className="terminal-btn"
                  >
                    [<span className="green-chevron">&gt;</span> Decode to File]
                  </button>
                </div>

                {fileDecodeError && (
                  <div className="p-4 border border-[#F9F9F9] bg-[#000000] text-[#F9F9F9] flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#FF3333]" />
                    <div>
                      <p className="text-xs font-mono text-[#F9F9F9] underline">{'>'} DECODING ERROR</p>
                      <p className="text-[10px] font-mono mt-0.5 text-[#888888]">{fileDecodeError}</p>
                    </div>
                  </div>
                )}

                {decodedBytes && (
                  <div className="space-y-4 border border-[#333333] p-4 bg-[#000000]">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#222222]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 border border-[#444444] bg-[#000000] text-[#00FF41]">
                          {decodedMimeType.startsWith('image/') ? (
                            <ImageIcon className="w-6 h-6" />
                          ) : decodedMimeType.startsWith('audio/') ? (
                            <Music className="w-6 h-6" />
                          ) : decodedMimeType.startsWith('video/') ? (
                            <Film className="w-6 h-6" />
                          ) : (
                            <File className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#F9F9F9]">
                              Detected File: {decodedMimeType}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#111111] text-[#00FF41] border border-[#00FF41]/30">
                              {decodedExtension}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-[#666666] mt-0.5">
                            Size: {formatBytes(decodedBytes.length)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleDownloadDecodedFile}
                        className="terminal-btn bg-[#00FF41] text-[#000000] font-bold hover:bg-[#00CC33]"
                      >
                        [<span className="text-[#000000]">&gt;</span> DOWNLOAD DECODED FILE ({decodedExtension})]
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[10px] font-mono text-[#666666] uppercase mb-1">
                          File Name
                        </label>
                        <input
                          type="text"
                          value={decodedFileName}
                          onChange={(e) => setDecodedFileName(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#444444] bg-[#000000] text-[#F9F9F9] font-mono text-xs focus:border-[#00FF41] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-[#666666] uppercase mb-1">
                          MIME Type Override
                        </label>
                        <input
                          type="text"
                          value={decodedMimeType}
                          onChange={(e) => {
                            setDecodedMimeType(e.target.value)
                            setDecodedExtension(mimeToExt(e.target.value))
                          }}
                          className="w-full px-3 py-1.5 border border-[#444444] bg-[#000000] text-[#F9F9F9] font-mono text-xs focus:border-[#00FF41] focus:outline-none"
                        />
                      </div>
                    </div>

                    {decodedMimeType.startsWith('image/') && decodedBlobUrl && (
                      <div className="pt-2">
                        <p className="text-[10px] font-mono text-[#666666] uppercase mb-1.5">{'>'} IMAGE PREVIEW</p>
                        <div className="flex justify-center p-3 border border-[#222222] bg-[#000000]">
                          <img
                            src={decodedBlobUrl}
                            alt="Decoded Preview"
                            className="max-h-72 object-contain border border-[#333333]"
                          />
                        </div>
                      </div>
                    )}

                    {decodedMimeType.startsWith('audio/') && decodedBlobUrl && (
                      <div className="pt-2">
                        <p className="text-[10px] font-mono text-[#666666] uppercase mb-1.5">{'>'} AUDIO PREVIEW</p>
                        <audio controls src={decodedBlobUrl} className="w-full" />
                      </div>
                    )}

                    {decodedMimeType.startsWith('video/') && decodedBlobUrl && (
                      <div className="pt-2">
                        <p className="text-[10px] font-mono text-[#666666] uppercase mb-1.5">{'>'} VIDEO PREVIEW</p>
                        <video controls src={decodedBlobUrl} className="w-full max-h-72 border border-[#333333]" />
                      </div>
                    )}

                    {decodedMimeType === 'application/pdf' && decodedBlobUrl && (
                      <div className="pt-2">
                        <p className="text-[10px] font-mono text-[#666666] uppercase mb-1.5">{'>'} PDF PREVIEW</p>
                        <iframe src={decodedBlobUrl} className="w-full h-80 border border-[#333333]" title="PDF Preview" />
                      </div>
                    )}

                    {decodedTextPreview && (
                      <div className="pt-2">
                        <p className="text-[10px] font-mono text-[#666666] uppercase mb-1.5">{'>'} TEXT PREVIEW (FIRST 2000 CHARS)</p>
                        <textarea
                          value={decodedTextPreview}
                          readOnly
                          rows={5}
                          className="w-full px-3 py-2 border border-[#333333] bg-[#000000] text-[#F9F9F9] font-mono text-xs focus:outline-none resize-y"
                        />
                      </div>
                    )}

                    {stats && stats.reduction !== undefined && (
                      <div className="pt-2 border-t border-[#222222]">
                        <div className="flex gap-4 text-xs font-mono">
                          <span className="text-[#888888]">
                            Base64 Input: <span className="text-[#F9F9F9]">{formatBytes(stats.inputBytes)}</span>
                          </span>
                          <span className="text-[#888888]">
                            Decoded Binary: <span className="text-[#00FF41]">{formatBytes(stats.outputBytes)}</span>
                          </span>
                          <span className="text-[#888888]">
                            Size Reduction: <span className="text-[#00FF41]">-{stats.reduction.toFixed(1)}%</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-8 border-t border-[#333333] pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-bold text-[#F9F9F9] uppercase tracking-wider">Recent Conversions</h3>
              <button
                type="button"
                onClick={clearHistory}
                className="text-[10px] font-mono text-[#555555] hover:text-[#F9F9F9] flex items-center gap-1 transition-none"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear History
              </button>
            </div>
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border border-[#333333] bg-[#000000] text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.type === 'file' ? (
                      <File className="w-4 h-4 text-[#888888] flex-shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-[#00FF41] flex-shrink-0" />
                    )}
                    <span className="font-mono text-[#F9F9F9] truncate max-w-[200px] sm:max-w-xs">
                      {item.type === 'file'
                        ? item.name
                        : item.input.substring(0, 30) + (item.input.length > 30 ? '...' : '')
                      }
                    </span>
                    <span className="text-[10px] font-mono text-[#555555]">
                      {item.type === 'file' ? `(${formatBytes(item.size)}) [${item.mode || 'file'}]` : `(${item.mode})`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#888888]">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      type="button"
                      onClick={() => loadHistoryItem(item)}
                      className="terminal-btn"
                    >
                      [<span className="green-chevron">&gt;</span> Load]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}

