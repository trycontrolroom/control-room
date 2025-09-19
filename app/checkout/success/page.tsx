'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen command-center-bg flex items-center justify-center px-6">
      <Card className="glass-panel border-green-500/20 max-w-md">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-gray-400 mb-8">
            Your purchase has been completed successfully. You now have access to your new features.
          </p>
          
          <div className="space-y-4">
            <Link href="/dashboard">
              <Button className="w-full command-button">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <p className="text-xs text-gray-500">
              You will be automatically redirected to your dashboard in 10 seconds.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
