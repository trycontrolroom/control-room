import React from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Scale } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen command-center-bg">
      <Navigation />
      
      <div className="px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* === Top section preserved as requested === */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Scale className="w-12 h-12 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-300">
              Legal terms and conditions for using Control Room
            </p>
          </div>

          <Card className="glass-panel border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Terms of Service</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="text-gray-300 space-y-6">

                {/* Effective / Updated */}
                <div>
                  <p className="text-sm text-gray-400 mb-4">
                    <strong>Effective Date:</strong> July 30, 2025<br />
                    <strong>Last Updated:</strong> July 30, 2025
                  </p>
                  <p>
                    These Terms of Service (“Terms”) constitute a legally binding agreement between you (“User”, “you”) and Control Room Inc. (“Control Room”, “we”, “us”, or “our”), governing your access to and use of the Control Room platform, including our software, services, AI tools, marketplace, APIs, website, affiliate program, and all associated content (the “Platform”).
                  </p>
                  <p className="mt-4">
                    By accessing or using the Platform, you agree to comply with and be bound by these Terms. If you do not agree, do not access or use the Platform.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">⚠️ Beta Disclaimer</h3>
                  <p className="mb-3">
                    The Control Room Platform is currently in beta testing, and as such, may include bugs, incomplete features, limited support, or downtime. By using the Platform during this phase, you acknowledge and accept that:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Features may change, break, or be removed without notice.</li>
                    <li>Data loss, performance degradation, or unexpected errors may occur.</li>
                    <li>You are using the Platform at your own risk during this testing phase.</li>
                    <li>We disclaim liability for any damages, losses, or harm caused by beta usage beyond those required by law.</li>
                  </ul>
                  <p className="mt-3">
                    We appreciate your feedback during this phase and are continuously working to improve reliability.
                  </p>
                </div>

                {/* Eligibility */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Eligibility</h3>
                  <p className="mb-3">
                    You must be at least 18 years old or the minimum digital consent age in your jurisdiction. By registering, you represent and warrant that:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You have the legal capacity to enter into this contract.</li>
                    <li>The information provided during registration is accurate and complete.</li>
                    <li>You are not using the Platform for unlawful purposes or on behalf of a restricted third party.</li>
                  </ul>
                </div>

                {/* Account Registration */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Account Registration</h3>
                  <p className="mb-3">
                    To use the Platform, you must create an account. You are responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Maintaining the confidentiality and security of your login credentials.</li>
                    <li>All activities occurring under your account.</li>
                    <li>Promptly notifying us at <a className="text-blue-400 hover:text-blue-300" href="mailto:admin@control-room.ai">admin@control-room.ai</a> of any unauthorized use, security breach, or suspected fraud.</li>
                  </ul>
                  <p className="mt-3">We may restrict, suspend, or terminate your account at our sole discretion.</p>
                </div>

                {/* RBAC & Workspaces */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Role-Based Access &amp; Workspace Structure</h3>
                  <p className="mb-3">Control Room operates on a workspace-based model with role-based access control:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Admin</strong>: Full control of features, billing, users, and AI tools.</li>
                    <li><strong>Manager</strong>: Can create/deploy agents, policies, metrics, and use AI tools.</li>
                    <li><strong>Viewer</strong>: Read-only access; cannot create/edit/deploy anything.</li>
                  </ul>
                  <p className="mt-3">
                    Workspaces are isolated by design. Role permissions are strictly enforced across all features, including AI assistants and billing.
                  </p>
                </div>

                {/* Plans & Pricing */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Plans &amp; Pricing</h3>
                  <p className="mb-3">
                    Pricing (Subject to change) is subscription-based and handled via Stripe. Current plans include:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Beginner — $39/month</li>
                    <li>Unlimited — $149/month</li>
                    <li>Enterprise — Custom</li>
                  </ul>
                  <p className="mt-3">
                    First two plans come with a 7-day free trial. Your trial begins upon activation and requires no credit card unless purchasing.
                  </p>
                </div>

                {/* AI Agent Tools */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">AI Agent Tools</h3>
                  <p className="mb-3">Control Room includes two embedded AI systems:</p>
                  <p className="mb-2"><strong>a. Create AI</strong></p>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Assists with agent creation via natural language prompt.</li>
                    <li>Generates multi-file agent code and displays it in the code editor.</li>
                    <li>Only Admins and Managers may create or deploy agents.</li>
                    <li>Generated code is stored securely per workspace.</li>
                  </ul>
                  <p className="mb-2"><strong>b. Helper AI</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Available across all pages as a contextual chatbot.</li>
                    <li><em>Explain Mode</em>: Offers guidance, tutorials, and onboarding help.</li>
                    <li><em>Action Mode</em>: Executes non-sensitive tasks with user confirmation.</li>
                    <li>Never accesses, deletes, or modifies sensitive data.</li>
                    <li>Cannot override permissions, access billing, or perform administrative actions.</li>
                  </ul>
                  <p className="mt-3">
                    You acknowledge that AI-generated outputs may be incomplete, inaccurate, or require human oversight. We are not liable for consequences resulting from AI output.
                  </p>
                </div>

                {/* Marketplace Terms */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Marketplace Terms</h3>
                  <p className="mb-2"><strong>a. Buyers</strong></p>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Agents may be purchased via one-time or recurring fees using Stripe.</li>
                    <li>Agents may contain third-party libraries or dependencies; verify them before use.</li>
                    <li>Agent behavior is your responsibility post-deployment.</li>
                  </ul>
                  <p className="mb-2"><strong>b. Sellers</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Must use Stripe Connect for payouts.</li>
                    <li>You retain ownership but grant us a non-exclusive right to host, distribute, and promote submitted agents.</li>
                    <li>All agent submissions are reviewed and subject to approval.</li>
                    <li>We take a 20% platform commission on sales.</li>
                  </ul>
                  <p className="mt-3">
                    Control Room reserves the right to remove listings, suspend sellers, or refund buyers at our discretion.
                  </p>
                </div>

                {/* Affiliate Program */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Affiliate Program</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You agree to the [Affiliate Agreement] presented at signup.</li>
                    <li>You receive 50% recurring commission based on the original subscription tier of the referred user.</li>
                    <li>If user upgrades, commission remains the same. If they downgrade, payout adjusts.</li>
                    <li>Payouts are handled monthly via Lemon Squeezy. A minimum of 3 referred paying users is required to initiate payouts.</li>
                    <li>Fraud, coupon stacking, or misleading referrals will result in termination.</li>
                  </ul>
                </div>

                {/* Billing, Trials & Cancellations */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Billing, Trials &amp; Cancellations</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Payments are handled via Stripe.</li>
                    <li>Trials are 7 days, no credit card required.</li>
                    <li>You may cancel at any time before trial ends.</li>
                    <li>Subscriptions auto-renew monthly unless canceled.</li>
                    <li>All fees are non-refundable unless required by law.</li>
                    <li>Chargebacks or payment reversals may lead to account suspension.</li>
                  </ul>
                </div>

                {/* Content Ownership & Licensing */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Content Ownership &amp; Licensing</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You retain full ownership of all agents, metrics, and policies created under your account.</li>
                    <li>You grant us a license to store, render, and display your data for platform operation.</li>
                    <li>By submitting agent code to the Marketplace, you affirm it is original, safe, and legal.</li>
                    <li>We are not liable for content generated by you or third parties.</li>
                  </ul>
                </div>

                {/* Acceptable Use */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Acceptable Use</h3>
                  <p className="mb-3">You agree not to:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Abuse platform resources (including AI tokens or API access)</li>
                    <li>Attempt to circumvent pricing or user caps</li>
                    <li>Access or exploit internal systems or data</li>
                    <li>Use the platform for surveillance, doxxing, impersonation, or discriminatory activities</li>
                    <li>Deploy agents or metrics that manipulate data, harm users, or evade moderation</li>
                  </ul>
                  <p className="mt-3">Violations may result in account suspension or legal action.</p>
                </div>

                {/* Security & Liability */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Security &amp; Liability</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>We use advanced encryption, secure infrastructure, and audit logs.</li>
                    <li>You must secure your login credentials and use MFA if offered.</li>
                    <li>No system is 100% immune to breach. You assume risk when uploading or storing sensitive data.</li>
                  </ul>
                </div>

                {/* Disclaimer of Warranties */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Disclaimer of Warranties</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Platform and AI features are provided “as is” and “as available.”</li>
                    <li>No warranties of fitness, performance, or uptime are guaranteed.</li>
                    <li>We do not warrant agent performance, AI accuracy, or uninterrupted access.</li>
                  </ul>
                </div>

                {/* Limitation of Liability */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>We are not liable for indirect, incidental, or punitive damages.</li>
                    <li>Maximum aggregate liability is limited to fees you paid in the last 6 months.</li>
                    <li>We are not responsible for user-generated or AI-generated harm, fraud, or misuse.</li>
                  </ul>
                </div>

                {/* Termination */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Termination</h3>
                  <p className="mb-3">We may suspend or delete your account if:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You breach these Terms</li>
                    <li>You abuse our systems, AIs, or other users</li>
                    <li>Payment fails or chargebacks occur</li>
                    <li>Your usage poses legal or reputational risk</li>
                  </ul>
                  <p className="mt-3">Upon termination:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Access is revoked.</li>
                    <li>Content may be deleted after a 14-day retention period.</li>
                  </ul>
                </div>

                {/* Dispute Resolution */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Dispute Resolution</h3>
                  <p className="mb-3">
                    These Terms are governed by the laws of Florida, United States. Disputes shall be resolved via binding arbitration in Florida. Class action and jury trials are waived.
                  </p>
                </div>

                {/* Modifications */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Modifications</h3>
                  <p>
                    We may revise these Terms at any time. You will be notified via email or dashboard prompt for material changes. Continued use constitutes acceptance.
                  </p>
                </div>

                {/* Contact */}
                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Contact</h3>
                  <p>
                    <span className="mr-2">📧</span>
                    <a href="mailto:admin@control-room.ai" className="text-blue-400 hover:text-blue-300">admin@control-room.ai</a>
                  </p>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}