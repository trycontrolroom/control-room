'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'

export function Navigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // slide state
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    // only wait 100px on "/", else hide immediately
    const hideThreshold = pathname === '/' ? 100 : 0

    const controlScrolling = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      } else if (
        currentScrollY > lastScrollY &&
        currentScrollY > hideThreshold
      ) {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', controlScrolling)
    return () => window.removeEventListener('scroll', controlScrolling)
  }, [lastScrollY, pathname])

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-xl rounded-3xl overflow-hidden transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-20'
      }`}
      style={{
        width: 'calc(100% - 2rem)',
        maxWidth: '75rem',
        background: `
          linear-gradient(135deg, 
            rgba(15, 23, 42, 0.9) 0%, 
            rgba(30, 41, 59, 0.85) 25%,
            rgba(51, 65, 85, 0.8) 50%,
            rgba(30, 41, 59, 0.85) 75%,
            rgba(15, 23, 42, 0.9) 100%
          )
        `,
        border: '1px solid rgba(59, 130, 246, 0.5)',
        boxShadow: `
          0 0 0 1px rgba(59, 130, 246, 0.3),
          0 0 40px rgba(59, 130, 246, 0.4),
          0 0 80px rgba(59, 130, 246, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.05)
        `,
      }}
    >
      {/* subtle shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-transparent pointer-events-none rounded-3xl" />

      <div className="relative z-10 px-12 py-5 flex items-center w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center group space-x-3">
          <span
            className="
              text-[13px] tracking-[0.35em] font-light 
              text-white/90 group-hover:text-[#3B82F6] transition-colors uppercase
            "
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Control Room
          </span>
          <span
            className="
              text-[10px] px-2 py-[1px] rounded-full uppercase 
              tracking-widest font-semibold text-white
            "
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid #3B82F6',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            BETA
          </span>
        </Link>

        {/* Center nav links */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-8">
          <Link
            href="/pricing"
            className="text-base font-medium text-slate-300 hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/marketplace"
            className="text-base font-medium text-slate-300 hover:text-white transition-colors"
          >
            Marketplace
          </Link>
          <Link
            href="/affiliate"
            className="text-base font-medium text-slate-300 hover:text-white transition-colors"
          >
            Affiliate
          </Link>
        </div>

        {/* Right controls */}
        <div className="ml-auto flex items-center space-x-4">
          {session?.user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="hidden md:inline text-base font-medium text-slate-300 hover:text-white transition-colors"
            >
              Admin
            </Link>
          )}

          {status === 'loading' ? (
            <div className="w-12 h-10 rounded-xl bg-slate-600 animate-pulse" />
          ) : session ? (
            <Link href="/dashboard">
              <Button
                className="px-5 py-2.5 text-base font-medium text-white rounded-xl border-0 transition-all"
                style={{
                  background:
                    'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  boxShadow:
                    '0 6px 20px rgba(59, 130, 246, 0.5), 0 3px 10px rgba(59, 130, 246, 0.4)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="px-5 py-2.5 text-base text-slate-300 rounded-xl transition-all border-0"
                  style={{
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  className="px-5 py-2.5 text-base font-medium text-white rounded-xl transition-all border-0"
                  style={{
                    background:
                      'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                    boxShadow:
                      '0 6px 20px rgba(59, 130, 246, 0.5), 0 3px 10px rgba(59, 130, 246, 0.4)',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
