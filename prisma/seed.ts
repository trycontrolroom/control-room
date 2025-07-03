import { PrismaClient, UserRole, AgentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@control-room.ai' },
    update: {},
    create: {
      email: 'admin@control-room.ai',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  })

  const demoPassword = await bcrypt.hash('demo123', 12)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@control-room.ai' },
    update: {},
    create: {
      email: 'demo@control-room.ai',
      name: 'Demo User',
      password: demoPassword,
      role: UserRole.MANAGER,
    },
  })

  const workspace = await prisma.workspace.create({
    data: {
      name: `${demoUser.name || demoUser.email}'s Workspace`
    }
  })

  await prisma.workspaceMember.create({
    data: {
      userId: demoUser.id,
      workspaceId: workspace.id,
      role: 'ADMIN'
    }
  })

  const agent1 = await prisma.agent.create({
    data: {
      name: 'Agent Alpha',
      description: 'Customer service AI agent',
      status: AgentStatus.ACTIVE,
      uptime: 99.5,
      errorCount: 2,
      userId: demoUser.id,
      workspaceId: workspace.id,
    },
  })

  const agent2 = await prisma.agent.create({
    data: {
      name: 'Agent Bravo',
      description: 'Data processing AI agent',
      status: AgentStatus.PAUSED,
      uptime: 87.3,
      errorCount: 15,
      userId: demoUser.id,
      workspaceId: workspace.id,
    },
  })

  const now = new Date()
  const metricsData = []
  
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000) // Last 24 hours
    
    metricsData.push(
      {
        agentId: agent1.id,
        name: 'latency',
        value: Math.random() * 100 + 50,
        unit: 'ms',
        timestamp,
      },
      {
        agentId: agent1.id,
        name: 'error_rate',
        value: Math.random() * 5,
        unit: '%',
        timestamp,
      },
      {
        agentId: agent1.id,
        name: 'cost',
        value: Math.random() * 10 + 5,
        unit: 'USD',
        timestamp,
      },
      {
        agentId: agent2.id,
        name: 'latency',
        value: Math.random() * 150 + 75,
        unit: 'ms',
        timestamp,
      },
      {
        agentId: agent2.id,
        name: 'error_rate',
        value: Math.random() * 15 + 5,
        unit: '%',
        timestamp,
      },
      {
        agentId: agent2.id,
        name: 'cost',
        value: Math.random() * 15 + 8,
        unit: 'USD',
        timestamp,
      }
    )
  }

  await prisma.metric.createMany({
    data: metricsData,
  })

  await prisma.marketplaceAgent.createMany({
    data: [
      {
        name: 'ChatBot Pro',
        description: 'Advanced conversational AI for customer support',
        price: 29.99,
        category: 'Customer Service',
        capabilities: { languages: ['en', 'es', 'fr'], features: ['sentiment_analysis', 'escalation'] },
        instructions: 'Deploy this agent to handle customer inquiries with advanced NLP capabilities.',
        rating: 4.8,
        installs: 1250,
        revenue: 37475,
        isApproved: true,
        sellerId: admin.id,
      },
      {
        name: 'Data Analyzer',
        description: 'Automated data processing and insights generation',
        price: 49.99,
        category: 'Analytics',
        capabilities: { formats: ['csv', 'json', 'xml'], features: ['visualization', 'reporting'] },
        instructions: 'Use this agent to automatically process and analyze your data streams.',
        rating: 4.6,
        installs: 890,
        revenue: 44495.1,
        isApproved: true,
        sellerId: admin.id,
      },
      {
        name: 'Security Monitor',
        description: 'Real-time security threat detection and response',
        price: 99.99,
        category: 'Security',
        capabilities: { protocols: ['https', 'ssh', 'ftp'], features: ['threat_detection', 'auto_response'] },
        instructions: 'Deploy for continuous security monitoring and automated threat response.',
        rating: 4.9,
        installs: 456,
        revenue: 45599.44,
        isApproved: true,
        sellerId: admin.id,
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
