import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KRUMB.DEV — Free Developer Tools: JSON, Regex, JWT, Code & More',
  description:
    '49 free developer tools that run in your browser. Format JSON, decode JWT, test regex, generate passwords, beautify code. No signup, no upload, no tracking.',
  openGraph: {
    title: 'KRUMB.DEV — Free Developer Tools for the Terminal-Minded',
    description:
      '49 free developer tools — JSON formatter, JWT decoder, regex tester, password generator, code beautifier & more. All in your browser. Zero signup.',
    type: 'website',
    siteName: 'KRUMB.DEV',
    locale: 'en_US',
    images: [
      {
        url: '/krumb-icon.svg',
        width: 1200,
        height: 1200,
        alt: 'KRUMB.DEV — Free Developer Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KRUMB.DEV — Free Developer Tools',
    description:
      'Format JSON, decode JWT, test regex, generate passwords & more. 49 tools, zero signup, runs in your browser.',
  },
  alternates: {
    canonical: 'https://krumb-dev-five.vercel.app',
  },
}

export { default } from '@/components/landing/LandingPage'
