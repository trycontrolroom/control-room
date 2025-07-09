import React from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen command-center-bg">
      <Navigation />
      
      <div className="px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300">
              How we protect and handle your data
            </p>
          </div>

          <Card className="glass-panel border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="text-gray-300 space-y-6">
                <div>
                  <p className="text-sm text-gray-400 mb-4">
                    <strong>Effective Date:</strong> July 1, 2025<br />
                    <strong>Last Updated:</strong> July 1, 2025
                  </p>
                  <p>
                    This Privacy Policy ("Policy") describes how Control Room Inc. ("Control Room", "we", "us", or "our") collects, uses, discloses, and protects your information in connection with our website, services, marketplace, and software tools (collectively, the "Platform"). By accessing or using the Platform, you acknowledge that you have read, understood, and agreed to the practices outlined below.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">1. Scope of This Policy</h3>
                  <p>
                    This Policy applies to all users of our Platform, including individuals, teams, organizations, and third-party vendors, regardless of geographical location. It complies with major international privacy laws and frameworks, including:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>General Data Protection Regulation (GDPR) (EU)</li>
                    <li>California Consumer Privacy Act (CCPA)</li>
                    <li>UK Data Protection Act 2018 (DPA)</li>
                    <li>ePrivacy Directive (EU)</li>
                    <li>Personal Information Protection and Electronic Documents Act (PIPEDA) (Canada)</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h3>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-blue-400 mb-2">A. Information You Provide Directly</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Account Data:</strong> Full name, email address, password (hashed), user role, organization.</li>
                      <li><strong>Marketplace Data:</strong> Listings, sales, purchases, payment routing details.</li>
                      <li><strong>Support Interactions:</strong> Names, emails, and content of support inquiries or ticket submissions.</li>
                      <li><strong>Policy/Agent Configuration:</strong> User-created agent metadata, rule conditions, and operational logs.</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-blue-400 mb-2">B. Automatically Collected Data</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Log Data:</strong> IP addresses, browser agents, device IDs, session times, click paths.</li>
                      <li><strong>Cookies and Pixels:</strong> Authentication tokens, preference storage, A/B test variants.</li>
                      <li><strong>Telemetry:</strong> Uptime, error rates, agent health stats, and service usage frequency.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-blue-400 mb-2">C. Third-Party Integrations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>OAuth (Google):</strong> Used for secure sign-in and basic profile info.</li>
                      <li><strong>Stripe:</strong> Manages payments, subscriptions, and payouts. We do not store credit card numbers.</li>
                      <li><strong>Courier:</strong> Used for email notification delivery and messaging.</li>
                      <li><strong>Analytics (if used):</strong> Data is anonymized or pseudonymized where required.</li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">3. Legal Basis for Processing (GDPR Compliance)</h3>
                  <p className="mb-3">We only process your data when there is a legal basis to do so:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-600">
                      <thead>
                        <tr className="bg-gray-800">
                          <th className="border border-gray-600 px-4 py-2 text-left">Legal Basis</th>
                          <th className="border border-gray-600 px-4 py-2 text-left">Examples</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Contractual Necessity</td>
                          <td className="border border-gray-600 px-4 py-2">Creating/managing your account, executing marketplace transactions</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Consent</td>
                          <td className="border border-gray-600 px-4 py-2">Optional features, cookie preferences, newsletters</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Legitimate Interest</td>
                          <td className="border border-gray-600 px-4 py-2">Preventing fraud, product improvement, service reliability</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Legal Obligation</td>
                          <td className="border border-gray-600 px-4 py-2">Responding to lawful government requests or subpoenas</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">8. Your Rights (By Region)</h3>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-blue-400 mb-2">A. European Union / UK</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Right to Access</li>
                      <li>Right to Rectification</li>
                      <li>Right to Erasure ("Right to be Forgotten")</li>
                      <li>Right to Data Portability</li>
                      <li>Right to Restrict Processing</li>
                      <li>Right to Object</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-blue-400 mb-2">B. California (CCPA)</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Right to Know</li>
                      <li>Right to Delete</li>
                      <li>Right to Opt-Out of Sale (we do not sell data)</li>
                      <li>Right to Non-Discrimination</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-blue-400 mb-2">C. Other Regions</h4>
                    <p>
                      We honor all regionally applicable rights to the extent required by law. Contact support@control-room.ai to submit a rights request.
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">9. International Transfers</h3>
                  <p className="mb-3">Your data may be transferred to servers in the United States or other jurisdictions. We ensure:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Standard Contractual Clauses (SCCs) for EU/UK data</li>
                    <li>Data localization compliance where required (e.g., India, Brazil)</li>
                    <li>Privacy Shield or equivalent mechanisms, where applicable</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">10. Children's Privacy</h3>
                  <p>
                    Control Room does not knowingly collect personal data from individuals under 18. If you become aware of a child using our Platform, contact us immediately.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">11. Policy Updates</h3>
                  <p>
                    We may amend this Policy periodically to reflect new laws, technologies, or business practices. Significant changes will be posted with a 14-day notice on the Intel page and/or emailed directly to registered users.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">12. Contact Us</h3>
                  <p>
                    If you have any questions about this Privacy Policy, or wish to exercise your rights, please reach out to us at:
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
