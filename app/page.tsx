import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Shield, BarChart3, Zap, Users, Globe, Lock, Bot, Eye, FileText, Play, DollarSign, BookOpen, Rocket } from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen command-center-bg">
      <Navigation />
      
      {/* 1. Hero Section */}
      <section className="relative px-6 pt-32 pb-20 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Your AI Agent Control Room <span className="text-lg bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full ml-3">BETA</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
            Control, monitor, and secure every move your AI agents make<br />
            from one central dashboard.
          </p>
          
          {/* Agent Cards Preview */}
          <div className="glass-panel rounded-xl p-8 mb-12 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="agent-card rounded-lg p-6 pulse-glow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-white">Agent Alpha</h4>
                  <span className="status-active text-sm px-3 py-1 rounded-full">ACTIVE</span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Uptime: 99.5%</div>
                  <div>Errors: 2</div>
                </div>
              </div>
              
              <div className="agent-card rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-white">Agent Bravo</h4>
                  <span className="status-paused text-sm px-3 py-1 rounded-full">PAUSED</span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Uptime: 87.3%</div>
                  <div>Errors: 15</div>
                </div>
              </div>
              
              <div className="agent-card rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-white">Agent Charlie</h4>
                  <span className="status-active text-sm px-3 py-1 rounded-full">ACTIVE</span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Uptime: 98.1%</div>
                  <div>Errors: 0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Promise */}
      <section className="px-6 py-16 bg-gradient-to-b from-transparent to-purple-950/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            One prompt does it all.
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-16">
            From creation to governance to monitoring - manage your entire AI agent lifecycle with natural language commands. 
            No complex configurations, no technical barriers, just intelligent automation.
          </p>
          
          {/* Three-step process moved here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Create/Connect</h3>
              <p className="text-gray-300 text-lg">
                Deploy existing agents or use our AI-powered builder to create new ones with natural language prompts
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Set Policies</h3>
              <p className="text-gray-300 text-lg">
                Create automated rules and triggers to govern agent behavior and ensure compliance
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30">
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Monitor & Optimize</h3>
              <p className="text-gray-300 text-lg">
                Track performance metrics, analyze trends, and optimize agent operations in real-time
              </p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-16">
            <Link href="/pricing">
              <Button size="lg" className="command-button text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#showcase">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-blue-500/50 hover:bg-blue-500/10">
                <Play className="mr-2 w-5 h-5" />
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Feature Grid */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Enterprise-Grade AI Agent Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-panel border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
              <CardHeader>
                <Shield className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-xl">Policy Enforcement</CardTitle>
                <CardDescription className="text-gray-300">
                  Visual drag-and-drop policy builder with real-time enforcement and automated governance rules
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-green-500/20 hover:border-green-400/40 transition-all duration-300">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-green-400 mb-4" />
                <CardTitle className="text-xl">Custom Metrics</CardTitle>
                <CardDescription className="text-gray-300">
                  Define, track, and visualize custom KPIs with AI-powered metric creation and real-time dashboards
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
              <CardHeader>
                <Users className="w-12 h-12 text-blue-400 mb-4" />
                <CardTitle className="text-xl">Agent Manager</CardTitle>
                <CardDescription className="text-gray-300">
                  Complete lifecycle management from creation to deployment with integrated code editor and task automation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
              <CardHeader>
                <Eye className="w-12 h-12 text-cyan-400 mb-4" />
                <CardTitle className="text-xl">Live Monitoring</CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time performance tracking with 5-second updates, uptime monitoring, and intelligent alerting
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300">
              <CardHeader>
                <Bot className="w-12 h-12 text-yellow-400 mb-4" />
                <CardTitle className="text-xl">AI Helper</CardTitle>
                <CardDescription className="text-gray-300">
                  Natural language assistant for creating policies, metrics, and tasks with intelligent automation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-orange-500/20 hover:border-orange-400/40 transition-all duration-300">
              <CardHeader>
                <FileText className="w-12 h-12 text-orange-400 mb-4" />
                <CardTitle className="text-xl">Intel Docs</CardTitle>
                <CardDescription className="text-gray-300">
                  Comprehensive knowledge center with tutorials, best practices, and strategic insights for AI operations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-orange-500/20 hover:border-orange-400/40 transition-all duration-300">
              <CardHeader>
                <FileText className="w-12 h-12 text-orange-400 mb-4" />
                <CardTitle className="text-xl">Intel Docs</CardTitle>
                <CardDescription className="text-gray-300">
                  Comprehensive knowledge center with tutorials, best practices, and strategic insights for AI operations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>


      {/* 5. Showcase - Animated Walkthrough */}
      <section id="showcase" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              See Control Room <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full ml-2">BETA</span> in Action
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Watch how enterprise teams deploy, govern, and scale AI agents with unprecedented control and visibility.
            </p>
          </div>
          
          {/* Demo Preview - Enhanced */}
          <div className="glass-panel rounded-xl p-8 mb-12 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Agent Dashboard */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Live Agent Dashboard</h3>
                <div className="space-y-3">
                  <div className="agent-card rounded-lg p-4 pulse-glow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Customer Support Agent</h4>
                      <span className="status-active text-sm">ACTIVE</span>
                    </div>
                    <div className="text-sm text-gray-400 grid grid-cols-2 gap-2">
                      <div>Uptime: 99.8%</div>
                      <div>Requests: 1,247</div>
                      <div>Avg Response: 1.2s</div>
                      <div>Cost: $12.40</div>
                    </div>
                  </div>
                  
                  <div className="agent-card rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Data Analysis Agent</h4>
                      <span className="status-active text-sm">ACTIVE</span>
                    </div>
                    <div className="text-sm text-gray-400 grid grid-cols-2 gap-2">
                      <div>Uptime: 97.5%</div>
                      <div>Jobs: 89</div>
                      <div>Avg Time: 45s</div>
                      <div>Cost: $8.90</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right: Policy & Metrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Smart Governance</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                    <div className="text-sm text-purple-300 font-medium">Policy: Cost Control</div>
                    <div className="text-xs text-gray-400 mt-1">Auto-pause if daily spend &gt; $50</div>
                  </div>
                  
                  <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                    <div className="text-sm text-green-300 font-medium">Metric: Success Rate</div>
                    <div className="text-xs text-gray-400 mt-1">98.7% (Target: 95%)</div>
                  </div>
                  
                  <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <div className="text-sm text-blue-300 font-medium">Alert: Performance</div>
                    <div className="text-xs text-gray-400 mt-1">Response time trending up</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live data updating every 5 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Affiliate Banner */}
      <section className="px-6 py-16 bg-gradient-to-r from-yellow-900/20 to-orange-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-panel rounded-xl p-8 border-yellow-500/30">
            <DollarSign className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Earn 50% Lifetime Commission
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join our affiliate program and earn recurring revenue for every customer you refer. 
              Industry-leading commission rates with full marketing support.
            </p>
            <Link href="/affiliate/signup">
              <Button size="lg" className="command-button text-lg px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400">
                Join Affiliate Program
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Intel Knowledge Center */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Intel Knowledge Center
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Master your AI agent operations with comprehensive tutorials, documentation, strategic insights, 
              and peer support from our growing community of AI practitioners.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <Card className="glass-panel border-orange-500/20 text-center hover:border-orange-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <BookOpen className="w-16 h-16 text-orange-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Comprehensive Tutorials</h3>
                <p className="text-gray-300">Step-by-step guides for every feature, from basic setup to advanced automation strategies</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-red-500/20 text-center hover:border-red-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <Shield className="w-16 h-16 text-red-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Security Best Practices</h3>
                <p className="text-gray-300">Industry-proven strategies for AI agent governance, compliance, and risk management</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-purple-500/20 text-center hover:border-purple-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <Users className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Expert Community</h3>
                <p className="text-gray-300">Connect with AI practitioners, share insights, and get support from our growing community</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-green-500/20 text-center hover:border-green-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <BarChart3 className="w-16 h-16 text-green-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Strategic Analytics</h3>
                <p className="text-gray-300">Deep insights into AI agent performance, cost optimization, and scaling strategies</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/intel">
              <Button size="lg" className="command-button text-lg px-8 py-4">
                Explore Knowledge Center
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="px-6 py-20 bg-gradient-to-b from-transparent to-blue-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-panel rounded-xl p-12 border-blue-500/30">
            <Rocket className="w-20 h-20 text-blue-400 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
              The future of agent management starts now.
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Join thousands of organizations already using Control Room to deploy, govern, and scale AI agents with confidence. 
              Start your free trial today and experience the next generation of AI operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" className="command-button text-xl px-10 py-5">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-xl px-10 py-5 border-blue-500/50 hover:bg-blue-500/10">
                  Launch Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-gray-400">
              No credit card required • 14-day free trial • Cancel anytime
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
