import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KRUMB.DEV — 47 Free Developer Tools, Zero Signup',
  description:
    'Format JSON, decode JWT, test regex, generate passwords, and more — all in your browser. Most tools run 100% client-side. No upload, no accounts, no tracking.',
  openGraph: {
    title: 'KRUMB.DEV — 47 Free Developer Tools, Zero Signup',
    description:
      'Format JSON, decode JWT, test regex, generate passwords, and more. Most tools run 100% client-side. No upload, no accounts.',
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
    title: 'KRUMB.DEV — 47 Free Developer Tools, Zero Signup',
    description:
      'Format JSON, decode JWT, test regex, generate passwords, and more. Most tools run 100% client-side.',
  },
  alternates: {
    canonical: 'https://krumb-dev-five.vercel.app',
  },
}

export { default } from '@/components/landing/LandingPage'
