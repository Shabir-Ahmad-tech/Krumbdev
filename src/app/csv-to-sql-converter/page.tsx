import type { Metadata } from 'next'
import Client from './_client'

export const metadata: Metadata = {
  title: 'CSV to SQL Insert Converter — Free Online Developer Tool',
  description: 'Convert CSV data into SQL INSERT INTO queries for MySQL, PostgreSQL, SQLite, MS SQL Server, and Oracle. Auto type detection, custom table names, and batch options.',
  openGraph: {
    title: 'CSV to SQL Insert Converter — Free Online Developer Tool',
    description: 'Convert CSV tables to SQL INSERT INTO statements. Instant client-side conversion for MySQL, Postgres, SQLite & Oracle.',
  },
}

export default function Page() {
  return <Client />
}
