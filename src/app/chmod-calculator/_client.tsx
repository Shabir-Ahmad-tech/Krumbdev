'use client'

import { useState } from 'react'
import { ToolLayout } from '@/components/tools/ToolLayout'
import { ShieldCheck, Copy, Check, Terminal } from 'lucide-react'

const chmodFaq = [
  {
    question: 'What is Linux chmod?',
    answer: 'chmod (change mode) is a system command in Linux/Unix operating systems used to alter the access permissions of files and directories. Permissions determine who can Read (r=4), Write (w=2), or Execute (x=1) a file.'
  },
  {
    question: 'How do octal permissions work?',
    answer: 'Octal permissions use a 3-digit number where the first digit represents the Owner (User), the second represents the Group, and the third represents Others (Public). Each digit is the sum of permissions: Read (4) + Write (2) + Execute (1). For example, 755 means Owner=7 (4+2+1), Group=5 (4+1), Others=5 (4+1).'
  },
  {
    question: 'What are common Linux file permissions?',
    answer: 'Common modes include: 755 (rwxr-xr-x) for web directory scripts and executables, 644 (rw-r--r--) for standard web files (HTML/CSS/JS), 600 (rw-------) for private SSH keys and passwords, and 777 (rwxrwxrwx) for temporary shared folders (use with caution).'
  },
  {
    question: 'What is the difference between symbolic and octal notation?',
    answer: 'Octal uses numbers like 755 or 644. Symbolic notation uses 9 characters representing r (read), w (write), x (execute), and - (no permission), grouped in sets of 3: -rwxr-xr-x.'
  }
]

const chmodSeo = (
  <div className="space-y-4">
    <h2 className="text-lg font-heading font-bold text-[#F9F9F9]">Linux Chmod & File Permissions Calculator</h2>
    <p>
      Use this interactive calculator to generate Linux <code className="px-1.5 py-0.5 bg-[#0a0a0a] text-[#00FF41]">chmod</code> octal numbers (e.g. 755, 644) and symbolic notation strings (e.g. <code className="px-1.5 py-0.5 bg-[#0a0a0a] text-[#00FF41]">-rwxr-xr-x</code>). Toggle permission flags for User, Group, and Others or choose from built-in Linux server security presets.
    </p>
  </div>
)

interface PermState {
  r: boolean
  w: boolean
  x: boolean
}

