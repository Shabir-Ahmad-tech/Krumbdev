import type { Metadata } from 'next'
import Client from './_client'

export const metadata: Metadata = {
  title: 'Base64 to Image & Image to Base64 Converter — Free Developer Tool',
  description: 'Convert images (PNG, JPG, SVG, WebP, GIF) to Base64 Data URIs and decode Base64 strings directly into downloadable image files.',
  openGraph: {
    title: 'Base64 to Image & Image to Base64 Converter — Free Developer Tool',
    description: 'Convert image files to Base64 data URIs or decode Base64 strings to downloadable images locally.',
  },
}

export default function Page() {
  return <Client />
}
