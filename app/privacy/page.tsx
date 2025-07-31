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
                    <strong>Effective Date:</strong> July 30, 2025<br />
                    <strong>Last Updated:</strong> July 30, 2025
                  </p>
                  <p>
                    Control Room Inc. ("Control Room", "we", "us", "our") is committed to protecting your privacy, security, and data sovereignty. This Privacy Policy ("Policy") outlines how we collect, use, store, process, disclose, and protect your personal data and related activity on our platform (the "Platform")—including the website, AI assistants, marketplace, integrations, affiliate dashboard, APIs, telemetry, and enterprise services.
                  </p>
                  <p className="mt-4">
                    By accessing or using the Platform, you acknowledge that you have read, understood, and agreed to the practices outlined below.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">1. Scope and Compliance</h3>
                  <p className="mb-3">
                    This Policy applies to all users of our Platform, including individuals, teams, organizations, affiliates, and third-party vendors, regardless of geographical location. It complies with major international privacy laws and frameworks, including:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>General Data Protection Regulation (GDPR) (EU)</li>
                    <li>California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA)</li>
                    <li>UK Data Protection Act 2018 (DPA)</li>
                    <li>ePrivacy Directive (EU)</li>
                    <li>Personal Information Protection and Electronic Documents Act (PIPEDA) (Canada)</li>
                    <li>Lei Geral de Proteção de Dados (LGPD) (Brazil)</li>
                    <li>Personal Data Protection Act (PDPA) (Singapore)</li>
                    <li>Information Technology Act (India)</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h3>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-blue-400 mb-2">A. Information You Provide Directly</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Account Data:</strong> Full name, email address, password (hashed), user role, organization, workspace preferences</li>
                      <li><strong>Profile Information:</strong> Bio, avatar, contact details, professional affiliations</li>
                      <li><strong>Marketplace Data:</strong> Agent listings, sales history, purchases, payment routing details, seller verification</li>
                      <li><strong>Affiliate Data:</strong> Referral links, commission tracking, payout information, promotional content</li>
                      <li><strong>Support Interactions:</strong> Names, emails, content of support inquiries, chat logs, ticket submissions</li>
                      <li><strong>Agent Configuration:</strong> User-created agent metadata, rule conditions, operational logs, custom policies</li>
                      <li><strong>Content Uploads:</strong> Files, documents, code, images, and other user-generated content</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-blue-400 mb-2">B. Automatically Collected Data</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Technical Data:</strong> IP addresses, browser types, device IDs, operating systems, screen resolution</li>
                      <li><strong>Usage Data:</strong> Session times, click paths, feature usage, navigation patterns, search queries</li>
                      <li><strong>Performance Data:</strong> Page load times, error rates, API response times, system performance metrics</li>
                      <li><strong>Cookies and Tracking:</strong> Authentication tokens, preference storage, A/B test variants, analytics data</li>
                      <li><strong>AI Interaction Data:</strong> Prompts, responses, model usage, conversation history, feedback ratings</li>
                      <li><strong>Telemetry:</strong> Agent uptime, health stats, usage frequency, error logs, performance metrics</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-blue-400 mb-2">C. Third-Party Integrations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>OAuth Providers (Google, GitHub):</strong> Basic profile information, email address, authentication tokens</li>
                      <li><strong>Stripe:</strong> Payment processing, subscription management, payout processing (we do not store full credit card numbers)</li>
                      <li><strong>Communication Services:</strong> Email delivery, SMS notifications, push notifications</li>
                      <li><strong>Analytics Services:</strong> Usage analytics, performance monitoring (data anonymized where possible)</li>
                      <li><strong>Cloud Services:</strong> Data storage, processing, backup, and content delivery</li>
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
                          <td className="border border-gray-600 px-4 py-2">Account creation, service delivery, marketplace transactions, billing</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Consent</td>
                          <td className="border border-gray-600 px-4 py-2">Marketing communications, optional features, cookie preferences</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Legitimate Interest</td>
                          <td className="border border-gray-600 px-4 py-2">Fraud prevention, security, product improvement, analytics</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Legal Obligation</td>
                          <td className="border border-gray-600 px-4 py-2">Tax compliance, law enforcement requests, regulatory requirements</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">4. How We Use Your Information</h3>
                  <p className="mb-3">We use collected data to:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Provide, personalize, and improve the Platform</li>
                    <li>Deliver real-time AI assistance, agent management, and analytics</li>
                    <li>Process payments, subscriptions, and affiliate commissions</li>
                    <li>Monitor system performance, security, and abuse prevention</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Send important service notifications and updates</li>
                    <li>Conduct research and development for new features</li>
                    <li>Ensure compliance with legal obligations and Terms of Service</li>
                    <li>Detect and prevent fraud, spam, and malicious activities</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">5. Data Sharing and Disclosure</h3>
                  <p className="mb-3">We never sell your personal data. We only share information:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>With Service Providers:</strong> Under strict data processing agreements (Stripe, cloud providers, analytics)</li>
                    <li><strong>Within Your Organization:</strong> According to workspace permissions and role-based access controls</li>
                    <li><strong>For Legal Compliance:</strong> When required by law, subpoena, or to protect rights and safety</li>
                    <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales (with notice)</li>
                    <li><strong>With Consent:</strong> When you explicitly authorize sharing with third parties</li>
                    <li><strong>Aggregated Data:</strong> Anonymized, non-personally identifiable data for research and analytics</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">6. Data Security and Protection</h3>
                  <p className="mb-3">We implement comprehensive security measures:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Encryption:</strong> Data-at-rest and data-in-transit encryption (AES-256, TLS 1.3)</li>
                    <li><strong>Access Controls:</strong> Role-based permissions, multi-factor authentication, session management</li>
                    <li><strong>Infrastructure Security:</strong> SOC 2 compliant hosting, network security, intrusion detection</li>
                    <li><strong>Application Security:</strong> Regular security audits, vulnerability assessments, secure coding practices</li>
                    <li><strong>Data Isolation:</strong> Workspace boundaries, agent sandboxing, tenant separation</li>
                    <li><strong>Monitoring:</strong> 24/7 security monitoring, incident response procedures, audit logging</li>
                    <li><strong>Employee Training:</strong> Security awareness, data handling procedures, confidentiality agreements</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">7. Data Retention</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-600">
                      <thead>
                        <tr className="bg-gray-800">
                          <th className="border border-gray-600 px-4 py-2 text-left">Data Type</th>
                          <th className="border border-gray-600 px-4 py-2 text-left">Retention Period</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Active user accounts</td>
                          <td className="border border-gray-600 px-4 py-2">Until account deletion or termination</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Billing and transaction records</td>
                          <td className="border border-gray-600 px-4 py-2">7 years (for tax and compliance)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">AI interaction logs</td>
                          <td className="border border-gray-600 px-4 py-2">30-90 days (unless needed for debugging)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Workspace and agent data</td>
                          <td className="border border-gray-600 px-4 py-2">30 days post-deletion (unless contractually required)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Security and audit logs</td>
                          <td className="border border-gray-600 px-4 py-2">2 years minimum (or as legally required)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Affiliate program data</td>
                          <td className="border border-gray-600 px-4 py-2">7 years (for commission tracking and tax compliance)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">8. Your Privacy Rights</h3>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-blue-400 mb-2">A. European Union / UK (GDPR/DPA)</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                      <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                      <li><strong>Right to Erasure:</strong> Request deletion of your data ("Right to be Forgotten")</li>
                      <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format</li>
                      <li><strong>Right to Restrict Processing:</strong> Limit how we process your data</li>
                      <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                      <li><strong>Right to Lodge Complaints:</strong> File complaints with data protection authorities</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-medium text-blue-400 mb-2">B. California (CCPA/CPRA)</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Right to Know:</strong> Information about data collection and use</li>
                      <li><strong>Right to Delete:</strong> Request deletion of personal information</li>
                      <li><strong>Right to Correct:</strong> Request correction of inaccurate data</li>
                      <li><strong>Right to Opt-Out:</strong> Opt-out of sale (we do not sell data)</li>
                      <li><strong>Right to Limit:</strong> Limit use of sensitive personal information</li>
                      <li><strong>Right to Non-Discrimination:</strong> Equal service regardless of privacy choices</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-blue-400 mb-2">C. Other Regions</h4>
                    <p>
                      We honor privacy rights globally and comply with applicable regional laws. To exercise your rights, contact <a href="mailto:admin@control-room.ai" className="text-blue-400 hover:text-blue-300">admin@control-room.ai</a> from your registered email address.
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">9. International Data Transfers</h3>
                  <p className="mb-3">Your data may be transferred to and processed in countries other than your own. We ensure adequate protection through:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Standard Contractual Clauses (SCCs):</strong> For EU/UK data transfers</li>
                    <li><strong>Adequacy Decisions:</strong> Transfers to countries with adequate protection</li>
                    <li><strong>Data Localization:</strong> Compliance with local requirements (India, Brazil, Russia)</li>
                    <li><strong>Binding Corporate Rules:</strong> Internal data transfer safeguards</li>
                    <li><strong>Certification Programs:</strong> Privacy Shield successors and equivalent mechanisms</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">10. Cookies and Tracking Technologies</h3>
                  <p className="mb-3">We use cookies and similar technologies for:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Essential Cookies:</strong> Authentication, security, basic functionality</li>
                    <li><strong>Performance Cookies:</strong> Analytics, error tracking, performance monitoring</li>
                    <li><strong>Functional Cookies:</strong> User preferences, language settings, customization</li>
                    <li><strong>Marketing Cookies:</strong> Advertising, retargeting (with consent where required)</li>
                  </ul>
                  <p className="mt-3">
                    You can manage cookie preferences through your browser settings or our cookie consent manager.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">11. Children's Privacy</h3>
                  <p>
                    Control Room does not knowingly collect personal data from individuals under 18 years of age. If we discover that we have collected data from a child, we will delete it immediately and suspend the account. Parents or guardians who believe their child has provided personal information should contact us immediately.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">12. AI-Specific Privacy Considerations</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>AI Training:</strong> We do not use your personal data to train AI models without explicit consent</li>
                    <li><strong>Data Minimization:</strong> AI processing is limited to necessary data for functionality</li>
                    <li><strong>Automated Decision-Making:</strong> You have rights regarding automated decisions that significantly affect you</li>
                    <li><strong>AI Transparency:</strong> We provide information about AI processing and decision logic where required</li>
                    <li><strong>Human Oversight:</strong> Critical decisions involving personal data include human review</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">13. Data Breach Notification</h3>
                  <p className="mb-3">In the event of a data breach that may affect your personal data, we will:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Notify affected users within 72 hours (or as required by law)</li>
                    <li>Report to relevant data protection authorities</li>
                    <li>Provide details about the breach, affected data, and remediation steps</li>
                    <li>Offer assistance and support to affected users</li>
                    <li>Conduct thorough investigation and implement additional safeguards</li>
                  </ul>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">14. Third-Party Services and Links</h3>
                  <p>
                    Our Platform may contain links to third-party websites or integrate with external services. This Privacy Policy does not apply to third-party services. We encourage you to review the privacy policies of any third-party services you use. We are not responsible for the privacy practices of external websites or services.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">15. Privacy Policy Updates</h3>
                  <p>
                    We may update this Privacy Policy to reflect changes in laws, technologies, or business practices. Material changes will be communicated via email and/or prominent Platform notices at least 14 days before taking effect. We encourage you to review this Policy periodically. Continued use after changes constitutes acceptance of the updated Policy.
                  </p>
                </div>

                <div className="border-t border-gray-600 pt-6">
                  <h3 className="text-xl font-semibold text-white mb-3">16. Contact Information</h3>
                  <p>
                    For questions about this Privacy Policy, to exercise your rights, or to report privacy concerns, please contact us at:
                  </p>
                  <p className="mt-2">
                    <strong>Email:</strong> <a href="mailto:admin@control-room.ai" className="text-blue-400 hover:text-blue-300">admin@control-room.ai</a><br />
                    <strong>Subject Line:</strong> Privacy Policy Inquiry<br />
                    <strong>Address:</strong> Control Room Inc., Privacy Officer
                  </p>
                  <p className="mt-3 text-sm text-gray-400">
                    We will respond to privacy requests within 30 days (or as required by applicable law).
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
