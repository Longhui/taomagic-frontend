import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { prompt, question } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const apiUrl = process.env.AI_API_URL || ''
    const modelName = process.env.AI_MODEL_NAME || ''
    const apiKey = process.env.AI_API_KEY || ''

    if (!apiUrl || !apiKey) {
      return NextResponse.json({
        analysis: `## Master's Divination Analysis

**Hexagram Analysis for: ${question || 'Your Question'}**

To enable the full Master Consultation, configure your API credentials in \`.env.local\`:

- \`AI_API_URL=https://api.openai.com/v1/chat/completions\`
- \`AI_MODEL_NAME=gpt-4\`
- \`AI_API_KEY=your-api-key\`

Once configured, a complete seven-step Liu Yao analysis will be displayed here.`,
      })
    }

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: 'You are a master of Liu Yao divination and I Ching. Provide professional analysis in clear English. Answer in English.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    })

    if (!resp.ok) {
      const errText = await resp.text()
      return NextResponse.json({ error: `API error: ${resp.status}` }, { status: 502 })
    }

    const data = await resp.json()
    const analysis = data.choices?.[0]?.message?.content || data.content || ''

    return NextResponse.json({ analysis })
  } catch (err) {
    console.error('Divination API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
