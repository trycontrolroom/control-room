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

    const systemPrompt = `You are an AI assistant that helps users build custom AI agents. Your role is to:

1. Ask clarifying questions about the agent's purpose, capabilities, and requirements
2. Determine what APIs, libraries, or environment variables are needed
3. Generate complete, functional agent code when the user is ready

When generating code, create these files:
- agent.js (main agent logic with proper error handling)
- package.json (with all necessary dependencies)
- config.json (configuration with placeholder agentId)
- README.md (setup and usage instructions)

Guidelines:
- Ask 2-3 clarifying questions before generating code
- Offer to use placeholders for API keys if user doesn't have them
- Generate production-ready, well-commented code
- Include proper error handling and logging
- Use modern JavaScript/Node.js patterns

If the user seems ready for code generation, respond with a JSON object containing:
{
  "message": "Your response message",
  "generatedAgent": {
    "name": "Agent Name",
    "description": "Agent description",
    "files": [
      {
        "path": "agent.js",
        "content": "// Agent code here"
      },
      {
        "path": "package.json", 
        "content": "{ ... }"
      }
    ],
    "config": {
      "schedule": "optional cron schedule",
      "triggers": ["list of triggers"],
      "apiKeys": ["list of required API keys"]
    }
  }
}

Otherwise, just respond with:
{
  "message": "Your clarifying question or response"
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
