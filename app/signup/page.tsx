'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Mail, Lock, User, Chrome } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [agreementsAccepted, setAgreementsAccepted] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (!agreementsAccepted) {
      setError('You must agree to the Terms of Service and Privacy Policy')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (response.ok) {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          setError('Account created but sign-in failed')
        } else {
          router.push('/dashboard')
        }
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create account')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      setError('Google sign-up failed')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen command-center-bg flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Shield className="w-10 h-10 text-blue-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Control Room <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full ml-2">BETA</span>
            </span>
          </Link>
        </div>

        <Card className="glass-panel border-blue-500/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Join the Command Center
            </CardTitle>
            <CardDescription className="text-gray-300">
              Create your account to start monitoring AI agents
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Sign Up */}
            <Button
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="w-full command-button"
              size="lg"
            >
              <Chrome className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">Or create with email</span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Agent Commander"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="agent@control-room.ai"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={agreementsAccepted}
                    onChange={(e) => setAgreementsAccepted(e.target.checked)}
                    required
                    className="mt-1 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">
                    I agree to the{' '}
                    <Link href="/terms" target="_blank" className="text-blue-400 hover:text-blue-300">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" target="_blank" className="text-blue-400 hover:text-blue-300">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !agreementsAccepted}
                className="w-full command-button"
                size="lg"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-blue-400 hover:text-blue-300">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
