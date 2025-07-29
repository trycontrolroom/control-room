'use client'

import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Shield, User } from 'lucide-react'

export function Navigation() {
  const { data: session, status } = useSession()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Control Room <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full ml-2">BETA</span>
            </span>
          </Link>

          {/* center nav links - absolutely centered to page */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-8">
            <Link href="/marketplace" className="text-gray-300 hover:text-blue-400 transition-colors">
              Marketplace
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-blue-400 transition-colors">
              Pricing
            </Link>
            <Link href="/affiliate" className="text-gray-300 hover:text-blue-400 transition-colors">
              Affiliate
            </Link>
          </div>

          {/* admin link separate */}
          {session?.user?.role === 'ADMIN' && (
            <div className="hidden md:flex">
              <Link href="/admin" className="text-gray-300 hover:text-blue-400 transition-colors">
                Admin
              </Link>
            </div>
          )}

          {/* right‐hand auth controls */}
          <div className="flex items-center">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse" />
            ) : session ? (
              // only Dashboard button when signed in
              <Link href="/dashboard">
                <Button className="command-button">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              // unauthenticated
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-blue-500/50 hover:bg-blue-500/10"
                  >
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
