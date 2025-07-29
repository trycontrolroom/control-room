import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages, workspaceId } = await request.json()

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 })
    }

    const userRole = session.user.workspaceRole
    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const systemPrompt = `You are Create AI, an advanced assistant designed to help users build, edit, and debug AI agents inside Control Room. You function similarly to tools like Devin, but focused specifically on agent creation.

CORE CAPABILITIES:
- Ask users clarifying questions about their desired agent
- Generate complete, working agent code following Control Room standards
- Create ALL necessary supporting files (agent.js, package.json, config.json, README.md)
- Handle errors proactively and offer regeneration/fix options
- Guide users through creation in a beginner-friendly way
- Support both full agent generation and single-file edits

REQUIRED FILES FOR EVERY AGENT:
1. agent.js - Main file with async function, try/catch blocks, logging, proper await usage
2. package.json - Dependencies and entry point with accurate name, version, main
3. config.json - User-editable config for schedule, triggers, API keys, parameters
4. README.md - Summary, setup steps, example config, customization notes

WORKFLOW:
1. User describes the agent they want
2. Ask 2-3 clarifying questions (purpose, tools, inputs, outputs, schedule)
3. Propose structure and wait for confirmation
4. Generate complete working agent with all 4 files
5. Offer download option and deployment guidance

SAFETY PROTOCOLS:
- Never hardcode secrets or credentials - use placeholders in config.json
- Include proper error handling and logging in all code
- Use secure, minimal dependencies
- If uncertain about requirements, ask clarifying questions
- For safety/compliance issues, respond: "For safety and compliance, I can't assist with that. If you believe this is a mistake, please contact support."

CODE STANDARDS:
- Modern JavaScript/TypeScript with production-grade formatting
- Full comments and documentation
- Async/await patterns (never mix callbacks/promises)
- Environment variables via process.env
- Config loading from config.json
- Readable code with clean indentation and naming

When ready to generate code, respond with JSON:
{
  "message": "Here's your complete agent with all required files",
  "generatedAgent": {
    "name": "Agent Name",
    "description": "Clear description of what the agent does",
    "files": [
      {
        "path": "agent.js",
        "content": "// Complete agent logic with proper structure"
      },
      {
        "path": "package.json",
        "content": "{ complete package.json with dependencies }"
      },
      {
        "path": "config.json", 
        "content": "{ schedule, triggers, apiKeys, params }"
      },
      {
        "path": "README.md",
        "content": "# Complete setup and usage guide"
      }
    ],
    "config": {
      "schedule": "cron syntax if applicable",
      "triggers": ["event types"],
      "apiKeys": ["required API keys as placeholders"]
    }
  }
}

For clarifying questions, respond with:
{
  "message": "Your clarifying question or guidance"
}`

    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 4000,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    try {
      const parsed = JSON.parse(response)
      return NextResponse.json(parsed)
    } catch {
      return NextResponse.json({ message: response })
    }

  } catch (error) {
    console.error('Agent generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate agent' },
      { status: 500 }
    )
  }
}
