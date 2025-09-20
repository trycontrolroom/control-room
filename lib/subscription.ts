import { prisma } from '@/lib/prisma'
import { SubscriptionPlan } from '@prisma/client'

export interface PlanLimits {
  agents: number | null // null = unlimited
  policies: number | null
  metrics: number | null
  aiHelperDaily: number | null
  features: {
    codeEditor: boolean
    realTimeMetrics: boolean
    affiliateDashboard: boolean
    auditLogs: boolean
  }
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  TRIAL: {
    agents: 1,
    policies: 1,
    metrics: 2,
    aiHelperDaily: 3,
    features: {
      codeEditor: true,
      realTimeMetrics: true,
      affiliateDashboard: false,
      auditLogs: false
    }
  },
  BEGINNER: {
    agents: 3,
    policies: 2,
    metrics: 5,
    aiHelperDaily: 5,
    features: {
      codeEditor: true,
      realTimeMetrics: true,
      affiliateDashboard: true,
      auditLogs: false
    }
  },
  UNLIMITED: {
    agents: null,
    policies: null,
    metrics: null,
    aiHelperDaily: null,
    features: {
      codeEditor: true,
      realTimeMetrics: true,
      affiliateDashboard: true,
      auditLogs: true
    }
  },
  ENTERPRISE: {
    agents: null,
    policies: null,
    metrics: null,
    aiHelperDaily: null,
    features: {
      codeEditor: true,
      realTimeMetrics: true,
      affiliateDashboard: true,
      auditLogs: true
    }
  }
}

export async function checkSubscriptionLimit(
  userId: string,
  type: 'agents' | 'policies' | 'metrics' | 'aiHelper'
): Promise<{ allowed: boolean; limit?: number; current?: number; plan?: SubscriptionPlan }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionUsage: true }
    })

    if (!user) {
      return { allowed: false }
    }

    if (user.subscriptionPlan === 'TRIAL' && user.trialEndsAt && user.trialEndsAt < new Date()) {
      return { allowed: false, plan: user.subscriptionPlan }
    }

    const limits = PLAN_LIMITS[user.subscriptionPlan]
    const usage = user.subscriptionUsage

    if (!usage) {
      await prisma.subscriptionUsage.create({
        data: {
          userId: userId,
          agentsCount: 0,
          policiesCount: 0,
          metricsCount: 0,
          helperExecutionsToday: 0
        }
      })
      const limit = type === 'aiHelper' ? limits.aiHelperDaily : limits[type as keyof Omit<PlanLimits, 'features' | 'aiHelperDaily'>]
      return { allowed: true, limit: limit || undefined, current: 0, plan: user.subscriptionPlan }
    }

    const today = new Date()
    const lastReset = new Date(usage.lastResetDate)
    if (today.toDateString() !== lastReset.toDateString()) {
      await prisma.subscriptionUsage.update({
        where: { userId },
        data: {
          helperExecutionsToday: 0,
          lastResetDate: today
        }
      })
      usage.helperExecutionsToday = 0
    }

    let current: number
    let limit: number | null

    switch (type) {
      case 'agents':
        current = usage.agentsCount
        limit = limits.agents
        break
      case 'policies':
        current = usage.policiesCount
        limit = limits.policies
        break
      case 'metrics':
        current = usage.metricsCount
        limit = limits.metrics
        break
      case 'aiHelper':
        current = usage.helperExecutionsToday
        limit = limits.aiHelperDaily
        break
      default:
        return { allowed: false }
    }

    const allowed = limit === null || current < limit

    return {
      allowed,
      limit: limit || undefined,
      current,
      plan: user.subscriptionPlan
    }

  } catch (error) {
    console.error('Subscription limit check error:', error)
    return { allowed: false }
  }
}

export async function incrementUsage(
  userId: string,
  type: 'agents' | 'policies' | 'metrics' | 'aiHelper'
): Promise<void> {
  try {
    const updateData: any = {}

    switch (type) {
      case 'agents':
        updateData.agentsCount = { increment: 1 }
        break
      case 'policies':
        updateData.policiesCount = { increment: 1 }
        break
      case 'metrics':
        updateData.metricsCount = { increment: 1 }
        break
      case 'aiHelper':
        updateData.helperExecutionsToday = { increment: 1 }
        break
    }

    await prisma.subscriptionUsage.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        agentsCount: type === 'agents' ? 1 : 0,
        policiesCount: type === 'policies' ? 1 : 0,
        metricsCount: type === 'metrics' ? 1 : 0,
        helperExecutionsToday: type === 'aiHelper' ? 1 : 0
      }
    })

  } catch (error) {
    console.error('Usage increment error:', error)
  }
}

export async function decrementUsage(
  userId: string,
  type: 'agents' | 'policies' | 'metrics'
): Promise<void> {
  try {
    const updateData: any = {}

    switch (type) {
      case 'agents':
        updateData.agentsCount = { decrement: 1 }
        break
      case 'policies':
        updateData.policiesCount = { decrement: 1 }
        break
      case 'metrics':
        updateData.metricsCount = { decrement: 1 }
        break
    }

    await prisma.subscriptionUsage.update({
      where: { userId },
      data: updateData
    })

  } catch (error) {
    console.error('Usage decrement error:', error)
  }
}

export function hasFeatureAccess(plan: SubscriptionPlan, feature: keyof PlanLimits['features']): boolean {
  return PLAN_LIMITS[plan].features[feature]
}
