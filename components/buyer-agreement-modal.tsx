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
  ShoppingCart,
  Eye,
  Download
} from 'lucide-react'

interface BuyerAgreementModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  onDecline: () => void
  agentName?: string
  agentPrice?: number
  isLoading?: boolean
}

export function BuyerAgreementModal({ 
  isOpen, 
  onClose, 
  onAccept, 
  onDecline, 
  agentName = "AI Agent",
  agentPrice = 0,
  isLoading = false 
}: BuyerAgreementModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [acceptanceConfirmed, setAcceptanceConfirmed] = useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true)
    }
  }

  const handleAccept = () => {
    if (hasScrolledToBottom && acceptanceConfirmed) {
      onAccept()
    }
  }

  const handleClose = () => {
    setHasScrolledToBottom(false)
    setAcceptanceConfirmed(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="glass-panel border-blue-500/20 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-600">
          <CardTitle className="text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span>Buyer Agreement - Control Room Marketplace</span>
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
          {/* Purchase Summary */}
          <div className="bg-blue-500/10 border-b border-blue-500/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="text-blue-400 font-semibold">Purchase: {agentName}</h4>
                  <p className="text-gray-300 text-sm">
                    {agentPrice === 0 ? 'Free Agent' : `Price: $${agentPrice.toFixed(2)}`}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                {agentPrice === 0 ? 'FREE' : 'PAID'}
              </Badge>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-yellow-400 font-semibold">Important Legal Notice</h4>
                <p className="text-gray-300 text-sm mt-1">
                  By purchasing and using this AI agent, you agree to the following terms and conditions. 
                  Please read carefully as this creates legal obligations and limitations.
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
                  CONTROL ROOM MARKETPLACE BUYER AGREEMENT
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
                    By clicking "Accept Agreement & Purchase" below, you acknowledge that you have read, 
                    understood, and agree to be legally bound by all terms and conditions set forth in this Buyer Agreement.
                  </p>
                  <p>
                    This agreement constitutes a legally binding contract between you (the "Buyer") and 
                    Control Room (the "Platform") governing your purchase and use of AI agents from the Control Room Marketplace.
                  </p>
                  <p>
                    You represent that you have the legal authority to enter into this agreement and that 
                    you are at least 18 years of age or the age of majority in your jurisdiction.
                  </p>
                </div>
              </section>

              {/* 2. License and Usage Rights */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Download className="w-4 h-4 mr-2 text-green-400" />
                  2. License and Usage Rights
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    Upon purchase, you receive a limited, non-exclusive, non-transferable license to use 
                    the purchased AI agent for your personal or business purposes.
                  </p>
                  <p>
                    This license grants you the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Install and configure the agent within your Control Room environment</li>
                    <li>Use the agent for its intended purpose as described in the marketplace listing</li>
                    <li>Receive updates and support as provided by the agent creator</li>
                    <li>Access documentation and setup instructions</li>
                  </ul>
                  <p>
                    You may NOT:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Reverse engineer, decompile, or attempt to extract source code</li>
                    <li>Redistribute, resell, or sublicense the agent to third parties</li>
                    <li>Modify or create derivative works based on the agent</li>
                    <li>Use the agent for illegal or unauthorized purposes</li>
                  </ul>
                </div>
              </section>

              {/* 3. Payment and Refund Policy */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  3. Payment and Refund Policy
                </h2>
                <div className="space-y-3 pl-6">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="font-semibold text-red-400 mb-2">NO REFUND POLICY</p>
                    <p className="text-xs">
                      All sales are final - no refunds, credits, or chargebacks will be processed
                    </p>
                  </div>
                  <p>
                    <strong>All sales are final.</strong> Control Room does not provide refunds, partial credits, 
                    or chargeback resolutions for any reason, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Dissatisfaction with agent performance</li>
                    <li>Technical difficulties or compatibility issues</li>
                    <li>Changes in business requirements</li>
                    <li>User error or misconfiguration</li>
                    <li>Agent malfunction or unexpected behavior</li>
                  </ul>
                  <p>
                    You are solely responsible for evaluating whether an agent meets your needs before purchase. 
                    We recommend thoroughly reviewing agent descriptions, capabilities, and requirements.
                  </p>
                </div>
              </section>

              {/* 4. Platform Disclaimer */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                  4. Platform Disclaimer and Limitations
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    Control Room serves as a marketplace platform connecting buyers and sellers. 
                    We do not create, control, or guarantee the performance of third-party agents.
                  </p>
                  <p>
                    <strong>Control Room is NOT responsible for:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Agent functionality, performance, or reliability</li>
                    <li>Accuracy of agent descriptions or marketing claims</li>
                    <li>Technical support for third-party agents</li>
                    <li>Compatibility with your specific systems or requirements</li>
                    <li>Data security or privacy practices of individual agents</li>
                    <li>Disputes between buyers and sellers</li>
                  </ul>
                </div>
              </section>

              {/* 5. Risk Assumption and User Responsibility */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  5. Risk Assumption and User Responsibility
                </h2>
                <div className="space-y-3 pl-6">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="font-semibold text-red-400 mb-2">CRITICAL RISK NOTICE</p>
                    <p className="text-xs">
                      You assume ALL risks associated with using AI agents - Control Room bears NO responsibility
                    </p>
                  </div>
                  <p>
                    <strong>You acknowledge and assume full responsibility for all risks associated with using AI agents, including:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Financial losses or business disruption</li>
                    <li>Data corruption, loss, or unauthorized access</li>
                    <li>Legal violations or regulatory non-compliance</li>
                    <li>Damage to systems, infrastructure, or reputation</li>
                    <li>Unintended actions or AI hallucinations</li>
                    <li>Third-party API overuse, bans, or service limitations</li>
                    <li>Privacy violations or data breaches</li>
                    <li>Intellectual property infringement</li>
                  </ul>
                  <p>
                    You are solely responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Monitoring and supervising agent activities</li>
                    <li>Ensuring compliance with applicable laws and regulations</li>
                    <li>Implementing appropriate security measures</li>
                    <li>Backing up critical data and systems</li>
                    <li>Testing agents in safe environments before production use</li>
                  </ul>
                </div>
              </section>

              {/* 6. Agent Behavior and Automation Risks */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  6. Agent Behavior and Automation Risks
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    AI agents may exhibit unpredictable behavior, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Generating false, misleading, or inappropriate content</li>
                    <li>Making unauthorized decisions or taking unintended actions</li>
                    <li>Consuming excessive resources or API calls</li>
                    <li>Interacting with external services in unexpected ways</li>
                    <li>Processing data incorrectly or incompletely</li>
                    <li>Failing to operate as described or expected</li>
                  </ul>
                  <p>
                    You acknowledge that automation tools carry inherent risks and agree to use them 
                    with appropriate caution, supervision, and safeguards.
                  </p>
                </div>
              </section>

              {/* 7. Full Legal Indemnification */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  7. Full Legal Indemnification
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    You agree to fully and unconditionally indemnify, defend, and hold harmless Control Room, 
                    its founders, officers, developers, affiliates, partners, successors, and assignees from any and all:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Claims, lawsuits, demands, damages, liabilities, losses, fines, judgments, penalties</li>
                    <li>Attorney fees and court costs</li>
                    <li>Regulatory investigations or enforcement actions</li>
                    <li>Third-party claims or disputes</li>
                  </ul>
                  <p>
                    This indemnification applies to any issues arising from or related to your use of purchased agents, 
                    including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Alleged or actual violations of law</li>
                    <li>Misuse of automation tools or features</li>
                    <li>Violations of intellectual property or third-party terms</li>
                    <li>Business or operational consequences resulting from agent use</li>
                    <li>Data breaches or privacy violations</li>
                    <li>Financial losses or damages to third parties</li>
                  </ul>
                </div>
              </section>

              {/* 8. No Platform Responsibility for Agent Content */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  8. No Platform Responsibility for Agent Content or Claims
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    Control Room does NOT guarantee the accuracy, completeness, or performance of any agent 
                    description, marketing claim, performance statement, or usage guide.
                  </p>
                  <p>
                    We are not responsible for any misleading, fraudulent, or exaggerated claims made by sellers. 
                    You are solely responsible for evaluating whether an agent is appropriate for your needs.
                  </p>
                  <p>
                    All agent functionality, support, and updates must come directly from the agent creator or seller. 
                    Control Room provides no warranties or guarantees regarding third-party agents.
                  </p>
                </div>
              </section>

              {/* 9. Non-Intervention Policy */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  9. Non-Intervention & No Support Guarantee
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    Control Room is not responsible for resolving disputes between buyers and sellers. 
                    We do not offer support for third-party agents unless explicitly stated otherwise.
                  </p>
                  <p>
                    You acknowledge that all assistance, updates, documentation, or agent functionality 
                    must come directly from the agent creator or seller.
                  </p>
                  <p>
                    Control Room may remove agents from the marketplace at any time without notice, 
                    but this does not affect your existing license to use previously purchased agents.
                  </p>
                </div>
              </section>

              {/* 10. Legal Compliance and Usage Restrictions */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  10. Legal Compliance and Usage Restrictions
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    You agree to operate all purchased agents in full compliance with:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Local, state, and international laws</li>
                    <li>Data privacy and protection regulations (e.g., GDPR, CCPA)</li>
                    <li>Platform-specific terms (e.g., APIs, integrations, or messaging limits)</li>
                    <li>Industry-specific regulations and compliance requirements</li>
                  </ul>
                  <p>
                    You may NOT use agents for unlawful, malicious, unethical, or prohibited purposes, including:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Fraud, deception, or misrepresentation</li>
                    <li>Spamming, harassment, or unauthorized communications</li>
                    <li>Scraping, data mining, or unauthorized data collection</li>
                    <li>Impersonation or identity theft</li>
                    <li>Surveillance or privacy violations</li>
                    <li>Market manipulation or unfair business practices</li>
                  </ul>
                </div>
              </section>

              {/* 11. Assumption of Full Risk */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  11. Assumption of Full Risk
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    You understand and acknowledge that:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Automation tools and AI agents are inherently experimental and carry unpredictable behavior risks</li>
                    <li>You alone are responsible for supervising, configuring, and controlling agent actions and consequences</li>
                    <li>You agree to use these tools with caution, professional discretion, and full personal responsibility</li>
                    <li>No technology is perfect, and agents may fail, malfunction, or behave unexpectedly</li>
                    <li>You assume all financial, legal, operational, and reputational risks</li>
                  </ul>
                </div>
              </section>

              {/* 12. Binding Waiver & Release */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  12. Binding Waiver & Release
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    By purchasing and using any agent in the Control Room Marketplace:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>You irrevocably waive your right to hold Control Room liable for any loss, claim, or legal dispute</li>
                    <li>You agree not to pursue or support any legal action against Control Room for anything arising from agent use</li>
                    <li>You release Control Room from all claims, known or unknown, arising from your use of marketplace agents</li>
                  </ul>
                </div>
              </section>

              {/* 13. Termination and License Survival */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  13. Termination and License Survival
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    Your license to use purchased agents continues until terminated by you or the agent creator. 
                    Control Room may terminate your marketplace access but cannot revoke licenses for agents you have already purchased.
                  </p>
                  <p>
                    Upon termination of your Control Room account:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>You retain the right to use previously purchased agents</li>
                    <li>You lose access to marketplace features and future purchases</li>
                    <li>All indemnification obligations survive termination</li>
                    <li>No refunds will be provided for unused agents or services</li>
                  </ul>
                </div>
              </section>

              {/* 14. Legal Jurisdiction and Disputes */}
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  14. Legal Jurisdiction and Disputes
                </h2>
                <div className="space-y-3 pl-6">
                  <p>
                    This agreement is governed by the laws of [Jurisdiction]. Any disputes will be 
                    resolved through binding arbitration in [Location].
                  </p>
                  <p>
                    You waive any right to participate in class action lawsuits or jury trials 
                    related to this agreement or your use of marketplace agents.
                  </p>
                </div>
              </section>

              {/* Final Notice */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-8">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-red-400 font-semibold">Final Notice</h4>
                    <p className="text-gray-300 text-sm mt-1">
                      By accepting this agreement, you acknowledge that you have read and understood all terms, 
                      have had the opportunity to seek legal counsel, and agree to assume all risks associated 
                      with using AI agents. You understand that Control Room bears no responsibility for any 
                      outcome or consequence of your use of marketplace agents.
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
              {!hasScrolledToBottom && (
                <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Please scroll to the bottom to read the complete agreement</span>
                </div>
              )}

              {/* Confirmation Checkbox */}
              {hasScrolledToBottom && (
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="confirm-buyer-acceptance"
                    checked={acceptanceConfirmed}
                    onChange={(e) => setAcceptanceConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="confirm-buyer-acceptance" className="text-sm text-gray-300">
                    I have read and understood the complete Buyer Agreement and agree to be legally bound by its terms. 
                    I acknowledge that I assume all risks and that Control Room bears no responsibility for any outcome 
                    or consequence of my use of this agent.
                  </label>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button 
                  onClick={handleAccept}
                  className="command-button flex-1"
                  disabled={!hasScrolledToBottom || !acceptanceConfirmed || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Purchase...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Agreement & {agentPrice === 0 ? 'Install' : 'Purchase'}
                    </>
                  )}
                </Button>
                <Button 
                  onClick={onDecline}
                  variant="outline"
                  className="border-red-500/50 hover:bg-red-500/10 text-red-400"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
