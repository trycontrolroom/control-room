import NextAuth from "next-auth"
import { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: UserRole
      workspaceId?: string
      workspaceRole?: UserRole
    }
  }

  interface User {
    role?: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole
    workspaceId?: string
    workspaceRole?: UserRole
  }
}