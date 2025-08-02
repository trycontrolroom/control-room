import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Shield, BarChart3, Zap, Users, Globe, Lock, Bot, Eye, FileText, Play, DollarSign, BookOpen, Rocket, Video, RefreshCw, CheckCircle, TrendingUp, Target, Check } from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-gray-100">
      <Navigation />
      
      {/* 1. Hero Section */}
      <section className="relative px-6 pt-32 pb-20 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Build, Control, and Monitor Your AI Agents
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
            Describe the agent you need — our AI builds it. Then set guardrails, control actions, and track results — all from your Control Room.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" className="command-button text-lg px-8 py-4">
                Start Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-blue-500/50 hover:bg-blue-500/10">
                <Play className="mr-2 w-5 h-5" />
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. How It Works (3 Steps) */}
      <section className="px-6 py-20 bg-gradient-to-b from-transparent to-purple-950/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              How It Works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Deploy</h3>
              <p className="text-gray-300 text-lg">
                Create new agents with Create AI or import your own.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Set Up</h3>
              <p className="text-gray-300 text-lg">
                Add guardrails (policies) and metrics.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30">
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Manage</h3>
              <p className="text-gray-300 text-lg">
                Schedule tasks, track stats, and refine easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What You Can Do (Feature Tiles) */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              What You Can Do
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-panel border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
              <CardHeader>
                <Bot className="w-12 h-12 text-blue-400 mb-4" />
                <CardTitle className="text-xl">Create AI</CardTitle>
                <CardDescription className="text-gray-300">
                  Describe it. Get code.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
              <CardHeader>
                <Users className="w-12 h-12 text-purple-400 mb-4" />
                <CardTitle className="text-xl">Helper AI</CardTitle>
                <CardDescription className="text-gray-300">
                  Explain or take action—your call.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-green-500/20 hover:border-green-400/40 transition-all duration-300">
              <CardHeader>
                <Shield className="w-12 h-12 text-green-400 mb-4" />
                <CardTitle className="text-xl">Policies & Guardrails</CardTitle>
                <CardDescription className="text-gray-300">
                  Keep agents safe and on-budget.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
              <CardHeader>
                <Target className="w-12 h-12 text-cyan-400 mb-4" />
                <CardTitle className="text-xl">Manage Tasks</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage agent tasks with full control…
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-yellow-400 mb-4" />
                <CardTitle className="text-xl">Custom Metrics & Monitoring</CardTitle>
                <CardDescription className="text-gray-300">
                  Track what matters.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-orange-500/20 hover:border-orange-400/40 transition-all duration-300">
              <CardHeader>
                <Globe className="w-12 h-12 text-orange-400 mb-4" />
                <CardTitle className="text-xl">Marketplace</CardTitle>
                <CardDescription className="text-gray-300">
                  Start faster with proven agents.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>


      {/* 4. Demo Video */}
      <section id="demo" className="px-6 py-20 bg-gradient-to-b from-transparent to-blue-950/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            See it in action
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            A quick demo video on the main features of Control Room: creating agents, setting policies/metrics, and managing tasks.
          </p>
          
          {/* Video Placeholder */}
          <div className="glass-panel rounded-xl p-8 aspect-video flex items-center justify-center border-purple-500/20">
            <div className="text-center">
              <Play className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-300">Demo video will be added here</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Deep Features */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Deep Features
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-panel border-blue-500/20 text-center hover:border-blue-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <Lock className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">RBAC & Workspaces</h3>
                <p className="text-gray-300">Enterprise-grade role-based access control with multi-tenant workspace isolation.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-green-500/20 text-center hover:border-green-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <BarChart3 className="w-16 h-16 text-green-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Real-time Metrics & Alerts</h3>
                <p className="text-gray-300">5-second refresh rates with intelligent alerting and anomaly detection.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-purple-500/20 text-center hover:border-purple-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <Shield className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Policy Builder (Guardrails)</h3>
                <p className="text-gray-300">Visual policy creation with automated enforcement and compliance tracking.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-cyan-500/20 text-center hover:border-cyan-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <Bot className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Create AI & Code Editor</h3>
                <p className="text-gray-300">Natural language agent creation with integrated development environment.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-yellow-500/20 text-center hover:border-yellow-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <FileText className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Audit Logs & Spend Controls</h3>
                <p className="text-gray-300">Complete audit trails with automated spend monitoring and budget controls.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-orange-500/20 text-center hover:border-orange-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <Globe className="w-16 h-16 text-orange-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Integrations (Coming Soon)</h3>
                <p className="text-gray-300">Connect with your existing tools and workflows through our API ecosystem.</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg text-gray-300 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
              <Shield className="w-6 h-6 text-blue-400 inline mr-2" />
              All features respect workspace boundaries and role permissions by design.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Marketplace Spotlight */}
      <section className="px-6 py-20 bg-gradient-to-b from-transparent to-purple-950/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Explore the Agent Marketplace
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Browse verified AI agents built by experts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-panel border-blue-500/20 text-center hover:border-blue-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <DollarSign className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Pricing Options</h3>
                <p className="text-gray-300">Flexible pricing models for every budget and use case.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-green-500/20 text-center hover:border-green-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <TrendingUp className="w-16 h-16 text-green-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Earn as a Creator</h3>
                <p className="text-gray-300">Build and sell your agents to earn recurring revenue.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-purple-500/20 text-center hover:border-purple-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <CheckCircle className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Approval & Quality</h3>
                <p className="text-gray-300">All agents are reviewed and verified for quality and security.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. Pricing */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Simple, Scalable Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="glass-panel border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Beginner
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">$39</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <CardDescription className="text-gray-300">
                  Perfect for small teams getting started
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-blue-500/50 neon-glow relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Unlimited
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">$149</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <CardDescription className="text-gray-300">
                  For growing teams and businesses
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-panel border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Enterprise
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">Contact</span>
                </div>
                <CardDescription className="text-gray-300">
                  Custom solutions for large organizations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <div className="text-center">
            <Link href="/pricing">
              <Button size="lg" className="command-button text-lg px-8 py-4">
                Start Building
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. AI Assistants Explained */}
      <section className="px-6 py-20 bg-gradient-to-b from-transparent to-blue-950/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Meet Your AI Assistants
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Two powerful assistants with distinct roles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-panel border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <Bot className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">Create AI</h3>
                <p className="text-gray-300 text-center mb-4">Smart agent generation</p>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Natural language prompts
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Multi-file code generation
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Integrated code editor
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <Users className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">Helper AI</h3>
                <p className="text-gray-300 text-center mb-4">Walkthroughs, explain/action mode, respects security</p>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Explain and Action modes
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Platform guidance
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-400 mr-2" />
                    Security-aware assistance
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 9. Affiliate Program */}
      <section className="px-6 py-20 bg-gradient-to-r from-yellow-900/20 to-orange-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-panel rounded-xl p-8 border-yellow-500/30">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Earn 50% Lifetime Commission
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Share Control Room. Get paid monthly.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center text-left">
                <DollarSign className="w-6 h-6 text-yellow-400 mr-3" />
                <span className="text-gray-300">50% lifetime commissions</span>
              </div>
              <div className="flex items-center text-left">
                <FileText className="w-6 h-6 text-blue-400 mr-3" />
                <span className="text-gray-300">Monthly payouts via Stripe</span>
              </div>
              <div className="flex items-center text-left">
                <TrendingUp className="w-6 h-6 text-green-400 mr-3" />
                <span className="text-gray-300">Track referrals</span>
              </div>
              <div className="flex items-center text-left">
                <Lock className="w-6 h-6 text-purple-400 mr-3" />
                <span className="text-gray-300">Transparent terms</span>
              </div>
            </div>
            
            <Link href="/affiliate/signup">
              <Button size="lg" className="command-button text-lg px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400">
                Join Affiliate Program
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Intel Knowledge Center */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Learn, Build, and Scale Smarter
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Access all guides, docs, and community resources.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <Card className="glass-panel border-orange-500/20 text-center hover:border-orange-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <BookOpen className="w-16 h-16 text-orange-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Quick-start Guides</h3>
                <p className="text-gray-300">Step-by-step tutorials to get you started quickly.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-red-500/20 text-center hover:border-red-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <Video className="w-16 h-16 text-red-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Video Walkthroughs</h3>
                <p className="text-gray-300">Visual guides for complex features and workflows.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-purple-500/20 text-center hover:border-purple-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <FileText className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Documentation</h3>
                <p className="text-gray-300">Comprehensive technical documentation and API references.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-green-500/20 text-center hover:border-green-400/40 transition-all duration-300">
              <CardContent className="pt-8 pb-8">
                <Users className="w-16 h-16 text-green-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-white mb-3">Community & Support</h3>
                <p className="text-gray-300">Connect with other users and get expert support.</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Card className="glass-panel border-blue-500/20 inline-block">
              <CardContent className="pt-6 pb-6 px-8">
                <div className="flex items-center">
                  <RefreshCw className="w-6 h-6 text-blue-400 mr-3" />
                  <span className="text-gray-300">Platform Updates</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
