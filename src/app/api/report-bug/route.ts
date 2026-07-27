import { NextRequest, NextResponse } from 'next/server'

interface ReportBody {
  type: string
  tool: string
  subject: string
  description: string
  email: string
}

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

export async function POST(request: NextRequest) {
  try {
    const body: ReportBody = await request.json()

    if (!body.subject || !body.description) {
      return NextResponse.json({ error: 'Subject and description are required' }, { status: 400 })
    }

    if (!DISCORD_WEBHOOK_URL) {
      // No webhook configured — log to console in dev, return success but warn
      console.log('[report-bug]', JSON.stringify(body, null, 2))
      return NextResponse.json({
        success: true,
        note: 'Report received (webhook not configured — logged to console)',
      })
    }

    const embed = {
      embeds: [{
        title: `${body.type === 'bug' ? '🐛' : body.type === 'feature' ? '✨' : '💬'} ${body.subject}`,
        color: body.type === 'bug' ? 0xFF4444 : body.type === 'feature' ? 0x00FF41 : 0x888888,
        fields: [
          { name: 'Type', value: body.type, inline: true },
          { name: 'Tool', value: body.tool || 'N/A', inline: true },
          { name: 'Email', value: body.email || 'Not provided', inline: true },
          { name: 'Description', value: body.description },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: 'KRUMB.DEV Bug Report' },
      }],
    }

    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(embed),
    })

    if (!res.ok) {
      console.error('[report-bug] Discord webhook returned', res.status, await res.text())
      return NextResponse.json({ error: 'Failed to deliver report' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[report-bug]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
