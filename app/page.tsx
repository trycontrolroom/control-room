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
            Your AI Agent Control Room
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Control, monitor, and secure every move your AI agents make from one central dashboard.
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

      {/* Security & Protection Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-transparent to-blue-950/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Security & Protection
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Control Room delivers enterprise-grade encryption, comprehensive audit trails, OAuth support, 
              and role-based access controls to keep your AI agents secure and compliant.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="glass-panel border-cyan-500/20 text-center">
              <CardContent className="pt-6">
                <Lock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">End-to-End Encryption</h3>
                <p className="text-gray-400 text-sm">Military-grade AES-256 encryption for all data in transit and at rest</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-cyan-500/20 text-center">
              <CardContent className="pt-6">
                <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Audit Trails</h3>
                <p className="text-gray-400 text-sm">Complete activity logging with immutable audit trails for compliance</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-cyan-500/20 text-center">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">OAuth Integration</h3>
                <p className="text-gray-400 text-sm">Seamless integration with Google, Microsoft, and enterprise SSO providers</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-cyan-500/20 text-center">
              <CardContent className="pt-6">
                <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Role-Based Access</h3>
                <p className="text-gray-400 text-sm">Granular permissions with Admin, Manager, Viewer, and Seller roles</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Link href="/intel">
              <Button size="lg" className="command-button text-lg px-8 py-3">
                Learn More About Security
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Policy Builder Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Visual Policy Builder
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Create sophisticated automation rules with our intuitive drag-and-drop policy builder. 
                Set behavior rules, triggers, and actions for your AI agents without writing code.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Drag-and-drop interface for complex logic</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Real-time policy validation and testing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Pre-built templates for common scenarios</span>
                </div>
              </div>
            </div>
            
            <div className="glass-panel rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                  <span className="text-purple-300 font-medium">IF Agent Error Rate &gt; 10%</span>
                  <ArrowRight className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <span className="text-yellow-300 font-medium">THEN Pause Agent</span>
                  <ArrowRight className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <span className="text-blue-300 font-medium">AND Send Alert to Team</span>
                  <ArrowRight className="w-4 h-4 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Metrics Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-transparent to-green-950/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="glass-panel rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Token Usage</span>
                  <span className="text-green-400 font-mono">1.2M</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Error Rate</span>
                  <span className="text-red-400 font-mono">0.3%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Uptime</span>
                  <span className="text-blue-400 font-mono">99.8%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Response Time</span>
                  <span className="text-yellow-400 font-mono">245ms</span>
                </div>
                <div className="h-24 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg flex items-end justify-around p-2">
                  <div className="w-4 bg-green-400 rounded-t" style={{height: '60%'}}></div>
                  <div className="w-4 bg-green-400 rounded-t" style={{height: '80%'}}></div>
                  <div className="w-4 bg-green-400 rounded-t" style={{height: '70%'}}></div>
                  <div className="w-4 bg-green-400 rounded-t" style={{height: '90%'}}></div>
                  <div className="w-4 bg-green-400 rounded-t" style={{height: '85%'}}></div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Custom Metrics
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Define, monitor, and visualize metrics specific to your use case. Track token usage, 
                errors, uptime, response times, and any custom KPIs that matter to your business.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Custom metric definitions with formulas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Real-time visualization and alerts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Historical data analysis and trends</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intel Knowledge Center Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Intel Knowledge Center
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto">
            Master your AI agent operations with comprehensive tutorials, documentation, strategic insights, 
            and peer support from our growing community of AI practitioners.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="glass-panel border-orange-500/20 text-center">
              <CardContent className="pt-6">
                <Globe className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Tutorials</h3>
                <p className="text-gray-400 text-sm">Step-by-step guides for every feature and use case</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-orange-500/20 text-center">
              <CardContent className="pt-6">
                <BarChart3 className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Documentation</h3>
                <p className="text-gray-400 text-sm">Complete API reference and integration guides</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-orange-500/20 text-center">
              <CardContent className="pt-6">
                <Zap className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Updates</h3>
                <p className="text-gray-400 text-sm">Latest platform updates and feature announcements</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-orange-500/20 text-center">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="font-semibold text-white mb-2">Community</h3>
                <p className="text-gray-400 text-sm">Connect with experts and share best practices</p>
              </CardContent>
            </Card>
          </div>
          
          <Link href="/intel">
            <Button size="lg" className="command-button text-lg px-8 py-3">
              Explore Intel Center
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
