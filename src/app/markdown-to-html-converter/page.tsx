import type { Metadata } from 'next'
import Client from './_client'

export const metadata: Metadata = {
  title: 'Markdown to HTML Converter — Free Online Developer Tool',
  description: 'Convert Markdown to clean HTML markup and HTML back to Markdown online. Real-time live preview, syntax highlighting, and file export options.',
  openGraph: {
    title: 'Markdown to HTML Converter — Free Online Developer Tool',
    description: 'Convert Markdown ↔ HTML with live preview. Fast, 100% browser-based conversion.',
  },
}

export default function Page() {
  return <Client />
}
