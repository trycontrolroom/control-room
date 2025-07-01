import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Shield, BarChart3, Zap, Users, Globe, Lock } from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen command-center-bg">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Take Command of Your AI Agents
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Deploy, monitor, and govern AI agents with military-grade precision. 
            Real-time analytics, automated policies, and marketplace integration.
          </p>
          
          {/* Demo Preview */}
          <div className="glass-panel rounded-lg p-8 mb-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="agent-card rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Agent Alpha</h3>
                  <span className="status-active text-sm">ACTIVE</span>
                </div>
                <div className="text-sm text-gray-400">
                  <div>Uptime: 99.5%</div>
                  <div>Errors: 2</div>
                </div>
              </div>
              <div className="agent-card rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Agent Bravo</h3>
                  <span className="status-paused text-sm">PAUSED</span>
                </div>
                <div className="text-sm text-gray-400">
                  <div>Uptime: 87.3%</div>
                  <div>Errors: 15</div>
                </div>
              </div>
              <div className="agent-card rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Agent Charlie</h3>
                  <span className="status-active text-sm">ACTIVE</span>
                </div>
                <div className="text-sm text-gray-400">
                  <div>Uptime: 98.1%</div>
                  <div>Errors: 0</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Step Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Agents</h3>
              <p className="text-gray-400">Deploy and register your AI agents with our secure monitoring system</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Set Policies</h3>
              <p className="text-gray-400">Create automated rules and triggers to govern agent behavior</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-600/20 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Monitor & Optimize</h3>
              <p className="text-gray-400">Track performance metrics and optimize agent operations in real-time</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" className="command-button text-lg px-8 py-3">
                View Pricing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-blue-500/50 hover:bg-blue-500/10">
                Launch Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Military-Grade AI Agent Control
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-panel border-blue-500/20">
              <CardHeader>
                <BarChart3 className="w-10 h-10 text-blue-400 mb-2" />
                <CardTitle>Real-Time Monitoring</CardTitle>
                <CardDescription>
                  Track agent performance, uptime, and errors with 5-second updates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-purple-500/20">
              <CardHeader>
                <Shield className="w-10 h-10 text-purple-400 mb-2" />
                <CardTitle>Policy Automation</CardTitle>
                <CardDescription>
                  Create visual policies with drag-and-drop triggers and actions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-green-500/20">
              <CardHeader>
                <Globe className="w-10 h-10 text-green-400 mb-2" />
                <CardTitle>Agent Marketplace</CardTitle>
                <CardDescription>
                  Buy and sell AI agents with integrated Stripe payments
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-yellow-500/20">
              <CardHeader>
                <Users className="w-10 h-10 text-yellow-400 mb-2" />
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription>
                  Admin, Manager, Viewer, and Seller roles with granular permissions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-red-500/20">
              <CardHeader>
                <Zap className="w-10 h-10 text-red-400 mb-2" />
                <CardTitle>Spending Controls</CardTitle>
                <CardDescription>
                  Set monthly caps and auto-pause agents when limits are reached
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-indigo-500/20">
              <CardHeader>
                <Lock className="w-10 h-10 text-indigo-400 mb-2" />
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  OAuth integration, encrypted data, and audit trails
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
