import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Linux Chmod & Permissions Calculator — Free Online Dev Tool',
  description: 'Calculate Linux chmod numeric octal permissions and symbolic notation. Toggle Read, Write, and Execute checkboxes for User, Group, and Others.',
  openGraph: {
    title: 'Linux Chmod & Permissions Calculator — Free Online Dev Tool',
    description: 'Calculate Linux chmod numeric octal permissions and symbolic notation. Toggle Read, Write, and Execute checkboxes for User, Group, and Others.',
    type: 'website',
  },
}

export { default } from './_client'
