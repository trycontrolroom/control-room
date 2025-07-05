'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  ArrowLeft,
  FileText,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function SellerAgreementPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/marketplace/sell">
            <Button variant="outline" className="mb-4 border-gray-600 hover:bg-gray-700/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
          
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-red-400" />
            <h1 className="text-3xl font-bold text-white">Seller Agreement</h1>
          </div>
          
          <p className="text-gray-400">
            Control Room Marketplace - Legal Terms and Conditions for Sellers
          </p>
        </div>

        {/* Agreement Content */}
        <Card className="glass-panel border-red-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Complete Seller Agreement</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 text-gray-300 text-sm leading-relaxed">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center border-b border-gray-600 pb-4">
                <h1 className="text-xl font-bold text-white mb-2">
                  CONTROL ROOM MARKETPLACE SELLER AGREEMENT
                </h1>
                <p className="text-gray-400 text-xs">
                  Effective Date: {new Date().toLocaleDateString()} | Version 1.0
                </p>
              </div>

              {/* 1. Acceptance and Binding Nature */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-blue-400" />
                  1. Acceptance and Binding Nature
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    By clicking "Accept Agreement" below, you acknowledge that you have read, understood, 
                    and agree to be legally bound by all terms and conditions set forth in this Seller Agreement.
                  </p>
                  <p>
                    This agreement constitutes a legally binding contract between you (the "Seller") and 
                    Control Room (the "Platform") governing your participation in the Control Room Marketplace.
                  </p>
                  <p>
                    You represent that you have the legal authority to enter into this agreement and that 
                    you are at least 18 years of age or the age of majority in your jurisdiction.
                  </p>
                </div>
              </section>

              {/* 2. Revenue Sharing and Payment Terms */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                  2. Revenue Sharing and Payment Terms
                </h2>
                <div className="space-y-3 pl-6">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-green-400">Revenue Split:</span>
                      <div className="flex space-x-4">
                        <span className="text-green-400">Seller: 70%</span>
                        <span className="text-gray-400">Platform: 30%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      All payments are processed through Stripe with monthly payouts
                    </p>
                  </div>
                  <p>
                    Control Room retains a 30% commission on all sales of your agents. You will receive 70% 
                    of the gross sale price after payment processing fees.
                  </p>
                  <p>
                    Payments are processed monthly via Stripe. You must maintain a valid Stripe account 
                    and provide accurate tax information as required by law.
                  </p>
                  <p>
                    Control Room reserves the right to withhold payments for agents that violate platform 
                    policies or generate excessive support requests or refund claims.
                  </p>
                </div>
              </section>

              {/* 3. Agent Quality and Approval Process */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-blue-400" />
                  3. Agent Quality and Approval Process
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    All agents submitted to the marketplace undergo a review process. Control Room reserves 
                    the right to reject any agent that does not meet our quality standards or violates our policies.
                  </p>
                  <p>
                    You warrant that all agents you submit:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Function as described in their documentation</li>
                    <li>Do not contain malicious code or security vulnerabilities</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Do not infringe on third-party intellectual property rights</li>
                    <li>Include accurate and complete setup instructions</li>
                  </ul>
                </div>
              </section>

              {/* 4. Intellectual Property and Licensing */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  4. Intellectual Property and Licensing
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    You retain all intellectual property rights in your agents. By listing an agent, 
                    you grant Control Room a non-exclusive license to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Display and market your agent on the platform</li>
                    <li>Process payments and handle customer support</li>
                    <li>Provide basic technical support to buyers</li>
                    <li>Create promotional materials featuring your agent</li>
                  </ul>
                  <p>
                    You grant buyers a limited, non-transferable license to use your agent as intended. 
                    Buyers may not reverse engineer, redistribute, or resell your agents.
                  </p>
                </div>
              </section>

              {/* 5. Seller Responsibilities and Obligations */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  5. Seller Responsibilities and Obligations
                </h2>
                <div className="space-y-3 pl-6">
                  <p>As a seller, you agree to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Provide accurate and complete agent descriptions</li>
                    <li>Maintain your agents and provide updates as needed</li>
                    <li>Respond to buyer inquiries within 48 hours</li>
                    <li>Provide technical support for your agents</li>
                    <li>Comply with all platform policies and guidelines</li>
                    <li>Report any security vulnerabilities or issues promptly</li>
                  </ul>
                </div>
              </section>

              {/* 6. Prohibited Activities */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
                  6. Prohibited Activities
                </h2>
                <div className="space-y-3 pl-6">
                  <p>You may not:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Submit agents that violate laws or regulations</li>
                    <li>Include malicious code, viruses, or security exploits</li>
                    <li>Misrepresent agent capabilities or functionality</li>
                    <li>Infringe on third-party intellectual property</li>
                    <li>Engage in fraudulent or deceptive practices</li>
                    <li>Attempt to circumvent platform payment systems</li>
                    <li>Submit agents that collect user data without disclosure</li>
                  </ul>
                </div>
              </section>

              {/* 7. Liability and Risk Assumption */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  7. Liability and Risk Assumption
                </h2>
                <div className="space-y-3 pl-6">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="font-semibold text-red-400 mb-2">IMPORTANT LIABILITY NOTICE</p>
                    <p className="text-xs">
                      You assume full responsibility for your agents and their consequences
                    </p>
                  </div>
                  <p>
                    You acknowledge and agree that you are solely responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>All consequences arising from the use of your agents</li>
                    <li>Any damages, losses, or legal issues caused by your agents</li>
                    <li>Compliance with all applicable laws and regulations</li>
                    <li>Obtaining necessary permissions and licenses</li>
                    <li>Providing adequate warnings and documentation</li>
                  </ul>
                </div>
              </section>

              {/* 8. Indemnification */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  8. Full Indemnification
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    You agree to fully indemnify, defend, and hold harmless Control Room, its officers, 
                    directors, employees, and affiliates from any and all:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Claims, lawsuits, or legal proceedings</li>
                    <li>Damages, losses, or financial liabilities</li>
                    <li>Attorney fees and court costs</li>
                    <li>Regulatory fines or penalties</li>
                  </ul>
                  <p>
                    This indemnification applies to any issues arising from or related to your agents, 
                    including but not limited to intellectual property infringement, privacy violations, 
                    security breaches, or operational failures.
                  </p>
                </div>
              </section>

              {/* Final Notice */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-8">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-yellow-400 font-semibold">Legal Document</h4>
                    <p className="text-gray-300 text-sm mt-1">
                      This is the complete seller agreement for Control Room Marketplace. By participating 
                      as a seller, you agree to be bound by these terms and conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
