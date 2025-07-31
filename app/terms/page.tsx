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
                    <strong>Effective Date:</strong> July 30, 2025<br />
                    <strong>Last Updated:</strong> July 30, 2025
                  </p>
                  <p>
                    These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you") and Control Room Inc. ("Control Room", "we", "us", or "our"), governing your access to and use of the Control Room platform, including our software, services, AI tools, marketplace, APIs, website, affiliate program, and all associated content (the "Platform").
                  </p>
                  <p className="mt-4">
                    By accessing or using the Platform, you agree to these Terms. If you disagree with any part of these Terms, you may not use the Platform.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">1. Acceptance and Eligibility</h3>
                  <p className="mb-3">
                    You must be at least 18 years old or the age of majority in your jurisdiction to use the Platform. By using the Platform, you represent and warrant that:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You have the legal capacity to enter into these Terms</li>
                    <li>All registration information you submit is accurate and complete</li>
                    <li>You will maintain the accuracy of such information</li>
                    <li>Your use of the Platform complies with all applicable laws and regulations</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">2. Account Registration and Security</h3>
                  <p className="mb-3">
                    You are required to create an account to access most features. You are responsible for:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Maintaining the confidentiality of your login credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Immediately notifying us of any unauthorized use or security breach</li>
                    <li>Using strong passwords and enabling two-factor authentication when available</li>
                  </ul>
                  <p className="mt-3">
                    You agree to notify us immediately at <a href="mailto:admin@control-room.ai" className="text-blue-400 hover:text-blue-300">admin@control-room.ai</a> of any unauthorized use or breach.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">3. Acceptable Use Policy</h3>
                  <p className="mb-3">You agree not to:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use the Platform for any unlawful, harmful, fraudulent, or abusive purposes</li>
                    <li>Reverse-engineer, decompile, disassemble, or attempt to derive source code from the Platform</li>
                    <li>Interfere with or disrupt the integrity, security, or performance of the Platform</li>
                    <li>Upload, transmit, or distribute any viruses, malware, or malicious code</li>
                    <li>Harvest, scrape, or collect data from other users without explicit consent</li>
                    <li>Impersonate any person or entity or falsely state or misrepresent your affiliation</li>
                    <li>Use the Platform to compete with us or develop competing products</li>
                    <li>Violate any applicable laws, regulations, or third-party rights</li>
                  </ul>
                  <p className="mt-3">
                    We reserve the right to suspend or terminate accounts engaging in prohibited conduct without prior notice.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">4. AI Agent Marketplace</h3>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-blue-400 mb-2">A. Buyers</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>You may browse, purchase, install, and use AI agents listed on our Marketplace</li>
                      <li>Paid agents are subject to individual license terms and fees processed via Stripe</li>
                      <li>Subscriptions renew automatically unless canceled through your account settings</li>
                      <li>You are responsible for compliance with any third-party licenses or terms</li>
                      <li>We do not guarantee the performance, security, or suitability of third-party agents</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-blue-400 mb-2">B. Sellers</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Sellers must ensure all submitted agent code is safe, original, and non-infringing</li>
                      <li>By listing on our Marketplace, you grant Control Room a non-exclusive license to distribute your agent</li>
                      <li>Stripe Connect is required to receive payouts</li>
                      <li>Marketplace submissions may be reviewed, approved, or removed at our sole discretion</li>
                      <li>You warrant that you have all necessary rights to distribute your agents</li>
                      <li>You agree to our revenue sharing terms as specified in your seller agreement</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">5. Affiliate Program</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Participation in our affiliate program requires separate agreement to affiliate terms</li>
                    <li>Affiliates must comply with FTC guidelines and applicable advertising laws</li>
                    <li>Commission rates and payment terms are specified in the affiliate agreement</li>
                    <li>We reserve the right to modify or terminate the affiliate program at any time</li>
                    <li>Fraudulent or misleading promotional activities will result in immediate termination</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">6. Subscriptions, Billing, and Payments</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Subscription plans (Free, Beginner, Unlimited, Enterprise) are billed via Stripe</li>
                    <li>You may upgrade, downgrade, or cancel at any time via your account settings</li>
                    <li>All fees are non-refundable unless required by law or our refund policy</li>
                    <li>Failure to pay may result in account suspension or limited functionality</li>
                    <li>We reserve the right to change pricing with 30 days' notice</li>
                    <li>Taxes are your responsibility unless otherwise specified</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">7. Intellectual Property Rights</h3>
                  <p className="mb-3">
                    All content, branding, code, algorithms, and visual design on the Platform are owned by Control Room or our licensors. You may not use, copy, modify, or reproduce any part of the Platform without prior written consent, except:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Content you have created or legally own</li>
                    <li>Publicly available Marketplace content you have properly licensed</li>
                    <li>Fair use as permitted by applicable copyright law</li>
                  </ul>
                  <p className="mt-3">
                    We respect intellectual property rights and will respond to valid DMCA takedown requests sent to <a href="mailto:admin@control-room.ai" className="text-blue-400 hover:text-blue-300">admin@control-room.ai</a>.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">8. Privacy and Data Protection</h3>
                  <p>
                    Use of the Platform is subject to our Privacy Policy, which is fully compliant with GDPR, CCPA, DPA, and other applicable privacy laws. By using the Platform, you consent to the collection and use of your data as described in the Privacy Policy. We implement industry-standard security measures to protect your data.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">9. AI and Machine Learning Disclaimers</h3>
                  <p className="mb-3">
                    You acknowledge and agree that:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>AI outputs are probabilistic and may contain errors, hallucinations, or biases</li>
                    <li>You are solely responsible for reviewing and validating all AI-generated content</li>
                    <li>We are not liable for damages caused by AI outputs or agent behavior</li>
                    <li>AI models may be updated or changed without notice</li>
                    <li>You should not rely on AI outputs for critical decisions without human oversight</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">10. User-Generated Content and Data</h3>
                  <p className="mb-3">
                    You retain ownership of content you upload to the Platform. However, you grant Control Room a worldwide, non-exclusive, royalty-free license to:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Host, store, and display your content</li>
                    <li>Use your content to operate and improve the Platform</li>
                    <li>Create derivative works for Platform functionality</li>
                    <li>Sublicense to third-party service providers as necessary</li>
                  </ul>
                  <p className="mt-3">
                    We may remove content that violates these Terms, applicable law, or our community guidelines.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">11. Platform Availability and Modifications</h3>
                  <p className="mb-3">
                    We strive to maintain Platform availability but do not guarantee uninterrupted service. We reserve the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Modify, suspend, or discontinue any part of the Platform</li>
                    <li>Perform maintenance that may temporarily affect availability</li>
                    <li>Update features, functionality, or user interfaces</li>
                    <li>Change API endpoints or data formats with reasonable notice</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">12. Termination and Suspension</h3>
                  <p className="mb-3">
                    We reserve the right to suspend or terminate your access for:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Violation of these Terms or applicable laws</li>
                    <li>Suspected fraud, abuse, or security breaches</li>
                    <li>Non-payment or chargebacks</li>
                    <li>Conduct that may harm the Platform, other users, or our business</li>
                    <li>Inactivity for extended periods</li>
                  </ul>
                  <p className="mt-3">Upon termination:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your access will be immediately revoked</li>
                    <li>Your data may be deleted after a reasonable grace period</li>
                    <li>Outstanding obligations survive termination</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">13. Disclaimers and Warranties</h3>
                  <p className="mb-3">
                    TO THE FULLEST EXTENT PERMITTED BY LAW:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>The Platform is provided "AS IS" and "AS AVAILABLE" without warranties of any kind</li>
                    <li>We disclaim all warranties, express or implied, including merchantability and fitness for purpose</li>
                    <li>We do not guarantee accuracy, reliability, or error-free operation</li>
                    <li>You use the Platform at your own risk</li>
                    <li>We do not warrant that the Platform will meet your specific requirements</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">14. Limitation of Liability</h3>
                  <p className="mb-3">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Control Room shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
                    <li>Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim</li>
                    <li>We are not liable for third-party content, actions, or services</li>
                    <li>We are not liable for data loss, business interruption, or lost profits</li>
                    <li>Some jurisdictions do not allow limitation of liability, so these limits may not apply to you</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">15. Indemnification</h3>
                  <p>
                    You agree to indemnify, defend, and hold harmless Control Room and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Platform, violation of these Terms, or infringement of third-party rights.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">16. Governing Law and Dispute Resolution</h3>
                  <p className="mb-3">
                    These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles.
                  </p>
                  <p className="mb-3">For disputes:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>We encourage informal resolution by contacting <a href="mailto:admin@control-room.ai" className="text-blue-400 hover:text-blue-300">admin@control-room.ai</a></li>
                    <li>Formal disputes shall be resolved through binding arbitration in Delaware</li>
                    <li>You waive the right to participate in class actions or jury trials</li>
                    <li>Small claims court remains available for qualifying disputes</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">17. Export Controls and Sanctions</h3>
                  <p>
                    The Platform may be subject to export controls and sanctions laws. You agree not to use the Platform in violation of any applicable trade restrictions, export controls, or sanctions programs.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">18. Modifications to Terms</h3>
                  <p>
                    We may update these Terms to reflect changes in law, features, or business practices. Material changes will be communicated via email or prominent Platform notices at least 30 days before taking effect. Continued use after changes constitutes acceptance.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">19. Severability and Entire Agreement</h3>
                  <p>
                    If any provision of these Terms is found unenforceable, the remaining provisions will remain in effect. These Terms, together with our Privacy Policy and any additional agreements, constitute the entire agreement between you and Control Room.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">20. Contact Information</h3>
                  <p>
                    For questions about these Terms, please contact us at:
                  </p>
                  <p className="mt-2">
                    <strong>Email:</strong> <a href="mailto:admin@control-room.ai" className="text-blue-400 hover:text-blue-300">admin@control-room.ai</a><br />
                    <strong>Address:</strong> Control Room Inc., Legal Department
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
