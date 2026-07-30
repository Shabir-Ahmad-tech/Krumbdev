'use client'

import { useState } from 'react'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { Copy, Download, FileCode, CheckCircle2, AlertTriangle } from 'lucide-react'

const schemaFaq = [
  {
    question: 'What is JSON Schema?',
    answer: 'JSON Schema is a declarative, standard vocabulary for validating the structure, types, constraints, and required fields of JSON data objects. It is widely used in API specification (OpenAPI/Swagger), config validation, and database schema contracts.'
  },
  {
    question: 'Which JSON Schema draft version is generated?',
    answer: 'This tool supports generating both Draft-07 (http://json-schema.org/draft-07/schema#) and Draft 2020-12 schemas.'
  }
]

const schemaSeo = (
  <div className="space-y-4">
    <h2 className="text-lg font-heading font-bold text-[#F9F9F9]">JSON Schema Generator & Validator</h2>
    <p>
      Paste any sample JSON payload to infer a complete, strongly-typed JSON Schema contract. Infer string formats (UUID, email, date-time), nested arrays, objects, required property lists, and numeric constraints.
    </p>
  </div>
)

export default function JsonSchemaGeneratorClient() {
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(
      {
        id: "usr_99812",
        name: "Alex Mercer",
        email: "alex@example.com",
        isActive: true,
        age: 29,
        roles: ["admin", "developer"],
        settings: {
          notifications: true,
          theme: "dark"
        }
      },
      null,
      2
    )
  )
  const [schemaOutput, setSchemaOutput] = useState<string>('')
  const [draftVersion, setDraftVersion] = useState<'draft-07' | '2020-12'>('draft-07')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSchema = () => {
    setError(null)
    if (!jsonInput.trim()) {
      setSchemaOutput('')
      return
    }

    try {
      const parsed = JSON.parse(jsonInput)
      const schema = buildSchemaForValue(parsed, draftVersion)
      setSchemaOutput(JSON.stringify(schema, null, 2))
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON input. Please enter valid JSON.')
      setSchemaOutput('')
    }
  }

  const buildSchemaForValue = (val: any, draft: string): any => {
    const schemaDraftUri =
      draft === '2020-12'
        ? 'https://json-schema.org/draft/2020-12/schema'
        : 'http://json-schema.org/draft-07/schema#'

    const rootSchema: any = {
      $schema: schemaDraftUri,
      type: getTypeName(val)
    }

    if (rootSchema.type === 'object' && val !== null) {
      const { properties, required } = processObject(val)
      rootSchema.properties = properties
      if (required.length > 0) rootSchema.required = required
    } else if (rootSchema.type === 'array') {
      rootSchema.items = processArray(val)
    }

    return rootSchema
  }

  const getTypeName = (val: any): string => {
    if (val === null) return 'null'
    if (Array.isArray(val)) return 'array'
    const t = typeof val
    if (t === 'number') return Number.isInteger(val) ? 'integer' : 'number'
    return t
  }

  const processObject = (obj: Record<string, any>) => {
    const properties: Record<string, any> = {}
    const required: string[] = []

    for (const key of Object.keys(obj)) {
      required.push(key)
      const val = obj[key]
      const type = getTypeName(val)
      const propSchema: any = { type }

      if (type === 'string') {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)) {
          propSchema.format = 'uuid'
        } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          propSchema.format = 'email'
        } else if (!isNaN(Date.parse(val)) && val.includes('T')) {
          propSchema.format = 'date-time'
        }
      } else if (type === 'object' && val !== null) {
        const child = processObject(val)
        propSchema.properties = child.properties
        if (child.required.length > 0) propSchema.required = child.required
      } else if (type === 'array') {
        propSchema.items = processArray(val)
      }

      properties[key] = propSchema
    }

    return { properties, required }
  }

  const processArray = (arr: any[]): any => {
    if (arr.length === 0) return {}
    const types = Array.from(new Set(arr.map((item) => getTypeName(item))))
    if (types.length === 1) {
      const type = types[0]
      if (type === 'object') {
        // Merge objects
        const mergedObj = arr.reduce((acc, curr) => ({ ...acc, ...curr }), {})
        const child = processObject(mergedObj)
        return { type: 'object', properties: child.properties, required: child.required }
      }
      return { type }
    }
    return { type: types }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(schemaOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!schemaOutput) return
    const blob = new Blob([schemaOutput], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'schema.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout
      title="JSON Schema Generator & Validator"
      description="Generate Draft-07 and Draft 2020-12 JSON Schemas automatically from JSON data."
      toolSlug="json-schema-generator"
      faq={schemaFaq}
      seoContent={schemaSeo}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#888888]">Draft Standard:</span>
            <button
              type="button"
              onClick={() => setDraftVersion('draft-07')}
              className={`terminal-btn ${draftVersion === 'draft-07' ? 'text-[#00FF41]' : ''}`}
            >
              [<span className="green-chevron">&gt;</span> Draft-07]
            </button>
            <button
              type="button"
              onClick={() => setDraftVersion('2020-12')}
              className={`terminal-btn ${draftVersion === '2020-12' ? 'text-[#00FF41]' : ''}`}
            >
              [<span className="green-chevron">&gt;</span> Draft 2020-12]
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono text-[#888888] uppercase">
              {'>'} SAMPLE JSON INPUT
            </label>
            {jsonInput && (
              <button
                type="button"
                onClick={() => {
                  setJsonInput('')
                  setSchemaOutput('')
                  setError(null)
                }}
                className="text-[10px] font-mono text-[#555555] hover:text-[#F9F9F9] uppercase tracking-wider"
              >
                [ CLEAR ]
              </button>
            )}
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-[#F9F9F9] bg-[#000000] text-[#F9F9F9] font-mono text-xs md:text-sm focus:border-2 focus:border-[#00FF41] focus:outline-none resize-y"
          />
        </div>

        <button
          type="button"
          onClick={generateSchema}
          className="terminal-btn bg-[#00FF41] text-[#000000] font-bold hover:bg-[#00CC33]"
        >
          [ &gt; GENERATE JSON SCHEMA ]
        </button>

        {error && (
          <div className="p-4 border border-[#FF3333] bg-[#000000] text-[#FF3333] flex items-start gap-2 text-xs font-mono">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold underline">{'>'} INVALID JSON</p>
              <p className="mt-0.5 text-[#888888]">{error}</p>
            </div>
          </div>
        )}

        {schemaOutput && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono text-[#888888] uppercase">{'>'} GENERATED JSON SCHEMA</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="terminal-btn"
                >
                  [<span className="green-chevron">&gt;</span> DOWNLOAD .JSON]
                </button>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="terminal-btn"
                >
                  [<span className="green-chevron">&gt;</span> {copied ? 'COPIED' : 'COPY'}]
                </button>
              </div>
            </div>
            <textarea
              value={schemaOutput}
              readOnly
              rows={10}
              className="w-full px-4 py-3 border border-[#00FF41] bg-[#000000] text-[#00FF41] font-mono text-xs md:text-sm focus:outline-none resize-y"
            />
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
