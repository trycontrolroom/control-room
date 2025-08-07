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
      
      {/* Combined Hero + How It Works Section */}
<section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20" 
  style={{
    background: `
      radial-gradient(ellipse at center, 
        rgba(15, 23, 42, 1) 0%, 
        rgba(2, 6, 23, 1) 60%,
        rgba(0, 0, 0, 1) 100%
      )
    `
  }}
>
  
  {/* Floating background elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-128 h-128 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
    <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-indigo-500/8 rounded-full blur-3xl animate-pulse delay-500" />
    <div className="absolute bottom-1/2 left-1/3 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-2000" />
  </div>

  {/* Main Hero Container */}
  <div className="relative z-10 w-full max-w-6xl mx-auto mb-12">
    
    {/* Premium Glass Container - Fixed brightness and glow */}
    <div 
      className="relative backdrop-blur-xl rounded-3xl px-16 py-16 mx-auto overflow-hidden"
      style={{
        maxWidth: '65rem',
        background: `
          linear-gradient(135deg, 
            rgba(15, 23, 42, 0.6) 0%, 
            rgba(30, 41, 59, 0.5) 25%,
            rgba(51, 65, 85, 0.4) 50%,
            rgba(30, 41, 59, 0.5) 75%,
            rgba(15, 23, 42, 0.6) 100%
          )
        `,
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: `
          0 0 0 1px rgba(59, 130, 246, 0.15),
          0 0 15px rgba(59, 130, 246, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.03)
        `
      }}
    >
      {/* Very subtle border-focused glare effects */}
      <div className="absolute inset-0 rounded-3xl" style={{
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.03) 0%, 
            transparent 25%,
            transparent 75%,
            rgba(255, 255, 255, 0.02) 100%
          )
        `
      }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      {/* Main Headline */}
      <h1 
        className="text-5xl md:text-6xl lg:text-7xl font-thin text-white mb-8 tracking-wide text-center leading-tight" 
        style={{ 
          fontFamily: 'system-ui, -apple-system, sans-serif', 
          letterSpacing: '0.02em'
        }}
      >
        Control Room
      </h1>

      {/* Subheading */}
      <p 
        className="text-lg md:text-xl lg:text-xl text-slate-300 mb-10 font-light max-w-2xl mx-auto text-center leading-relaxed" 
        style={{ 
          fontFamily: 'system-ui, -apple-system, sans-serif', 
          letterSpacing: '0.01em' 
        }}
      >
        Create, manage, and monitor AI agents with plain English
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-5 justify-center">
        <Link href="/pricing">
          <button 
            className="group px-8 py-4 text-base text-white rounded-xl transition-all duration-300 backdrop-blur-sm font-medium hover:scale-[1.02] hover:-translate-y-0.5"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(59, 130, 246, 0.9) 0%, 
                  rgba(30, 64, 175, 0.8) 100%
                )
              `,
              border: '1px solid rgba(59, 130, 246, 0.7)',
              boxShadow: `
                0 6px 20px rgba(59, 130, 246, 0.5),
                0 3px 10px rgba(59, 130, 246, 0.4),
                0 0 0 1px rgba(59, 130, 246, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </Link>
        
        <Link href="#demo">
          <button 
            className="group px-8 py-4 text-base text-slate-300 hover:text-white rounded-xl transition-all duration-300 backdrop-blur-sm font-medium hover:scale-[1.02] hover:-translate-y-0.5"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(30, 41, 59, 0.8) 0%, 
                  rgba(51, 65, 85, 0.7) 100%
                )
              `,
              border: '1px solid rgba(59, 130, 246, 0.4)',
              boxShadow: `
                0 4px 16px rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(59, 130, 246, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.08)
              `,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              <span>Watch Demo</span>
            </div>
          </button>
        </Link>
      </div>
    </div>
  </div>

  {/* Three Feature Cards */}
  <div className="relative z-10 w-full mx-auto" style={{ maxWidth: '65rem' }}>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Deploy Card - Fixed to match others */}
      <div 
        className="relative backdrop-blur-xl rounded-2xl p-8 group hover:scale-[1.02] transition-all duration-300"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(15, 23, 42, 0.6) 0%, 
              rgba(30, 41, 59, 0.5) 50%,
              rgba(15, 23, 42, 0.6) 100%
            )
          `,
          border: '1px solid rgba(59, 130, 246, 0.25)',
          boxShadow: `
            0 0 0 1px rgba(59, 130, 246, 0.12),
            0 0 12px rgba(59, 130, 246, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.03)
          `
        }}
      >
        {/* Very subtle border-focused glare */}
        <div className="absolute inset-0 rounded-2xl" style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.02) 0%, 
              transparent 25%,
              transparent 75%,
              rgba(255, 255, 255, 0.01) 100%
            )
          `
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div 
            className="w-14 h-14 mb-5 rounded-xl flex items-center justify-center"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(59, 130, 246, 0.2) 0%, 
                  rgba(30, 64, 175, 0.15) 100%
                )
              `,
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
            }}
          >
            <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-3 text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Deploy</h3>
          <p className="text-slate-300 leading-relaxed text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Quickly launch agents with Create AI or import existing ones.
          </p>
        </div>
      </div>

      {/* Configure Card */}
      <div 
        className="relative backdrop-blur-xl rounded-2xl p-8 group hover:scale-[1.02] transition-all duration-300"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(15, 23, 42, 0.6) 0%, 
              rgba(30, 41, 59, 0.5) 50%,
              rgba(15, 23, 42, 0.6) 100%
            )
          `,
          border: '1px solid rgba(59, 130, 246, 0.25)',
          boxShadow: `
            0 0 0 1px rgba(59, 130, 246, 0.12),
            0 0 12px rgba(59, 130, 246, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.03)
          `
        }}
      >
        <div className="absolute inset-0 rounded-2xl" style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.02) 0%, 
              transparent 25%,
              transparent 75%,
              rgba(255, 255, 255, 0.01) 100%
            )
          `
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div 
            className="w-14 h-14 mb-5 rounded-xl flex items-center justify-center"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(59, 130, 246, 0.2) 0%, 
                  rgba(30, 64, 175, 0.15) 100%
                )
              `,
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
            }}
          >
            <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-3 text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Configure</h3>
          <p className="text-slate-300 leading-relaxed text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Define guardrails with our Policy Builder and choose your metrics.
          </p>
        </div>
      </div>

      {/* Command Card */}
      <div 
        className="relative backdrop-blur-xl rounded-2xl p-8 group hover:scale-[1.02] transition-all duration-300"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(15, 23, 42, 0.6) 0%, 
              rgba(30, 41, 59, 0.5) 50%,
              rgba(15, 23, 42, 0.6) 100%
            )
          `,
          border: '1px solid rgba(59, 130, 246, 0.25)',
          boxShadow: `
            0 0 0 1px rgba(59, 130, 246, 0.12),
            0 0 12px rgba(59, 130, 246, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.03)
          `
        }}
      >
        <div className="absolute inset-0 rounded-2xl" style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.02) 0%, 
              transparent 25%,
              transparent 75%,
              rgba(255, 255, 255, 0.01) 100%
            )
          `
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div 
            className="w-14 h-14 mb-5 rounded-xl flex items-center justify-center"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(59, 130, 246, 0.2) 0%, 
                  rgba(30, 64, 175, 0.15) 100%
                )
              `,
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
            }}
          >
            <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-3 text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Command</h3>
          <p className="text-slate-300 leading-relaxed text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Monitor live stats, schedule tasks, and fine-tune behavior.
          </p>
        </div>
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
