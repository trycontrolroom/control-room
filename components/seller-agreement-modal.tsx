'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  AlertTriangle, 
  X, 
  FileText, 
  CheckCircle,
  ExternalLink,
  Clock,
  DollarSign
} from 'lucide-react'

interface SellerAgreementModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  onDecline: () => void
  isLoading?: boolean
}

export function SellerAgreementModal({ 
  isOpen, 
  onClose, 
  onAccept, 
  onDecline, 
  isLoading = false 
}: SellerAgreementModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [hasClickedAgreementLink, setHasClickedAgreementLink] = useState(false)
  const [acceptanceConfirmed, setAcceptanceConfirmed] = useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true)
    }
  }

  const handleAccept = () => {
    if ((hasScrolledToBottom || hasClickedAgreementLink) && acceptanceConfirmed) {
      onAccept()
    }
  }

  const handleClose = () => {
    setHasScrolledToBottom(false)
    setHasClickedAgreementLink(false)
    setAcceptanceConfirmed(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="glass-panel border-red-500/20 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-600">
          <CardTitle className="text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-400" />
            <span>Seller Agreement - Control Room Marketplace</span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Warning Banner */}
          <div className="bg-red-500/10 border-b border-red-500/20 p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-red-400 font-semibold">Legal Agreement Required</h4>
                <p className="text-gray-300 text-sm mt-1">
                  By listing agents on Control Room Marketplace, you agree to the following terms and conditions. 
                  Please read carefully as this is a legally binding agreement. You can also view the full{' '}
                  <button
                    onClick={() => {
                      setHasClickedAgreementLink(true)
                      window.open('/legal/seller-agreement', '_blank')
                    }}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    seller agreement
                  </button>
                  {' '}in a separate window.
                </p>
              </div>
            </div>
          </div>

          {/* Agreement Content */}
          <div 
            className="p-6 max-h-[60vh] overflow-y-auto text-gray-300 text-sm leading-relaxed"
            onScroll={handleScroll}
          >
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

              {/* 9. Platform Rights and Enforcement */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  9. Platform Rights and Enforcement
                </h2>
                <div className="space-y-3 pl-6">
                  <p>Control Room reserves the right to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Remove any agent from the marketplace at any time</li>
                    <li>Suspend or terminate seller accounts for policy violations</li>
                    <li>Modify marketplace policies and fee structures</li>
                    <li>Withhold payments for problematic agents</li>
                    <li>Require additional documentation or verification</li>
                    <li>Implement additional security or quality measures</li>
                  </ul>
                </div>
              </section>

              {/* 10. Termination and Effect */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  10. Termination and Effect
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    Either party may terminate this agreement at any time with or without cause. 
                    Upon termination:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Your agents will be removed from the marketplace</li>
                    <li>Outstanding payments will be processed according to normal schedule</li>
                    <li>Buyer licenses for purchased agents remain valid</li>
                    <li>Indemnification obligations survive termination</li>
                  </ul>
                </div>
              </section>

              {/* 11. Legal Jurisdiction and Disputes */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  11. Legal Jurisdiction and Disputes
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    This agreement is governed by the laws of [Jurisdiction]. Any disputes will be 
                    resolved through binding arbitration in [Location].
                  </p>
                  <p>
                    You waive any right to participate in class action lawsuits or jury trials 
                    related to this agreement.
                  </p>
                </div>
              </section>

              {/* 12. Agreement Modifications */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  12. Agreement Modifications
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    Control Room may modify this agreement at any time. Continued use of the marketplace 
                    after modifications constitutes acceptance of the new terms.
                  </p>
                  <p>
                    Material changes will be communicated via email or platform notifications at least 
                    30 days before taking effect.
                  </p>
                </div>
              </section>

              {/* Final Notice */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-8">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-yellow-400 font-semibold">Final Notice</h4>
                    <p className="text-gray-300 text-sm mt-1">
                      By accepting this agreement, you acknowledge that you have read and understood all terms, 
                      have had the opportunity to seek legal counsel, and agree to be bound by these conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-600 p-4 bg-gray-800/30">
            <div className="space-y-4">
              {/* Scroll Progress */}
              {!hasScrolledToBottom && !hasClickedAgreementLink && (
                <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Please scroll to the bottom or click the seller agreement link to continue</span>
                </div>
              )}

              {/* Confirmation Checkbox */}
              {(hasScrolledToBottom || hasClickedAgreementLink) && (
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="confirm-acceptance"
                    checked={acceptanceConfirmed}
                    onChange={(e) => setAcceptanceConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="confirm-acceptance" className="text-sm text-gray-300">
                    I have read and understood the complete Seller Agreement and agree to be legally bound by its terms. 
                    I acknowledge that this creates a binding legal obligation.
                  </label>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button 
                  onClick={handleAccept}
                  className="command-button flex-1"
                  disabled={!(hasScrolledToBottom || hasClickedAgreementLink) || !acceptanceConfirmed || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Agreement & Continue
                    </>
                  )}
                </Button>
                <Button 
                  onClick={onDecline}
                  variant="outline"
                  className="border-red-500/50 hover:bg-red-500/10 text-red-400"
                  disabled={isLoading}
                >
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
