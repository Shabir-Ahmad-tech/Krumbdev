'use client'

import { useState, useMemo } from 'react'
import { ToolLayout } from '@/components/tools/ToolLayout'

// Sample JSON from weather request provided by user
const SAMPLE_WEATHER_JSON = JSON.stringify(
  {
    current_condition: [
      {
        FeelsLikeC: '16',
        FeelsLikeF: '61',
        cloudcover: '0',
        humidity: '88',
        observation_time: '05:40 AM',
        precipInches: '0.0',
        precipMM: '0.0',
        pressure: '1012',
        pressureInches: '30',
        temp_C: '16',
        temp_F: '61',
        uvIndex: '0',
        visibility: '10',
        visibilityMiles: '6',
        weatherCode: '113',
        weatherDesc: [{ value: 'Sunny' }],
        weatherIconUrl: [
          {
            value:
              'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png',
          },
        ],
        winddir16Point: 'W',
        winddirDegree: '280',
        windspeedKmph: '8',
        windspeedMiles: '5',
      },
    ],
    nearest_area: [
      {
        areaName: [{ value: 'Strand' }],
        country: [{ value: 'United Kingdom' }],
        latitude: '51.508',
        longitude: '-0.121',
        population: '0',
        region: [{ value: 'Westminster Greater London' }],
        weatherUrl: [
          {
            value:
              'https://www.worldweatheronline.com/v2/weather.aspx?q=51.508,-0.121',
          },
        ],
      },
    ],
    request: [
      {
        query: 'Lat 51.51 and Lon -0.13',
        type: 'LatLon',
      },
    ],
  },
  null,
  2
)

const SAMPLE_USER_JSON = JSON.stringify(
  {
    status: 'success',
    user: {
      id: 1024,
      profile: {
        firstName: 'Alex',
        lastName: 'Developer',
        email: 'alex@example.com',
        roles: ['admin', 'editor'],
      },
      settings: {
        notifications: true,
        theme: 'dark',
      },
    },
  },
  null,
  2
)

type Language = 'python' | 'javascript' | 'java' | 'cpp' | 'csharp' | 'go' | 'rust' | 'php'

interface PathNode {
  path: (string | number)[]
  dotPath: string
  value: any
  type: string
}

// Flatten JSON to extract all accessible paths
function flattenPaths(obj: any, parentPath: (string | number)[] = []): PathNode[] {
  let nodes: PathNode[] = []
  if (obj === null || obj === undefined) return nodes

  if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      const currentPath = [...parentPath, Array.isArray(obj) ? parseInt(key, 10) : key]
      const val = obj[key]
      const isObject = typeof val === 'object' && val !== null

      const dotPath = currentPath
        .map((p, idx) =>
          typeof p === 'number' ? `[${p}]` : idx === 0 ? p : `.${p}`
        )
        .join('')

      nodes.push({
        path: currentPath,
        dotPath,
        value: val,
        type: Array.isArray(val) ? 'array' : typeof val,
      })

      if (isObject) {
        nodes = nodes.concat(flattenPaths(val, currentPath))
      }
    }
  }

  return nodes
}

// Convert path to variable name (e.g. current_condition[0].temp_C -> temp_c)
function pathToVarName(path: (string | number)[], style: 'snake' | 'camel' = 'snake'): string {
  const lastKey = path.filter((p) => typeof p === 'string').pop() as string || 'value'
  const cleanKey = lastKey.replace(/[^a-zA-Z0-9]/g, '_').replace(/^_+|_+$/g, '')

  if (style === 'snake') {
    return cleanKey
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .toLowerCase()
  } else {
    const snake = cleanKey.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()
    return snake.replace(/_([a-z0-9])/g, (_, g) => g.toUpperCase())
  }
}

