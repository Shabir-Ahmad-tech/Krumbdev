import type { Metadata } from 'next'
import Client from './_client'

export const metadata: Metadata = {
  title: 'URL Parser & Query String Extractor — Free Developer Tool',
  description: 'Parse URLs into protocol, host, port, path, query parameters, and hash. Edit search params in a clean table with auto URL decoding.',
  openGraph: {
    title: 'URL Parser & Query String Extractor — Free Developer Tool',
    description: 'Inspect and break down complex URL strings into protocol, path, and query parameter tables instantly.',
  },
}

export default function Page() {
  return <Client />
}
