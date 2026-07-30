import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Schema Generator & Validator — Free Online Dev Tool',
  description: 'Generate Draft-07 and Draft 2020-12 JSON Schemas automatically from JSON objects. Validate JSON data against schemas client-side.',
  openGraph: {
    title: 'JSON Schema Generator & Validator — Free Online Dev Tool',
    description: 'Generate Draft-07 and Draft 2020-12 JSON Schemas automatically from JSON objects. Validate JSON data against schemas client-side.',
    type: 'website',
  },
}

export { default } from './_client'
