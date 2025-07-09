'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen command-center-bg flex items-center justify-center px-6">
      <Card className="glass-panel border-yellow-500/20 max-w-md">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-yellow-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">Payment Cancelled</h1>
          <p className="text-gray-400 mb-8">
            Your payment was cancelled. No charges have been made to your account.
          </p>
          
          <div className="space-y-4">
            <Link href="/pricing">
              <Button className="w-full command-button">
                <CreditCard className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </Link>
            
            <Link href="/dashboard">
              <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-700/50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
