'use client'

import { useState, useEffect } from 'react'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { Key, Copy, AlertTriangle, RefreshCw } from 'lucide-react'

const jwtFaq = [
  {
    question: 'What is a JSON Web Token (JWT)?',
    answer: 'A JWT is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. It consists of three Base64URL-encoded parts separated by dots: Header, Payload, and Signature.'
  },
  {
    question: 'How are JWTs signed?',
    answer: 'HMAC algorithms (HS256, HS384, HS512) use a shared secret key to hash the Base64URL-encoded Header and Payload (header.payload). Anyone with the secret key can verify or generate valid tokens.'
  }
]

const jwtSeo = (
  <div className="space-y-4">
    <h2 className="text-lg font-heading font-bold text-[#F9F9F9]">JWT Token Generator & Signer</h2>
    <p>
      Create, sign, and test custom JSON Web Tokens (JWT) client-side. Set expiration timers, subject claims, issuer, role arrays, and HMAC secret keys. 100% private — tokens are computed entirely in your browser via the Web Crypto API.
    </p>
  </div>
)

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binString = ''
  for (let i = 0; i < bytes.length; i++) {
    binString += String.fromCharCode(bytes[i])
  }
  return btoa(binString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function base64UrlEncodeString(str: string): string {
  const bytes = new TextEncoder().encode(str)
  return base64UrlEncodeBytes(bytes)
}

export default function JwtGeneratorClient() {
  const [alg, setAlg] = useState<'HS256' | 'HS384' | 'HS512'>('HS256')
  const [secret, setSecret] = useState<string>('your-256-bit-secret')

  const [headerJson, setHeaderJson] = useState<string>(
    JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2)
  )

  const nowSec = Math.floor(Date.now() / 1000)
  const [payloadJson, setPayloadJson] = useState<string>(
    JSON.stringify(
      {
        sub: '1234567890',
        name: 'John Doe',
        admin: true,
        iat: nowSec,
        exp: nowSec + 3600
      },
      null,
      2
    )
  )

  const [jwtToken, setJwtToken] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const hashAlgoMap = {
    HS256: 'SHA-256',
    HS384: 'SHA-384',
    HS512: 'SHA-512'
  }

  const generateJwt = async () => {
    setError(null)
    try {
      // Parse JSONs to ensure validity
      const headerObj = JSON.parse(headerJson)
      headerObj.alg = alg
      const payloadObj = JSON.parse(payloadJson)

      const encodedHeader = base64UrlEncodeString(JSON.stringify(headerObj))
      const encodedPayload = base64UrlEncodeString(JSON.stringify(payloadObj))

      const dataToSign = `${encodedHeader}.${encodedPayload}`

      if (!secret) {
        // Unsigned JWT (none)
        setJwtToken(`${dataToSign}.`)
        return
      }

      // Web Crypto HMAC signing
      const enc = new TextEncoder()
      const secretKeyData = enc.encode(secret)
      const hashAlgo = hashAlgoMap[alg]

      const key = await crypto.subtle.importKey(
        'raw',
        secretKeyData,
        { name: 'HMAC', hash: { name: hashAlgo } },
        false,
        ['sign']
      )

      const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(dataToSign))
      const encodedSignature = base64UrlEncodeBytes(new Uint8Array(signatureBuffer))

      setJwtToken(`${dataToSign}.${encodedSignature}`)
    } catch (err: any) {
      setError(err?.message || 'Failed to generate JWT token.')
      setJwtToken('')
    }
  }

  useEffect(() => {
    generateJwt()
  }, [alg, secret, headerJson, payloadJson])

  const setExpDuration = (secondsFromNow: number) => {
    try {
      const obj = JSON.parse(payloadJson)
      const now = Math.floor(Date.now() / 1000)
      obj.iat = now
      obj.exp = now + secondsFromNow
      setPayloadJson(JSON.stringify(obj, null, 2))
    } catch {
      // Ignore if invalid JSON
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jwtToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolLayout
      title="JWT Token Generator & Signer"
      description="Generate and sign custom JSON Web Tokens (JWT) locally with HMAC secret keys."
      toolSlug="jwt-generator"
      faq={jwtFaq}
      seoContent={jwtSeo}
    >
      <div className="space-y-6">
        {/* Settings Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#888888] uppercase mb-1">
              Algorithm
            </label>
            <select
              value={alg}
              onChange={(e) => {
                const newAlg = e.target.value as any
                setAlg(newAlg)
                try {
                  const h = JSON.parse(headerJson)
                  h.alg = newAlg
                  setHeaderJson(JSON.stringify(h, null, 2))
                } catch {}
              }}
              className="w-full px-3 py-2 border border-[#444444] bg-[#000000] text-[#F9F9F9] font-mono text-xs focus:border-[#00FF41] focus:outline-none"
            >
              <option value="HS256">HS256 (HMAC SHA-256)</option>
              <option value="HS384">HS384 (HMAC SHA-384)</option>
              <option value="HS512">HS512 (HMAC SHA-512)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#888888] uppercase mb-1">
              Secret Key
            </label>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter secret key..."
              className="w-full px-3 py-2 border border-[#444444] bg-[#000000] text-[#00FF41] font-mono text-xs focus:border-[#00FF41] focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Expiration Helpers */}
        <div>
          <label className="block text-[10px] font-mono text-[#666666] uppercase mb-1.5">
            Quick Expiration Adjuster
          </label>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setExpDuration(3600)}
              className="terminal-btn text-[10px]"
            >
              [ +1 Hour ]
            </button>
            <button
              type="button"
              onClick={() => setExpDuration(86400)}
              className="terminal-btn text-[10px]"
            >
              [ +24 Hours ]
            </button>
            <button
              type="button"
              onClick={() => setExpDuration(604800)}
              className="terminal-btn text-[10px]"
            >
              [ +7 Days ]
            </button>
            <button
              type="button"
              onClick={() => setExpDuration(2592000)}
              className="terminal-btn text-[10px]"
            >
              [ +30 Days ]
            </button>
          </div>
        </div>

        {/* Header & Payload Editors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#FF0055] uppercase mb-1.5">
              {'>'} HEADER (ALGORITHM & TOKEN TYPE)
            </label>
            <textarea
              value={headerJson}
              onChange={(e) => setHeaderJson(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-[#FF0055] bg-[#000000] text-[#F9F9F9] font-mono text-xs focus:outline-none resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#00E5FF] uppercase mb-1.5">
              {'>'} PAYLOAD (CLAIMS & DATA)
            </label>
            <textarea
              value={payloadJson}
              onChange={(e) => setPayloadJson(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-[#00E5FF] bg-[#000000] text-[#F9F9F9] font-mono text-xs focus:outline-none resize-y"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 border border-[#FF3333] bg-[#000000] text-[#FF3333] text-xs font-mono">
            {'>'} ERROR: {error}
          </div>
        )}

        {/* Generated Token Result */}
        {jwtToken && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono text-[#00FF41] uppercase">{'>'} GENERATED SIGNED JWT TOKEN</label>
              <button
                type="button"
                onClick={copyToClipboard}
                className="terminal-btn bg-[#00FF41] text-[#000000] font-bold"
              >
                [ {copied ? 'COPIED' : 'COPY TOKEN'} ]
              </button>
            </div>
            <textarea
              value={jwtToken}
              readOnly
              rows={4}
              className="w-full px-4 py-3 border border-[#00FF41] bg-[#000000] text-[#00FF41] font-mono text-xs md:text-sm focus:outline-none resize-y break-all"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