// Generate code for a given path and language
function generateCodeForPath(
  path: (string | number)[],
  lang: Language,
  varRoot: string = 'data'
): string {
  const pyVar = pathToVarName(path, 'snake')
  const jsVar = pathToVarName(path, 'camel')

  switch (lang) {
    case 'python': {
      let accessor = varRoot
      for (const segment of path) {
        if (typeof segment === 'number') {
          accessor += `[${segment}]`
        } else {
          accessor += `["${segment}"]`
        }
      }
      return `${pyVar} = ${accessor}`
    }

    case 'javascript': {
      let accessor = varRoot
      for (const segment of path) {
        if (typeof segment === 'number') {
          accessor += `[${segment}]`
        } else {
          accessor += `.${segment}`
        }
      }
      return `const ${jsVar} = ${accessor};`
    }

    case 'java': {
      let accessor = varRoot
      for (const segment of path) {
        if (typeof segment === 'number') {
          accessor += `.get(${segment})`
        } else {
          accessor += `.get("${segment}")`
        }
      }
      return `String ${jsVar} = ${accessor}.asText();`
    }

    case 'cpp': {
      let accessor = varRoot
      for (const segment of path) {
        if (typeof segment === 'number') {
          accessor += `[${segment}]`
        } else {
          accessor += `["${segment}"]`
        }
      }
      return `auto ${jsVar} = ${accessor};`
    }

    case 'csharp': {
      let accessor = varRoot
      for (const segment of path) {
        if (typeof segment === 'number') {
          accessor += `[${segment}]`
        } else {
          accessor += `["${segment}"]`
        }
      }
      return `string ${jsVar} = ${accessor}?.ToString();`
    }

    case 'go': {
      let accessor = varRoot
      for (const segment of path) {
        if (typeof segment === 'number') {
          accessor += `.([]interface{})[${segment}]`
        } else {
          accessor += `.(map[string]interface{})["${segment}"]`
        }
      }
      return `${jsVar} := ${accessor}`
    }

    case 'rust': {
      let accessor = varRoot
      for (const segment of path) {
        if (typeof segment === 'number') {
          accessor += `[${segment}]`
        } else {
          accessor += `["${segment}"]`
        }
      }
      return `let ${pyVar} = &${accessor};`
    }

    case 'php': {
      let accessor = `$${varRoot}`
      for (const segment of path) {
        if (typeof segment === 'number') {
          accessor += `[${segment}]`
        } else {
          accessor += `['${segment}']`
        }
      }
      return `$${jsVar} = ${accessor};`
    }

    default:
      return ''
  }
}

