'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
    <div className="page">
      <div className="bg-gradient" />
      <div className="bg-vignette" />
      <div className="bg-aurora" />
      
      <div className="auth-container">
        <div className="auth-card">
          <header className="auth-header">
            <Link href="/" className="logo-link">
              <Shield className="logo-icon" />
              <span className="logo-text">Control Room</span>
            </Link>
            <h1 className="auth-title">Join the Command Center</h1>
            <p className="auth-subtitle">Create your account to start monitoring AI agents</p>
          </header>

          <div className="auth-content">
            <Button
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="google-button"
            >
              <Chrome className="button-icon" />
              Continue with Google
            </Button>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-text">Or create with email</span>
              <span className="divider-line" />
            </div>

            <form onSubmit={handleSignup} className="auth-form">
              <div className="input-group">
                <Label htmlFor="name" className="input-label">Full Name</Label>
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Agent Commander"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="auth-input"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <Label htmlFor="email" className="input-label">Email</Label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="agent@control-room.ai"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="auth-input"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <Label htmlFor="password" className="input-label">Password</Label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="auth-input"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <Label htmlFor="confirmPassword" className="input-label">Confirm Password</Label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="auth-input"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreementsAccepted}
                    onChange={(e) => setAgreementsAccepted(e.target.checked)}
                    required
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">
                    I agree to the{' '}
                    <Link href="/terms" target="_blank" className="auth-link">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" target="_blank" className="auth-link">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !agreementsAccepted}
                className="submit-button"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="auth-footer">
              Already have an account?{' '}
              <Link href="/login" className="auth-link">
                Sign in here
              </Link>
            </div>
          </div>
        </div>

        <div className="legal-text">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="legal-link">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="legal-link">
            Privacy Policy
          </Link>
        </div>
      </div>

      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .bg-gradient {
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(1200px 600px at 50% -10%, rgba(110,104,220,.12), transparent 60%),
            radial-gradient(900px 520px at 72% 120%, rgba(60,80,220,.08), transparent 60%);
          pointer-events: none;
          z-index: -3;
        }

        .bg-vignette {
          position: fixed;
          inset: -1px;
          background: radial-gradient(160% 110% at 50% 0%, transparent 50%, rgba(0,0,0,.35) 90%);
          pointer-events: none;
          z-index: -2;
        }

        .bg-aurora {
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(50% 40% at 20% 20%, rgba(130,120,255,.07), transparent 60%),
            radial-gradient(40% 35% at 80% 85%, rgba(80,120,255,.06), transparent 60%);
          filter: blur(40px);
          pointer-events: none;
          z-index: -1;
          animation: drift 20s ease-in-out infinite alternate;
        }

        @keyframes drift {
          from { transform: rotate(-10deg) scale(1.1); }
          to { transform: rotate(10deg) scale(1.2); }
        }

        .auth-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: linear-gradient(180deg, rgba(14,20,36,.85), rgba(10,14,26,.98));
          border: 1px solid rgba(175,190,255,.16);
          border-radius: 24px;
          box-shadow: 0 34px 90px rgba(0,0,0,.55), 0 6px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06);
          backdrop-filter: blur(24px);
          overflow: hidden;
        }

        .auth-header {
          text-align: center;
          padding: 2.5rem 2rem 1.5rem;
        }

        .logo-link {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          text-decoration: none;
        }

        .logo-icon {
          width: 2.5rem;
          height: 2.5rem;
          color: #4F6AFF;
        }

        .logo-text {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(180deg, #FFFFFF 70%, #D4C3FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .auth-title {
          font-size: 2rem;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
          letter-spacing: -0.025em;
        }

        .auth-subtitle {
          color: #8a96ad;
          font-size: 1rem;
          margin: 0;
        }

        .auth-content {
          padding: 0 2rem 2.5rem;
        }

        .google-button {
          width: 100%;
          height: 3.5rem;
          background: linear-gradient(135deg, rgba(138, 127, 255, 0.1), rgba(79, 106, 255, 0.1));
          border: 1px solid rgba(138, 127, 255, 0.3);
          border-radius: 14px;
          color: #8A7FFF;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          margin-bottom: 1.5rem;
        }

        .google-button:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(138, 127, 255, 0.2), rgba(79, 106, 255, 0.2));
          border-color: rgba(138, 127, 255, 0.5);
          transform: translateY(-1px);
        }

        .google-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .button-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(175,190,255,.12);
        }

        .divider-text {
          padding: 0 1rem;
          font-size: 0.875rem;
          color: #8a96ad;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-label {
          color: #a3b3ff;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1rem;
          height: 1rem;
          color: #8a96ad;
        }

        .auth-input {
          width: 100%;
          height: 3.5rem;
          background: rgba(8,12,22,.95);
          border: 1px solid rgba(175,190,255,.18);
          border-radius: 14px;
          padding: 0 1rem 0 2.75rem;
          color: #eaf0ff;
          font-size: 1rem;
          transition: all 0.18s ease;
        }

        .auth-input:focus {
          outline: none;
          border-color: rgba(200,214,255,.44);
          box-shadow: 0 0 0 4px rgba(79,106,255,.10);
        }

        .auth-input::placeholder {
          color: #8a96ad;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          text-align: center;
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 8px;
        }

        .checkbox-group {
          margin: 0.5rem 0;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
        }

        .checkbox-input {
          margin-top: 0.125rem;
          width: 1rem;
          height: 1rem;
          border-radius: 4px;
          border: 1px solid rgba(175,190,255,.18);
          background: rgba(8,12,22,.95);
          accent-color: #4F6AFF;
        }

        .checkbox-text {
          color: #a3b3ff;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .submit-button {
          width: 100%;
          height: 3.5rem;
          background: linear-gradient(135deg, #8A7FFF, #4F6AFF);
          border: none;
          border-radius: 14px;
          color: #FFFFFF;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.2s ease;
          box-shadow: 0 12px 30px rgba(79,106,255,.32);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 40px rgba(79,106,255,.4);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          color: #8a96ad;
          font-size: 0.875rem;
        }

        .auth-link {
          color: #4F6AFF;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .auth-link:hover {
          color: #8A7FFF;
        }

        .legal-text {
          text-align: center;
          margin-top: 1.5rem;
          color: #6b7280;
          font-size: 0.75rem;
          max-width: 420px;
        }

        .legal-link {
          color: #4F6AFF;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .legal-link:hover {
          color: #8A7FFF;
        }
      `}</style>
    </div>
  )
}
