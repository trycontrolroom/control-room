'use client'

import React, { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Send, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issue: ''
  })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setMessageType('')

    if (!formData.name || !formData.email || !formData.issue) {
      setMessage('Please fill in all fields.')
      setMessageType('error')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage('Your support ticket has been submitted successfully. We\'ll get back to you soon!')
        setMessageType('success')
        setFormData({ name: '', email: '', issue: '' })
      } else {
        setMessage('Failed to submit your ticket. Please try again or email us directly.')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('An error occurred. Please try again or email us directly.')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen command-center-bg">
      <Navigation />
      
      <div className="px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <MessageSquare className="w-12 h-12 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Contact Support
            </h1>
            <p className="text-xl text-gray-300">
              Get help with your Control Room experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Support Ticket Form */}
            <Card className="glass-panel border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Send className="w-6 h-6 mr-2 text-blue-400" />
                  Submit Support Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-gray-800/50 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-gray-800/50 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue" className="text-gray-300">
                      Describe your issue
                    </Label>
                    <Textarea
                      id="issue"
                      name="issue"
                      placeholder="Please provide as much detail as possible about your issue, including any error messages, steps to reproduce, and what you expected to happen..."
                      value={formData.issue}
                      onChange={handleInputChange}
                      className="bg-gray-800/50 border-gray-600 text-white min-h-[120px]"
                      required
                    />
                  </div>

                  {message && (
                    <div className={`text-sm text-center p-3 rounded ${
                      messageType === 'success' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full command-button"
                    size="lg"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Ticket'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Business Inquiries */}
            <Card className="glass-panel border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Mail className="w-6 h-6 mr-2 text-purple-400" />
                  Business Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Partnership &amp; Enterprise Sales
                  </h3>
                  <p className="text-gray-300 mb-4">
                    For business partnerships, enterprise sales, custom integrations, or other business-related inquiries, please reach out directly:
                  </p>
                  <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <a 
                        href="mailto:admin@control-room.ai" 
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        admin@control-room.ai
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Response Times
                  </h3>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex justify-between">
                      <span>Support Tickets:</span>
                      <span className="text-blue-400">24-48 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Business Inquiries:</span>
                      <span className="text-purple-400">1-2 business days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Enterprise Sales:</span>
                      <span className="text-green-400">Same day</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Before You Contact Us
                  </h3>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Check our Intel page for documentation and tutorials</li>
                    <li>• Review your account settings and billing information</li>
                    <li>• Try refreshing your browser or clearing cache</li>
                    <li>• Include relevant error messages in your ticket</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
