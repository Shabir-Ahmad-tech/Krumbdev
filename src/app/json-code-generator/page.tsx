import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Path & Code Generator — Get Access Code in Python, Java, JS, C++ & More',
  description:
    'Paste JSON data, click or search any property, and instantly get code snippets to extract values in Python, JavaScript, Java, C++, C#, Go, Rust, and PHP.',
  openGraph: {
    title: 'JSON Path & Code Generator — Multi-Language JSON Access Code',
    description:
      'Extract properties from JSON payloads and generate clean code snippets for Python, JS, Java, C++, Go, C#, Rust, and PHP.',
    type: 'website',
  },
}

export { default } from './_client'
