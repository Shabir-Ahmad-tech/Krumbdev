'use client'

import { useState, useMemo } from 'react'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { ShieldCheck, Copy, RefreshCw, AlertTriangle, Eye, EyeOff } from 'lucide-react'

const SAMPLE_LOG = `[2026-07-30T10:14:02.102Z] INFO  Server started on 192.168.1.45:8080
[2026-07-30T10:14:05.300Z] DEBUG Connecting to database at db.prod.internal with user=admin_db password="SecretPassword123!"
[2026-07-30T10:14:06.120Z] INFO  AWS S3 Init - Region: us-east-1, AccessKey: AKIAIOSFODNN7EXAMPLE, Secret: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
[2026-07-30T10:14:08.550Z] WARN  API Auth Failed for user john.doe@company.com
[2026-07-30T10:14:09.001Z] DEBUG Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
[2026-07-30T10:14:10.450Z] ERROR Transaction declined for Card: 4532-7100-9812-3456
[2026-07-30T10:14:12.800Z] DEBUG api_key=dummy_api_key_sample_secret_token_12345`

interface RedactionStats {
  awsKeys: number
  bearerTokens: number
  privateKeys: number
  apiSecrets: number
  emails: number
  ips: number
  creditCards: number
  total: number
}

function sanitizeLog(rawLog: string): { cleanedLog: string; stats: RedactionStats } {
  if (!rawLog) {
    return {
      cleanedLog: '',
      stats: {
        awsKeys: 0,
        bearerTokens: 0,
        privateKeys: 0,
        apiSecrets: 0,
        emails: 0,
        ips: 0,
        creditCards: 0,
        total: 0,
      },
    }
  }

  let text = rawLog
  let awsKeys = 0
  let bearerTokens = 0
  let privateKeys = 0
  let apiSecrets = 0
  let emails = 0
  let ips = 0
  let creditCards = 0

  // 1. Private Keys
  text = text.replace(/-----BEGIN (RSA|EC|OPENSSH|DSA|PGP)? PRIVATE KEY-----[\s\S]*?-----END \1 PRIVATE KEY-----/gi, () => {
    privateKeys++
    return '<REDACTED_PRIVATE_KEY>'
  })

  // 2. AWS Access Key IDs (AKIA...)
  text = text.replace(/\b(AKIA[0-9A-Z]{16})\b/g, () => {
    awsKeys++
    return '<REDACTED_AWS_ACCESS_KEY>'
  })

  // 3. Bearer Tokens / JWTs
  text = text.replace(/\bBearer\s+(eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+|[A-Za-z0-9\-\._~\+\/]+=*)/gi, () => {
    bearerTokens++
    return 'Bearer <REDACTED_BEARER_TOKEN>'
  })

  // Standalone JWTs
  text = text.replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, () => {
    bearerTokens++
    return '<REDACTED_JWT_TOKEN>'
  })

  // 4. API Keys & Secrets (api_key=..., secret=..., password=...)
  text = text.replace(/(api[_-]?key|secret|password|passwd|auth[_-]?token|access[_-]?token|private[_-]?key)\s*[:=]\s*(["']?)([^\s"';,]+)\2/gi, (match, key, quote, val) => {
    apiSecrets++
    return `${key}=${quote}<REDACTED_SECRET>${quote}`
  })

  // 5. Credit Card Numbers
  text = text.replace(/\b(?:\d[ -]*?){13,16}\b/g, (match) => {
    const digitsOnly = match.replace(/\D/g, '')
    if (digitsOnly.length >= 13 && digitsOnly.length <= 16) {
      creditCards++
      return '<REDACTED_CREDIT_CARD>'
    }
    return match
  })

  // 6. Emails
  text = text.replace(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, () => {
    emails++
    return '<REDACTED_EMAIL>'
  })

  // 7. IPv4 Addresses (excl 127.0.0.1 / 0.0.0.0 optionally, but redacting IPs is standard for PII)
  text = text.replace(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g, (match) => {
    if (match === '127.0.0.1' || match === '0.0.0.0') return match
    ips++
    return '<REDACTED_IP_ADDRESS>'
  })

  const total = awsKeys + bearerTokens + privateKeys + apiSecrets + emails + ips + creditCards

  return {
    cleanedLog: text,
    stats: { awsKeys, bearerTokens, privateKeys, apiSecrets, emails, ips, creditCards, total },
  }
}

