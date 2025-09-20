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

  const managerPassword = await bcrypt.hash('manager123', 12)
  const manager = await prisma.user.upsert({
    where: { email: 'manager@control-room.ai' },
    update: {},
    create: {
      email: 'manager@control-room.ai',
      name: 'Manager User',
      password: managerPassword,
      role: UserRole.MANAGER,
    },
  })

  const aegisWorkspace = await prisma.workspace.upsert({
    where: { id: 'aegis-hq-workspace' },
    update: {},
    create: {
      id: 'aegis-hq-workspace',
      name: 'Aegis HQ',
      members: {
        create: {
          userId: admin.id,
          role: 'ADMIN'
        }
      }
    },
  })

  const betaWorkspace = await prisma.workspace.upsert({
    where: { id: 'beta-ops-workspace' },
    update: {},
    create: {
      id: 'beta-ops-workspace',
      name: 'Beta Ops',
      members: {
        create: [
          {
            userId: admin.id,
            role: 'VIEWER'
          },
          {
            userId: manager.id,
            role: 'MANAGER'
          }
        ]
      }
    },
  })

  console.log('Database seeded successfully!')
  console.log(`Created workspaces:`)
  console.log(`- Aegis HQ (${aegisWorkspace.id}) with admin@control-room.ai as ADMIN`)
  console.log(`- Beta Ops (${betaWorkspace.id}) with admin@control-room.ai as VIEWER and manager@control-room.ai as MANAGER`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
