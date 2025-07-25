import React from 'react'
import Link from 'next/link'
import { Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Control Room
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              Take command of your AI agents with military-grade precision. 
              Real-time monitoring, policy automation, and marketplace integration.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Affiliate
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Intel</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/intel" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Intel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Control Room. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
