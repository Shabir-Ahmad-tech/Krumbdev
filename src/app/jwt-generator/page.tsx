import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JWT Token Generator & Signer — Free Online Dev Tool',
  description: 'Generate and sign custom JSON Web Tokens (JWT) locally for testing APIs. Configure header, payload claims, HMAC algorithms, and secret keys.',
  openGraph: {
    title: 'JWT Token Generator & Signer — Free Online Dev Tool',
    description: 'Generate and sign custom JSON Web Tokens (JWT) locally for testing APIs. Configure header, payload claims, HMAC algorithms, and secret keys.',
    type: 'website',
  },
}

export { default } from './_client'