export default function ChmodCalculatorClient() {
  const [owner, setOwner] = useState<PermState>({ r: true, w: true, x: true })
  const [group, setGroup] = useState<PermState>({ r: true, w: false, x: true })
  const [others, setOthers] = useState<PermState>({ r: true, w: false, x: true })

  const [isRecursive, setIsRecursive] = useState(false)
  const [targetPath, setTargetPath] = useState('/var/www/html/script.sh')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const calcDigit = (p: PermState) => (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0)
  const ownerOctal = calcDigit(owner)
  const groupOctal = calcDigit(group)
  const othersOctal = calcDigit(others)

  const octalString = `${ownerOctal}${groupOctal}${othersOctal}`

  const formatSymbolicSet = (p: PermState) => `${p.r ? 'r' : '-'}${p.w ? 'w' : '-'}${p.x ? 'x' : '-'}`
  const symbolicString = `-${formatSymbolicSet(owner)}${formatSymbolicSet(group)}${formatSymbolicSet(others)}`

  const chmodCommand = `chmod ${isRecursive ? '-R ' : ''}${octalString} ${targetPath}`

  const handlePreset = (octal: string) => {
    const o = parseInt(octal[0], 10)
    const g = parseInt(octal[1], 10)
    const ot = parseInt(octal[2], 10)

    setOwner({ r: (o & 4) !== 0, w: (o & 2) !== 0, x: (o & 1) !== 0 })
    setGroup({ r: (g & 4) !== 0, w: (g & 2) !== 0, x: (g & 1) !== 0 })
    setOthers({ r: (ot & 4) !== 0, w: (ot & 2) !== 0, x: (ot & 1) !== 0 })
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <ToolLayout
      title="Linux Chmod & Permissions Calculator"
      description="Calculate Linux file permissions, octal values, symbolic strings, and terminal commands instantly."
      toolSlug="chmod-calculator"
      faq={chmodFaq}
      seoContent={chmodSeo}
    >
      <div className="space-y-6">
        {/* Presets Bar */}
        <div>
          <label className="block text-xs font-mono text-[#888888] uppercase mb-2">
            {'>'} COMMON PERMISSION PRESETS
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handlePreset('755')}
              className="px-3 py-2 border border-[#333333] bg-[#000000] text-left hover:border-[#00FF41]"
            >
              <div className="text-xs font-mono font-bold text-[#00FF41]">755</div>
              <div className="text-[10px] font-mono text-[#888888]">Web Executable / Folder</div>
            </button>
            <button
              type="button"
              onClick={() => handlePreset('644')}
              className="px-3 py-2 border border-[#333333] bg-[#000000] text-left hover:border-[#00FF41]"
            >
              <div className="text-xs font-mono font-bold text-[#00FF41]">644</div>
              <div className="text-[10px] font-mono text-[#888888]">Standard Web File</div>
            </button>
            <button
              type="button"
              onClick={() => handlePreset('600')}
              className="px-3 py-2 border border-[#333333] bg-[#000000] text-left hover:border-[#00FF41]"
            >
              <div className="text-xs font-mono font-bold text-[#00FF41]">600</div>
              <div className="text-[10px] font-mono text-[#888888]">Private Key / Secret</div>
            </button>
            <button
              type="button"
              onClick={() => handlePreset('777')}
              className="px-3 py-2 border border-[#333333] bg-[#000000] text-left hover:border-[#FF3333]"
            >
              <div className="text-xs font-mono font-bold text-[#FF3333]">777</div>
              <div className="text-[10px] font-mono text-[#888888]">Full Public Access</div>
            </button>
          </div>
        </div>

        {/* 3x3 Checkbox Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Owner */}
          <div className="p-4 border border-[#333333] bg-[#000000] space-y-3">
            <div className="flex items-center justify-between border-b border-[#222222] pb-2">
              <span className="text-xs font-mono font-bold text-[#F9F9F9] uppercase">Owner (User)</span>
              <span className="text-sm font-mono font-bold text-[#00FF41]">{ownerOctal}</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <label className="flex items-center gap-2 cursor-pointer text-[#F9F9F9]">
                <input
                  type="checkbox"
                  checked={owner.r}
                  onChange={(e) => setOwner({ ...owner, r: e.target.checked })}
                  className="accent-[#00FF41]"
                />
                Read (r = 4)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[#F9F9F9]">
                <input
                  type="checkbox"
                  checked={owner.w}
                  onChange={(e) => setOwner({ ...owner, w: e.target.checked })}
                  className="accent-[#00FF41]"
                />
                Write (w = 2)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[#F9F9F9]">
                <input
                  type="checkbox"
                  checked={owner.x}
                  onChange={(e) => setOwner({ ...owner, x: e.target.checked })}
                  className="accent-[#00FF41]"
                />
                Execute (x = 1)
              </label>
            </div>
          </div>

          {/* Group */}
          <div className="p-4 border border-[#333333] bg-[#000000] space-y-3">
            <div className="flex items-center justify-between border-b border-[#222222] pb-2">
              <span className="text-xs font-mono font-bold text-[#F9F9F9] uppercase">Group</span>
              <span className="text-sm font-mono font-bold text-[#00FF41]">{groupOctal}</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <label className="flex items-center gap-2 cursor-pointer text-[#F9F9F9]">
                <input
                  type="checkbox"
                  checked={group.r}
                  onChange={(e) => setGroup({ ...group, r: e.target.checked })}
                  className="accent-[#00FF41]"
                />
                Read (r = 4)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[#F9F9F9]">
                <input
                  type="checkbox"
                  checked={group.w}
                  onChange={(e) => setGroup({ ...group, w: e.target.checked })}
                  className="accent-[#00FF41]"
                />
                Write (w = 2)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[#F9F9F9]">
                <input
                  type="checkbox"
                  checked={group.x}
                  onChange={(e) => setGroup({ ...group, x: e.target.checked })}
                  className="accent-[#00FF41]"
                />
                Execute (x = 1)
              </label>
            </div>
          </div>

          {/* Others */}
          <div className="p-4 border border-[#333333] bg-[#000000] space-y-3">
            <div className="flex items-center justify-between border-b border-[#222222] pb-2">
              <span className="text-xs font-mono font-bold text-[#F9F9F9] uppercase">Others (Public)</span>
              <span className="text-sm font-mono font-bold text-[#00FF41]">{othersOctal}</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <label className="flex items-center gap-2 cursor-pointer text-[#F9F9F9]">
                <input
                  type="checkbox"
                  checked={others.r}
                  onChange={(e) => setOthers({ ...others, r: e.target.checked })}
                  className="accent-[#00FF41]"
                />
                Read (r = 4)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[#F9F9F9]">
                <input
                  type="checkbox"
                  checked={others.w}
                  onChange={(e) => setOthers({ ...others, w: e.target.checked })}
                  className="accent-[#00FF41]"
                />
                Write (w = 2)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[#F9F9F9]">
                <input
                  type="checkbox"
                  checked={others.x}
                  onChange={(e) => setOthers({ ...others, x: e.target.checked })}
                  className="accent-[#00FF41]"
                />
                Execute (x = 1)
              </label>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="p-5 border border-[#333333] bg-[#000000] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-[#888888] uppercase">Octal Notation</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(octalString, 'octal')}
                  className="text-[10px] font-mono text-[#00FF41] hover:underline"
                >
                  {copiedKey === 'octal' ? '[ COPIED ]' : '[ COPY ]'}
                </button>
              </div>
              <div className="text-2xl font-mono font-bold text-[#00FF41] p-3 border border-[#222222] bg-[#0a0a0a]">
                {octalString}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-[#888888] uppercase">Symbolic Notation</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(symbolicString, 'symbolic')}
                  className="text-[10px] font-mono text-[#00FF41] hover:underline"
                >
                  {copiedKey === 'symbolic' ? '[ COPIED ]' : '[ COPY ]'}
                </button>
              </div>
              <div className="text-2xl font-mono font-bold text-[#F9F9F9] p-3 border border-[#222222] bg-[#0a0a0a]">
                {symbolicString}
              </div>
            </div>
          </div>

          {/* Terminal Command Generator */}
          <div className="pt-3 border-t border-[#222222] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono text-[#888888] uppercase flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00FF41]" />
                Generated Linux Command
              </span>
              <label className="flex items-center gap-2 text-xs font-mono text-[#888888] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecursive}
                  onChange={(e) => setIsRecursive(e.target.checked)}
                  className="accent-[#00FF41]"
                />
                Recursive (-R)
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={targetPath}
                onChange={(e) => setTargetPath(e.target.value)}
                placeholder="/path/to/file_or_directory"
                className="flex-1 px-3 py-2 border border-[#444444] bg-[#0a0a0a] text-[#F9F9F9] font-mono text-xs focus:border-[#00FF41] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(chmodCommand, 'command')}
                className="terminal-btn bg-[#00FF41] text-[#000000] font-bold"
              >
                [ {copiedKey === 'command' ? 'COPIED' : 'COPY COMMAND'} ]
              </button>
            </div>

            <div className="p-3 border border-[#222222] bg-[#0a0a0a] text-xs font-mono text-[#00FF41]">
              $ {chmodCommand}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
