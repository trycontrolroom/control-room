import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import type { DefaultSession, DefaultUser, NextAuthOptions } from 'next-auth'

// ====== Type Augmentation for Custom JWT & Session Fields ======
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      workspaceId?: string
      workspaceRole?: string
    } & DefaultSession['user']
  }
  interface User extends DefaultUser {
    role?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub?: string
    role?: string
    workspaceId?: string
    workspaceRole?: string
  }
}

// Helper to pick the user’s default workspace data
async function getUserWorkspaceData(userId: string) {
  const membership = await prisma.workspaceMember.findFirst({
    where: { userId },
    orderBy: { joinedAt: 'asc' }
  })
  if (!membership) {
    return { workspaceId: undefined, workspaceRole: undefined }
  }
  return {
    workspaceId: membership.workspaceId,
    workspaceRole: membership.role,
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        if (!user || !user.password) return null
        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null
        return {
          id: user.id,
          name: user.name!,
          email: user.email,
          role: user.role
        }
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    // runs on sign-in and on session.update()
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id
        token.role = user.role
        const wsData = await getUserWorkspaceData(user.id)
        token.workspaceId = wsData.workspaceId
        token.workspaceRole = wsData.workspaceRole
      }
      if (trigger === 'update' && session?.workspaceId) {
        token.workspaceId = session.workspaceId as string | undefined
        token.workspaceRole = session.workspaceRole as string | undefined
      }
      return token
    },
    // expose those values to the client
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub ?? ''
        session.user.role = token.role ?? ''
        session.user.workspaceId = token.workspaceId
        session.user.workspaceRole = token.workspaceRole
      }
      return session
    },
    // ensure custom redirects always stay on your domain
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url
      if (url.startsWith('/') && !url.startsWith('//')) return baseUrl + url
      return baseUrl + '/dashboard'
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  debug: process.env.NODE_ENV === 'development'
}