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
                <div>
                  <p className="text-sm text-gray-400 mb-4">
                    <strong>Effective Date:</strong> July 1, 2025<br />
                    <strong>Last Updated:</strong> July 1, 2025
                  </p>
                  <p>
                    These Terms of Service ("Terms") constitute a binding agreement between you ("User", "you") and Control Room Inc. ("Control Room", "we", "us", or "our"), governing your access to and use of our website, software platform, products, marketplace, APIs, and services (collectively, the "Platform").
                  </p>
                  <p className="mt-4">
                    By accessing or using the Platform, you agree to these Terms. If you do not agree, you may not use the Platform.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">1. Eligibility</h3>
                  <p className="mb-3">
                    You must be at least 18 years old or the minimum age of digital consent in your country to use the Platform. By using the Platform, you represent and warrant that:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You have the legal capacity to enter into these Terms.</li>
                    <li>All registration information you submit is accurate and complete.</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">2. Account Registration</h3>
                  <p className="mb-3">
                    You are required to create an account to access most features. You are responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Maintaining the confidentiality of your login credentials.</li>
                    <li>All activities that occur under your account.</li>
                  </ul>
                  <p className="mt-3">
                    You agree to notify us immediately at <a href="mailto:admin@control-room.ai" className="text-blue-400 hover:text-blue-300">admin@control-room.ai</a> of any unauthorized use or breach.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">3. Acceptable Use</h3>
                  <p className="mb-3">You agree not to:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use the Platform for any unlawful, harmful, or abusive purposes.</li>
                    <li>Reverse-engineer, resell, or exploit any part of the Platform without our permission.</li>
                    <li>Interfere with system integrity, security, or performance.</li>
                    <li>Upload any viruses, malware, or malicious code.</li>
                    <li>Harvest data from other users without consent.</li>
                  </ul>
                  <p className="mt-3">
                    We reserve the right to suspend or terminate accounts engaging in prohibited conduct without notice.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">4. Marketplace Terms</h3>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-blue-400 mb-2">a. Buyers</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>You may browse, install, and use AI agents listed on our Marketplace.</li>
                      <li>Paid agents are subject to individual license terms and fees via Stripe.</li>
                      <li>Subscriptions renew automatically unless canceled.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-blue-400 mb-2">b. Sellers</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Sellers are responsible for ensuring all submitted agent code is safe, original, and non-infringing.</li>
                      <li>By listing on our Marketplace, you grant Control Room a non-exclusive license to distribute your agent.</li>
                      <li>Stripe Connect is required to receive payouts.</li>
                      <li>Marketplace submissions may be reviewed, approved, or removed at our discretion.</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">5. Subscriptions & Billing</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Subscription plans (Free, Pro, Enterprise) are billed via Stripe.</li>
                    <li>You may upgrade, downgrade, or cancel at any time via your Settings &gt; Billing page.</li>
                    <li>All fees are non-refundable unless required by law.</li>
                    <li>Failure to pay may result in account suspension or limited functionality.</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">6. Intellectual Property</h3>
                  <p className="mb-3">
                    All content, branding, code, and visual design on the Platform are owned by Control Room unless otherwise noted.
                    You may not use, copy, or reproduce any part of the Platform without prior written consent, except:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Content you have created or legally own.</li>
                    <li>Publicly available Marketplace content you have downloaded for personal use.</li>
                  </ul>
                  <p className="mt-3">
                    We respect intellectual property rights and will respond to valid DMCA takedown requests.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">7. Privacy</h3>
                  <p>
                    Use of the Platform is subject to our Privacy Policy, which is fully GDPR, CCPA, and DPA compliant.
                    By using the Platform, you consent to the collection and use of your data as described in the Privacy Policy.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">8. Security</h3>
                  <p className="mb-3">
                    We implement robust technical and organizational measures to protect your data and the integrity of the Platform. However, no system is fully immune to risk. You agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use secure passwords and authentication methods.</li>
                    <li>Report any suspected vulnerabilities or breaches.</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">9. User-Generated Content</h3>
                  <p>
                    You retain ownership of any content (e.g. agent code, custom policies) you upload to the Platform.
                    You grant Control Room a limited license to host, display, and use this content solely for the operation of the Platform.
                    We may remove content that violates these Terms or applicable law.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">10. Termination</h3>
                  <p className="mb-3">
                    We reserve the right to suspend or terminate access to the Platform for:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Violation of these Terms or applicable laws</li>
                    <li>Suspected fraud or security breaches</li>
                    <li>Non-payment or chargebacks</li>
                    <li>Any conduct that may harm the platform, other users, or our business</li>
                  </ul>
                  <p className="mt-3">Upon termination:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your access will be revoked.</li>
                    <li>Your data may be deleted after a grace period unless required to be retained by law.</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">11. Disclaimers</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>The Platform is provided "as is" without warranties of any kind.</li>
                    <li>We do not guarantee uptime, accuracy, or error-free operation.</li>
                    <li>You use the Platform at your own risk.</li>
                  </ul>
                  <p className="mt-3">
                    To the fullest extent permitted by law, Control Room disclaims all warranties, express or implied.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">12. Limitation of Liability</h3>
                  <p className="mb-3">To the maximum extent permitted by applicable law:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Control Room is not liable for any indirect, incidental, special, or consequential damages.</li>
                    <li>Our total liability to you will not exceed the amount you paid us in the 6 months preceding the claim.</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">13. Governing Law & Dispute Resolution</h3>
                  <p className="mb-3">
                    These Terms are governed by the laws of the State of Florida, United States, without regard to conflict of law principles.
                  </p>
                  <p className="mb-3">All disputes shall be:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Resolved through binding arbitration in Florida, unless waived by both parties.</li>
                    <li>You waive the right to participate in class actions or jury trials.</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">14. Modifications</h3>
                  <p>
                    We may update these Terms to reflect changes in law, features, or business practices.
                    We will notify users via email or prominent site notices if material changes are made.
                    Continued use after changes constitutes acceptance.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">15. Contact</h3>
                  <p>
                    For any questions regarding these Terms, please contact us at:
                  </p>
                  <p className="mt-2">
                    <strong>Email:</strong> <a href="mailto:admin@control-room.ai" className="text-blue-400 hover:text-blue-300">admin@control-room.ai</a>
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