export default function JsonCodeGeneratorClient() {
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_WEATHER_JSON)
  const [rootVarName, setRootVarName] = useState<string>('data')
  const [selectedPaths, setSelectedPaths] = useState<string[]>([
    'current_condition[0].temp_C',
    'current_condition[0].weatherDesc[0].value',
  ])
  const [activeLang, setActiveLang] = useState<Language>('python')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [copiedLang, setCopiedLang] = useState<string | null>(null)

  // Parse JSON & generate path nodes
  const { parsedJson, pathNodes, parseError } = useMemo(() => {
    try {
      if (!jsonInput.trim()) {
        return { parsedJson: null, pathNodes: [], parseError: null }
      }
      const parsed = JSON.parse(jsonInput)
      const nodes = flattenPaths(parsed)
      return { parsedJson: parsed, pathNodes: nodes, parseError: null }
    } catch (err: any) {
      return { parsedJson: null, pathNodes: [], parseError: err.message }
    }
  }, [jsonInput])

  // Filter nodes by search query
  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return pathNodes
    const q = searchQuery.toLowerCase()
    return pathNodes.filter(
      (n) =>
        n.dotPath.toLowerCase().includes(q) ||
        String(n.value).toLowerCase().includes(q)
    )
  }, [pathNodes, searchQuery])

  // Map of selected path nodes
  const selectedNodes = useMemo(() => {
    return pathNodes.filter((n) => selectedPaths.includes(n.dotPath))
  }, [pathNodes, selectedPaths])

  // Toggle path selection
  const togglePathSelection = (dotPath: string) => {
    setSelectedPaths((prev) =>
      prev.includes(dotPath)
        ? prev.filter((p) => p !== dotPath)
        : [...prev, dotPath]
    )
  }

  // Generate code snippet for all active selected paths
  const generatedCode = useMemo(() => {
    if (!selectedNodes.length) {
      return '// Select one or more properties from the tree below to generate code.'
    }

    return selectedNodes
      .map((node) => generateCodeForPath(node.path, activeLang, rootVarName))
      .join('\n')
  }, [selectedNodes, activeLang, rootVarName])

  // Format JSON handler
  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      setJsonInput(JSON.stringify(parsed, null, 2))
    } catch (e) {
      // Keep as is if invalid
    }
  }

  // Copy code handler
  const handleCopy = (text: string, langName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedLang(langName)
    setTimeout(() => setCopiedLang(null), 2000)
  }

  const languages: { id: Language; label: string; icon: string }[] = [
    { id: 'python', label: 'Python', icon: '🐍' },
    { id: 'javascript', label: 'JavaScript / TS', icon: '⚡' },
    { id: 'java', label: 'Java', icon: '☕' },
    { id: 'cpp', label: 'C++', icon: '⚙️' },
    { id: 'csharp', label: 'C#', icon: '🔷' },
    { id: 'go', label: 'Go', icon: '🐹' },
    { id: 'rust', label: 'Rust', icon: '🦀' },
    { id: 'php', label: 'PHP', icon: '🐘' },
  ]

  const faqList = [
    {
      question: 'How does the JSON Path & Code Generator work?',
      answer:
        'Paste any JSON payload into the editor. The tool automatically parses the JSON structure into an interactive property tree. Select any property or node to instantly generate syntax-accurate code snippets for extracting those values in Python, JavaScript, Java, C++, C#, Go, Rust, or PHP.',
    },
    {
      question: 'Can I extract multiple JSON fields at once?',
      answer:
        'Yes! You can click multiple properties from the property picker (for example, temp_C and weatherDesc). The generator will automatically construct all accessor lines together in your selected programming language.',
    },
    {
      question: 'What libraries are assumed for languages like Java or C++?',
      answer:
        'For Java, code is formatted for Jackson (JsonNode.get().asText()). For C++, it uses the industry-standard nlohmann/json syntax. For C#, it uses System.Text.Json / Newtonsoft.Json indexing. For Python and JavaScript, standard dictionary/object bracket indexing is generated.',
    },
    {
      question: 'Is my JSON uploaded to any external server?',
      answer:
        'No. Processing, parsing, path extraction, and code generation occur 100% locally inside your browser. No JSON data is ever transmitted to a server.',
    },
  ]

  return (
    <ToolLayout
      title="JSON Path & Code Generator"
      description="Pick any property from JSON data and generate extraction code in Python, Java, JavaScript, C++, C#, Go, Rust, and PHP."
      toolSlug="json-code-generator"
      faq={faqList}
    >
      <div className="space-y-6">
        {/* Top Controls & Sample Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0a0a0a] border border-[#222222] p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-[#888888]">Presets:</span>
            <button
              onClick={() => {
                setJsonInput(SAMPLE_WEATHER_JSON)
                setSelectedPaths([
                  'current_condition[0].temp_C',
                  'current_condition[0].weatherDesc[0].value',
                ])
              }}
              className="px-2.5 py-1 text-xs font-mono bg-[#18181b] text-[#00FF41] border border-[#27272a] hover:bg-[#27272a] transition-none"
            >
              Weather API Sample
            </button>
            <button
              onClick={() => {
                setJsonInput(SAMPLE_USER_JSON)
                setSelectedPaths(['user.profile.email', 'user.profile.roles[0]'])
              }}
              className="px-2.5 py-1 text-xs font-mono bg-[#18181b] text-[#F9F9F9] border border-[#27272a] hover:bg-[#27272a] transition-none"
            >
              User Profile Sample
            </button>
            <button
              onClick={handleFormat}
              className="px-2.5 py-1 text-xs font-mono bg-[#18181b] text-[#888888] hover:text-[#F9F9F9] border border-[#27272a] hover:bg-[#27272a] transition-none"
            >
              Beautify JSON
            </button>
          </div>
          <button
            onClick={() => {
              setJsonInput('')
              setSelectedPaths([])
            }}
            className="px-2.5 py-1 text-xs font-mono text-[#ff4444] hover:bg-[#1a0000] border border-[#330000] transition-none"
          >
            Clear Editor
          </button>
        </div>

        {/* Grid Container: Editor vs Generator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column: JSON Input & Property Picker */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#F9F9F9] font-bold block">
                1. Paste JSON Data:
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your JSON object here..."
                rows={12}
                className="w-full bg-[#000000] border border-[#333333] focus:border-[#00FF41] p-3 text-xs font-mono text-[#00FF41] outline-none resize-y"
              />
              {parseError && (
                <div className="p-2.5 bg-[#1a0000] border border-[#ff3333] text-xs font-mono text-[#ff4444]">
                  ⚠️ Invalid JSON: {parseError}
                </div>
              )}
            </div>

            {/* Property Selector Tree */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-[#F9F9F9] font-bold">
                  2. Select Properties to Extract ({selectedPaths.length} selected):
                </label>
                {selectedPaths.length > 0 && (
                  <button
                    onClick={() => setSelectedPaths([])}
                    className="text-[11px] font-mono text-[#888888] hover:text-[#ff4444] underline"
                  >
                    Deselect All
                  </button>
                )}
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search properties (e.g. temp_C, weatherDesc, email)..."
                className="w-full bg-[#000000] border border-[#333333] focus:border-[#00FF41] px-3 py-2 text-xs font-mono text-[#F9F9F9] outline-none"
              />

              <div className="max-h-60 overflow-y-auto bg-[#000000] border border-[#333333] divide-y divide-[#1a1a1a]">
                {filteredNodes.length === 0 ? (
                  <div className="p-4 text-center text-xs font-mono text-[#666666]">
                    {parseError ? 'Fix JSON syntax to see properties.' : 'No matching properties found.'}
                  </div>
                ) : (
                  filteredNodes.map((node) => {
                    const isSelected = selectedPaths.includes(node.dotPath)
                    const valPreview =
                      typeof node.value === 'object'
                        ? Array.isArray(node.value)
                          ? `[${node.value.length} items]`
                          : '{object}'
                        : String(node.value)

                    return (
                      <div
                        key={node.dotPath}
                        onClick={() => togglePathSelection(node.dotPath)}
                        className={`flex items-center justify-between p-2 text-xs font-mono cursor-pointer transition-none ${
                          isSelected
                            ? 'bg-[#002b0c] text-[#00FF41] border-l-2 border-[#00FF41]'
                            : 'hover:bg-[#111111] text-[#CCCCCC]'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden pr-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // Handled by div click
                            className="accent-[#00FF41] cursor-pointer"
                          />
                          <span className="font-bold truncate">{node.dotPath}</span>
                        </div>
                        <span className="text-[10px] text-[#777777] shrink-0 font-mono">
                          = {valPreview.length > 25 ? valPreview.slice(0, 25) + '...' : valPreview}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Code Generator Output */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-[#F9F9F9] font-bold">
                  3. Select Target Language:
                </label>
                <div className="flex items-center gap-1 text-xs font-mono">
                  <span className="text-[#888888]">Variable Name:</span>
                  <input
                    type="text"
                    value={rootVarName}
                    onChange={(e) => setRootVarName(e.target.value || 'data')}
                    className="w-20 bg-[#000000] border border-[#333333] px-2 py-0.5 text-xs font-mono text-[#00FF41] outline-none"
                  />
                </div>
              </div>

              {/* Language Selector Tabs */}
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-1">
                {languages.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLang(l.id)}
                    className={`py-2 px-1 text-xs font-mono text-center border transition-none flex items-center justify-center gap-1 ${
                      activeLang === l.id
                        ? 'bg-[#00FF41] text-[#000000] font-bold border-[#00FF41]'
                        : 'bg-[#111111] text-[#888888] border-[#222222] hover:text-[#F9F9F9] hover:border-[#444444]'
                    }`}
                  >
                    <span>{l.icon}</span>
                    <span className="truncate">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Code Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#00FF41] font-bold">
                  ⚡ Generated Code ({activeLang.toUpperCase()}):
                </span>
                <button
                  onClick={() => handleCopy(generatedCode, activeLang)}
                  className="px-3 py-1 text-xs font-mono bg-[#00FF41] text-[#000000] font-bold hover:bg-[#00cc33] transition-none"
                >
                  {copiedLang === activeLang ? '✓ Copied!' : 'Copy Code'}
                </button>
              </div>

              <textarea
                value={generatedCode}
                readOnly
                rows={14}
                className="w-full bg-[#050505] border border-[#222222] p-4 text-xs font-mono text-[#F9F9F9] outline-none leading-relaxed"
              />
            </div>

            {/* Preview of Code for All Languages */}
            <div className="p-3 bg-[#0a0a0a] border border-[#222222] space-y-2">
              <span className="text-xs font-mono text-[#888888] font-bold block">
                💡 Code Snippet Summary for Selected Keys:
              </span>
              <div className="text-[11px] font-mono text-[#666666] space-y-1">
                {selectedNodes.map((n) => (
                  <div key={n.dotPath} className="flex items-center justify-between">
                    <span className="text-[#00FF41] font-bold">{n.dotPath}</span>
                    <span className="text-[#888888] truncate max-w-[200px]">
                      {generateCodeForPath(n.path, activeLang, rootVarName)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive SEO Content Section */}
        <section className="border-t border-[#333333] pt-8 mt-12 space-y-6">
          <h2 className="text-lg font-heading font-bold text-[#F9F9F9]">
            Generate Code to Access JSON Properties Instantly
          </h2>

          <div className="space-y-4 text-xs md:text-sm font-mono text-[#888888] leading-relaxed">
            <p>
              Extracting nested fields from complex API response payloads like weather APIs, payment webhooks, or open-graph datasets can be tedious and prone to index or syntax errors. The <strong>JSON Path & Code Generator</strong> bridges the gap between raw JSON payloads and clean, error-free code in your choice of programming language.
            </p>
            <p>
              Simply paste your JSON object, select any key or property from the interactive tree view, and copy ready-to-use access code for <strong>Python</strong>, <strong>JavaScript/TypeScript</strong>, <strong>Java</strong>, <strong>C++</strong>, <strong>C#</strong>, <strong>Go</strong>, <strong>Rust</strong>, and <strong>PHP</strong>.
            </p>

            <h3 className="text-sm font-heading font-bold text-[#F9F9F9] pt-2">
              Supported Programming Languages & Syntax
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="border border-[#222222] p-3 space-y-1 bg-[#050505]">
                <span className="text-xs font-bold text-[#00FF41]">🐍 Python</span>
                <p className="text-[11px] text-[#777777]">
                  Generates dictionary indexing syntax using square brackets (e.g. <code>data["current_condition"][0]["temp_C"]</code>).
                </p>
              </div>
              <div className="border border-[#222222] p-3 space-y-1 bg-[#050505]">
                <span className="text-xs font-bold text-[#00FF41]">⚡ JavaScript / TypeScript</span>
                <p className="text-[11px] text-[#777777]">
                  Generates clean dot notation and array index accessor statements (e.g. <code>data.current_condition[0].temp_C</code>).
                </p>
              </div>
              <div className="border border-[#222222] p-3 space-y-1 bg-[#050505]">
                <span className="text-xs font-bold text-[#00FF41]">☕ Java (Jackson)</span>
                <p className="text-[11px] text-[#777777]">
                  Generates method chaining syntax for <code>JsonNode</code> objects (e.g. <code>data.get("current_condition").get(0).asText()</code>).
                </p>
              </div>
              <div className="border border-[#222222] p-3 space-y-1 bg-[#050505]">
                <span className="text-xs font-bold text-[#00FF41]">⚙️ C++ (nlohmann/json)</span>
                <p className="text-[11px] text-[#777777]">
                  Generates index accessors compatible with the popular nlohmann::json header library.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ToolLayout>
  )
}
