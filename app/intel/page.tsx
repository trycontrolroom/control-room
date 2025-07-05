import React from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Video, Users, Bell, Zap, Shield, Target, Lightbulb } from 'lucide-react'

export default function IntelPage() {
  return (
    <div className="min-h-screen command-center-bg">
      <Navigation />
      
      <div className="px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Intel Knowledge Center
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master your AI agent operations with comprehensive tutorials, documentation, and strategic insights
            </p>
          </div>

          {/* Quick Start Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-yellow-400" />
              Quick Start Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-panel border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center">
                    <Target className="w-5 h-5 mr-2 text-yellow-400" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Set up your first AI agent in under 5 minutes with our step-by-step walkthrough.
                  </p>
                  <Button variant="outline" className="w-full">
                    Start Tutorial
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-panel border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-yellow-400" />
                    Security Setup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Configure enterprise-grade security policies and access controls for your agents.
                  </p>
                  <Button variant="outline" className="w-full">
                    Learn Security
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-panel border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                    Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Optimize your agent performance with proven strategies and configuration tips.
                  </p>
                  <Button variant="outline" className="w-full">
                    View Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Documentation Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-blue-400" />
              Documentation
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-panel border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white">API Reference</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-blue-400 font-medium">Agent Management</h4>
                    <p className="text-gray-300 text-sm">Complete API documentation for creating, monitoring, and controlling AI agents.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-blue-400 font-medium">Policy Engine</h4>
                    <p className="text-gray-300 text-sm">Build and deploy automated policies using our visual policy builder.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-blue-400 font-medium">Marketplace Integration</h4>
                    <p className="text-gray-300 text-sm">Integrate with our marketplace to buy, sell, and distribute AI agents.</p>
                  </div>
                  <Button className="w-full command-button">
                    View Full API Docs
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-panel border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Integration Guides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-blue-400 font-medium">Webhook Configuration</h4>
                    <p className="text-gray-300 text-sm">Set up real-time notifications and event handling for your applications.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-blue-400 font-medium">SDK Libraries</h4>
                    <p className="text-gray-300 text-sm">Official SDKs for Python, Node.js, and other popular programming languages.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-blue-400 font-medium">Enterprise SSO</h4>
                    <p className="text-gray-300 text-sm">Configure SAML, OIDC, and other enterprise authentication methods.</p>
                  </div>
                  <Button className="w-full command-button">
                    Browse Integrations
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Video Tutorials Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Video className="w-6 h-6 mr-2 text-purple-400" />
              Video Tutorials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-panel border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Platform Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                    <Video className="w-12 h-12 text-purple-400" />
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Complete walkthrough of the Control Room platform and its core features.
                  </p>
                  <Button variant="outline" className="w-full">
                    Watch Now (12:34)
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-panel border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Policy Builder Deep Dive</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                    <Video className="w-12 h-12 text-purple-400" />
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Master the visual policy builder with advanced automation techniques.
                  </p>
                  <Button variant="outline" className="w-full">
                    Watch Now (18:45)
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-panel border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Marketplace Mastery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                    <Video className="w-12 h-12 text-purple-400" />
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Learn to buy, sell, and optimize your marketplace presence.
                  </p>
                  <Button variant="outline" className="w-full">
                    Watch Now (15:22)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Community & Updates Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="glass-panel border-green-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Users className="w-6 h-6 mr-2 text-green-400" />
                  Community & Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300">Discord Community</span>
                    <Button variant="outline" size="sm">Join</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300">GitHub Discussions</span>
                    <Button variant="outline" size="sm">Participate</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-300">Office Hours</span>
                    <Button variant="outline" size="sm">Schedule</Button>
                  </div>
                </div>
                <div className="border-t border-gray-600 pt-4">
                  <h4 className="text-green-400 font-medium mb-2">Need Help?</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    Our community experts and support team are here to help you succeed.
                  </p>
                  <Button className="w-full command-button">
                    Get Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Bell className="w-6 h-6 mr-2 text-orange-400" />
                  Latest Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-400 font-medium">Platform Update v2.1</span>
                      <span className="text-gray-400 text-xs">2 days ago</span>
                    </div>
                    <p className="text-gray-300 text-sm">Enhanced policy builder with new automation triggers and improved performance monitoring.</p>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-400 font-medium">New Tutorial Series</span>
                      <span className="text-gray-400 text-xs">1 week ago</span>
                    </div>
                    <p className="text-gray-300 text-sm">Advanced agent optimization techniques now available in our video tutorial library.</p>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-400 font-medium">Security Enhancement</span>
                      <span className="text-gray-400 text-xs">2 weeks ago</span>
                    </div>
                    <p className="text-gray-300 text-sm">New enterprise-grade encryption and audit trail features for enhanced security compliance.</p>
                  </div>
                </div>
                <Button className="w-full command-button">
                  View All Updates
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
