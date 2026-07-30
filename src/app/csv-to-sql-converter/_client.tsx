'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check, Download, RotateCcw } from 'lucide-react'

const SAMPLE_CSV = `id,name,email,age,is_active,created_at
1,John Doe,john@example.com,29,true,2026-01-15
2,Jane Smith,jane@example.com,34,false,2026-02-20
3,Bob Johnson,bob@example.com,42,true,2026-03-10`

type Dialect = 'mysql' | 'postgres' | 'sqlite' | 'mssql' | 'oracle'

export default function CsvToSqlConverterClient() {
  const [csvInput, setCsvInput] = useState(SAMPLE_CSV)
  const [tableName, setTableName] = useState('users')
  const [dialect, setDialect] = useState<Dialect>('postgres')
  const [batchSize, setBatchSize] = useState<number>(100)
  const [autoTypes, setAutoTypes] = useState(true)
  const [copied, setCopied] = useState(false)

  // CSV Parser helper
  const parseCsv = (text: string) => {
    const lines = text.trim().split(/\r?\n/)
    if (lines.length === 0 || !lines[0].trim()) return { headers: [], rows: [] }

    const parseLine = (line: string) => {
      const result: string[] = []
      let current = ''
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"'
            i++
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result
    }

    const headers = parseLine(lines[0])
    const rows = lines.slice(1).filter(l => l.trim().length > 0).map(parseLine)

    return { headers, rows }
  }

  const formatValue = (val: string) => {
    if (!val || val.toUpperCase() === 'NULL') return 'NULL'
    if (!autoTypes) return `'${val.replace(/'/g, "''")}'`

    // Number check
    if (!isNaN(Number(val)) && val.trim() !== '') return val

    // Boolean check
    if (val.toLowerCase() === 'true') return 'TRUE'
    if (val.toLowerCase() === 'false') return 'FALSE'

    // String escaping
    return `'${val.replace(/'/g, "''")}'`
  }

  const quoteIdentifier = (id: string, d: Dialect) => {
    const clean = id.trim().replace(/[^a-zA-Z0-9_]/g, '_')
    if (d === 'mysql') return `\`${clean}\``
    if (d === 'mssql') return `[${clean}]`
    if (d === 'oracle') return `"${clean.toUpperCase()}"`
    return `"${clean}"` // postgres & sqlite
  }

  const generateSql = () => {
    try {
      const { headers, rows } = parseCsv(csvInput)
      if (headers.length === 0 || rows.length === 0) {
        return '-- Please enter valid CSV content'
      }

      const qTable = quoteIdentifier(tableName || 'my_table', dialect)
      const qHeaders = headers.map(h => quoteIdentifier(h, dialect)).join(', ')

      const statements: string[] = []

      for (let i = 0; i < rows.length; i += batchSize) {
        const chunk = rows.slice(i, i + batchSize)
        const valuesList = chunk.map(row => {
          const values = headers.map((_, colIdx) => formatValue(row[colIdx] ?? ''))
          return `  (${values.join(', ')})`
        })

        if (dialect === 'oracle') {
          // Oracle INSERT ALL syntax
          const oracleInserts = chunk.map(row => {
            const values = headers.map((_, colIdx) => formatValue(row[colIdx] ?? ''))
            return `INTO ${qTable} (${qHeaders}) VALUES (${values.join(', ')})`
          }).join('\n')
          statements.push(`INSERT ALL\n${oracleInserts}\nSELECT 1 FROM DUAL;`)
        } else {
          // Standard multi-row INSERT
          statements.push(
            `INSERT INTO ${qTable} (${qHeaders})\nVALUES\n${valuesList.join(',\n')};`
          )
        }
      }

      return statements.join('\n\n')
    } catch {
      return '-- Error generating SQL from CSV'
    }
  }

  const sqlResult = generateSql()

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlResult)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([sqlResult], { type: 'text/sql;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tableName || 'data'}.sql`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#F9F9F9] pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-[#333333] pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#888888] mb-2">
          <Link href="/tools" className="hover:text-[#00FF41] transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-[#F9F9F9]">csv-to-sql-converter</span>
        </div>
        <h1 className="font-heading text-2xl md:text-4xl font-bold text-[#F9F9F9] tracking-tight">
          <span className="text-[#00FF41] font-mono text-xl mr-2">&gt;</span>CSV to SQL Insert Converter
        </h1>
        <p className="font-mono text-xs md:text-sm text-[#888888] mt-2">
          Convert CSV tables to SQL INSERT statements. Supports MySQL, PostgreSQL, SQLite, MS SQL Server, and Oracle.
        </p>
      </div>

      {/* Options */}
      <div className="bg-[#0a0a0a] border border-[#333333] p-4 font-mono text-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-[#888888] mb-1">Target Table Name:</label>
          <input
            type="text"
            value={tableName}
            onChange={e => setTableName(e.target.value)}
            className="w-full bg-[#000000] border border-[#333333] text-[#F9F9F9] px-3 py-1.5 focus:border-[#00FF41] outline-none"
          />
        </div>

        <div>
          <label className="block text-[#888888] mb-1">SQL Dialect:</label>
          <select
            value={dialect}
            onChange={e => setDialect(e.target.value as Dialect)}
            className="w-full bg-[#000000] border border-[#333333] text-[#00FF41] px-3 py-1.5 focus:border-[#00FF41] outline-none cursor-pointer"
          >
            <option value="postgres">PostgreSQL</option>
            <option value="mysql">MySQL / MariaDB</option>
            <option value="sqlite">SQLite</option>
            <option value="mssql">MS SQL Server</option>
            <option value="oracle">Oracle</option>
          </select>
        </div>

        <div>
          <label className="block text-[#888888] mb-1">Batch Chunk Size:</label>
          <input
            type="number"
            min={1}
            max={1000}
            value={batchSize}
            onChange={e => setBatchSize(Number(e.target.value) || 100)}
            className="w-full bg-[#000000] border border-[#333333] text-[#F9F9F9] px-3 py-1.5 focus:border-[#00FF41] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-5">
          <input
            type="checkbox"
            id="autoTypes"
            checked={autoTypes}
            onChange={e => setAutoTypes(e.target.checked)}
            className="accent-[#00FF41] cursor-pointer"
          />
          <label htmlFor="autoTypes" className="text-[#F9F9F9] cursor-pointer select-none">
            Auto-detect numbers & booleans
          </label>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSV Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-[#888888]">
            <span>Input CSV:</span>
            <button
              onClick={() => setCsvInput(SAMPLE_CSV)}
              className="text-[#00FF41] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Sample
            </button>
          </div>
          <textarea
            value={csvInput}
            onChange={e => setCsvInput(e.target.value)}
            placeholder="Paste your CSV header & rows here..."
            className="w-full h-[450px] bg-[#050505] border border-[#333333] p-4 font-mono text-xs text-[#F9F9F9] focus:border-[#00FF41] outline-none resize-none"
          />
        </div>

        {/* SQL Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs text-[#888888]">
            <span>Generated SQL Queries:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="text-[#00FF41] hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="text-[#00FF41] hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Download .sql
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={sqlResult}
            className="w-full h-[450px] bg-[#050505] border border-[#333333] p-4 font-mono text-xs text-[#00FF41] outline-none resize-none select-all"
          />
        </div>
      </div>
    </div>
  )
}