export default function LogCleanerClient() {
  const [rawInput, setRawInput] = useState<string>(SAMPLE_LOG)
  const [copied, setCopied] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)

  const { cleanedLog, stats } = useMemo(() => sanitizeLog(rawInput), [rawInput])

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanedLog)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const faqList = [
    {
      question: 'Why should I sanitize logs before pasting into AI models?',
      answer:
        'Large Language Models (LLMs) like ChatGPT, Claude, and Gemini retain prompt history for training and audit logs. Pasting un-sanitized logs containing API keys, AWS credentials, passwords, Bearer tokens, or customer emails risks exposing corporate credentials and violating PII security standards.',
    },
    {
      question: 'Does Log Cleaner send my logs to any external server?',
      answer:
        'No. Log Cleaner operates 100% locally in your browser using client-side regular expressions. No log data or text input ever leaves your device.',
    },
    {
      question: 'What sensitive patterns does the tool automatically redact?',
      answer:
        'It automatically detects and redacts: AWS Access Key IDs (AKIA...), Bearer & JWT tokens, RSA/EC private keys, API secrets, password parameters, email addresses, credit card numbers, and public IP addresses.',
    },
  ]

  return (
    <ToolLayout
      title="Log Cleaner & PII Redactor"
      description="Sanitize terminal logs and server output before pasting into ChatGPT, Claude, or DeepSeek. Automatically redacts API keys, Bearer tokens, AWS secrets, passwords, IPs, and PII."
      toolSlug="log-cleaner"
      faq={faqList}
    >
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0a0a] border border-[#222222] p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRawInput(SAMPLE_LOG)}
              className="px-2.5 py-1 text-xs font-mono bg-[#18181b] text-[#00FF41] border border-[#27272a] hover:bg-[#27272a] transition-none"
            >
              Load Sample Log
            </button>
            <button
              onClick={() => setRawInput('')}
              className="px-2.5 py-1 text-xs font-mono text-[#888888] hover:text-[#F9F9F9] border border-[#27272a] hover:bg-[#27272a] transition-none"
            >
              Clear Log
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#00FF41] flex items-center gap-1 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#00FF41]" />
              {stats.total} Secrets Redacted
            </span>
          </div>
        </div>

        {/* Redaction Statistics Summary Bar */}
        {stats.total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 p-3 bg-[#001f08] border border-[#00FF41]/40 text-xs font-mono">
            <div>
              <span className="text-[#888888] block text-[10px]">AWS Keys</span>
              <span className="text-[#00FF41] font-bold">{stats.awsKeys}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px]">Bearer/JWT</span>
              <span className="text-[#00FF41] font-bold">{stats.bearerTokens}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px]">Private Keys</span>
              <span className="text-[#00FF41] font-bold">{stats.privateKeys}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px]">API Secrets</span>
              <span className="text-[#00FF41] font-bold">{stats.apiSecrets}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px]">Emails</span>
              <span className="text-[#00FF41] font-bold">{stats.emails}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px]">IP Addresses</span>
              <span className="text-[#00FF41] font-bold">{stats.ips}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px]">Credit Cards</span>
              <span className="text-[#00FF41] font-bold">{stats.creditCards}</span>
            </div>
          </div>
        )}

        {/* Input vs Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Panel: Raw Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-[#F9F9F9] font-bold">
                1. Paste Raw Log / Terminal Output:
              </label>
            </div>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Paste raw terminal logs, stack traces, or server output..."
              rows={16}
              className="w-full bg-[#000000] border border-[#333333] focus:border-[#00FF41] p-3 text-xs font-mono text-[#CCCCCC] outline-none resize-y leading-relaxed"
            />
          </div>

          {/* Right Panel: Sanitized Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#00FF41] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 2. Sanitized Log (Ready for ChatGPT / Claude):
              </span>
              <button
                onClick={handleCopy}
                disabled={!cleanedLog}
                className="px-3 py-1 text-xs font-mono bg-[#00FF41] text-[#000000] font-bold hover:bg-[#00cc33] disabled:opacity-50 transition-none flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? '✓ Copied Clean Log!' : 'Copy Clean Log'}
              </button>
            </div>

            <textarea
              value={cleanedLog}
              readOnly
              placeholder="Sanitized log output will appear here..."
              rows={16}
              className="w-full bg-[#050505] border border-[#00FF41]/30 p-3 text-xs font-mono text-[#00FF41] outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Security Compliance Note */}
        <div className="p-4 bg-[#0a0a0a] border border-[#222222] space-y-2 text-xs font-mono text-[#888888] leading-relaxed">
          <span className="text-[#00FF41] font-bold flex items-center gap-1">
            🔒 100% Client-Side Privacy Guarantee
          </span>
          <p>
            All log redaction logic executes strictly inside your local browser instance. No network requests are made, and no log content is ever transmitted or logged. Safe for corporate SOC2, HIPAA, and GDPR compliance.
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
