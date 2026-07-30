import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Log Cleaner & PII Redactor — Sanitize Terminal Logs for AI',
  description:
    'Sanitize terminal logs and server output before pasting into ChatGPT, Claude, or DeepSeek. Strip AWS keys, Bearer tokens, passwords, emails, IPs, and PII 100% locally.',
  openGraph: {
    title: 'Log Cleaner & PII Redactor — Sanitize Terminal Logs for ChatGPT & Claude',
    description:
      'Safely remove API keys, secrets, Bearer tokens, private keys, passwords, and PII from raw logs before sending to AI models.',
    type: 'website',
  },
}

export { default } from './_client'
