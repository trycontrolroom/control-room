'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Shield, User, LogOut } from 'lucide-react'

export function Navigation() {
  const { data: session, status } = useSession()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Control Room
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/pricing" className="text-gray-300 hover:text-blue-400 transition-colors">
              Pricing
            </Link>
            <Link href="/marketplace" className="text-gray-300 hover:text-blue-400 transition-colors">
              Marketplace
            </Link>
            {session?.user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-gray-300 hover:text-blue-400 transition-colors">
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button className="command-button">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="border-red-500/50 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="outline" className="border-blue-500/50 hover:bg-blue-500/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="command-button">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
