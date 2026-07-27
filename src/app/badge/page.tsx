import type { Metadata } from 'next'
import BadgeClient from './_client'

export const metadata: Metadata = {
  title: 'Badge — KRUMB.DEV Free Developer Tools',
  description: 'Embed a "Powered by KRUMB.DEV" badge on your site. Copy HTML or SVG snippets to link back to the free developer tool collection.',
  openGraph: {
    title: 'Badge — KRUMB.DEV Free Developer Tools',
    description: 'Embed a "Powered by KRUMB.DEV" badge on your site. Copy HTML or SVG snippets to link back to the free developer tool collection.',
  },
}

export default function BadgePage() {
  return <BadgeClient />
}
