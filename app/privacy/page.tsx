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
          {/* Hero */}
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

                {/* Effective dates + intro */}
                <div>
                  <p className="text-sm text-gray-400 mb-4">
                    <strong>Effective Date:</strong> July 30, 2025<br />
                    <strong>Last Updated:</strong> July 30, 2025
                  </p>
                  <p>
                    Control Room Inc. (“Control Room”, “we”, “us”, “our”) is committed to protecting your privacy, security, and data sovereignty.
                    This Privacy Policy (“Policy”) outlines how we collect, use, store, process, disclose, and protect your personal data and related activity on our platform (the “Platform”)—including the website, AI assistants, marketplace, integrations, affiliate dashboard, APIs, telemetry, and enterprise services.
                  </p>
                  <p className="mt-4">
                    Use of the Platform constitutes your acknowledgment of this Policy. If you disagree with any part, do not use the Platform.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* Beta Disclaimer */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">⚠️ Beta Disclaimer</h3>
                  <p className="mb-3">
                    Control Room is currently in beta testing. While we maintain high standards of privacy and security, you acknowledge and agree that:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Features under development may undergo changes affecting how data is processed.</li>
                    <li>There may be occasional bugs or interruptions that impact your data experience.</li>
                    <li>Our response times for privacy-related requests (e.g., data deletion/export) may be slower than production SLAs.</li>
                    <li>
                      By using the Platform during beta, you consent to data handling practices that are consistent with this Policy, but subject to the inherent limitations of beta software.
                    </li>
                  </ul>
                  <p className="mt-3">
                    Your trust is important to us, and we continue to monitor and improve security and compliance during this phase.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* Scope */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Scope</h3>
                  <p className="mb-3">This Policy applies to all data subjects interacting with the Platform, including but not limited to:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Individual users</li>
                    <li>Organizations and teams</li>
                    <li>AI agent developers</li>
                    <li>Marketplace sellers and buyers</li>
                    <li>Affiliates</li>
                    <li>End users interacting with hosted AI interfaces</li>
                    <li>Contractors, support agents, or partners</li>
                  </ul>
                  <p className="mt-3">We comply with:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>GDPR (EU/EEA)</li>
                    <li>CCPA / CPRA (California)</li>
                    <li>UK DPA</li>
                    <li>PIPEDA (Canada)</li>
                    <li>LGPD (Brazil)</li>
                    <li>APPI (Japan)</li>
                    <li>HIPAA (if applicable for client data)</li>
                    <li>ePrivacy, SCC, and US Federal/State Law</li>
                  </ul>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* Data We Collect */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Data We Collect</h3>

                  <h4 className="text-lg font-medium text-blue-400 mb-2">A. Directly Provided</h4>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    <li><strong>Account data:</strong> Name, email, hashed password, organization name, workspace metadata, roles, preferences</li>
                    <li><strong>Marketplace:</strong> Seller listings, payment preferences, licenses, custom terms, purchase history</li>
                    <li><strong>Affiliate system:</strong> Referral metadata, commissions, payment credentials via Stripe/Lemon Squeezy</li>
                    <li><strong>Feedback:</strong> Bug reports, user research, chat transcripts</li>
                    <li><strong>Uploaded content:</strong> Code, files, prompts, images, video, AI training data (opt-in only)</li>
                  </ul>

                  <h4 className="text-lg font-medium text-blue-400 mb-2">B. Automatically Collected</h4>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    <li><strong>Telemetry:</strong> Click activity, execution timing, agent output logs, AI usage volume</li>
                    <li>IP address, device identifiers, browser types, session tokens, timezone, regional headers</li>
                    <li><strong>Cookies:</strong> Session auth, analytics identifiers, experiment participation</li>
                    <li>Error reports, crash dumps, rate-limited abuse patterns</li>
                  </ul>

                  <h4 className="text-lg font-medium text-blue-400 mb-2">C. Third-Party Integration Data</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>OAuth (Google)</li>
                    <li>Stripe (billing + payouts)</li>
                    <li>Lemon Squeezy (affiliate tracking)</li>
                    <li>Courier (email delivery)</li>
                    <li>Analytics/Monitoring Services (e.g., Sentry, Posthog, Datadog)</li>
                  </ul>
                  <p className="mt-3">
                    We never receive or store: full payment card data (handled by Stripe) or OAuth passwords (handled directly by Google).
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* AI System Data Handling */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">AI System Data Handling</h3>

                  <h4 className="text-lg font-medium text-blue-400 mb-2">A. Helper AI</h4>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Used for in-dashboard assistance only</li>
                    <li>Operates under strict RBAC role boundaries</li>
                    <li>Cannot view, transmit, or act on sensitive workspace data</li>
                    <li>Logs interactions for context retention and analytics</li>
                    <li>Cannot initiate deletion, financial actions, or external calls</li>
                  </ul>

                  <h4 className="text-lg font-medium text-blue-400 mb-2">B. Create AI</h4>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Generates AI agent code based on user prompts</li>
                    <li>All prompts, drafts, and final code are tied to the workspace and visible only to authorized roles</li>
                    <li>AI output is sandboxed; you are responsible for reviewing output before deployment</li>
                    <li>Logs are stored for security, debug, and audit purposes</li>
                    <li>Malicious, illegal, or policy-violating prompts will result in access suspension</li>
                  </ul>

                  <h4 className="text-lg font-medium text-blue-400 mb-2">C. AI Data Safeguards</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Logs expire after 30–90 days unless extended for legitimate business needs</li>
                    <li>Model outputs are not used for public training</li>
                    <li>Internal audits are conducted to prevent prompt injection, prompt leakage, or embedded backdoors</li>
                    <li>You must not upload or prompt AI to process any PII you don’t own or have legal permission to submit</li>
                  </ul>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* Legal Bases */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Legal Bases for Processing</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-600">
                      <thead>
                        <tr className="bg-gray-800">
                          <th className="border border-gray-600 px-4 py-2 text-left">Legal Basis</th>
                          <th className="border border-gray-600 px-4 py-2 text-left">Purpose</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Contractual Necessity</td>
                          <td className="border border-gray-600 px-4 py-2">Account creation, marketplace, affiliate commissions, AI usage</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Legitimate Interests</td>
                          <td className="border border-gray-600 px-4 py-2">System health, fraud prevention, internal analytics, platform improvement</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Legal Obligation</td>
                          <td className="border border-gray-600 px-4 py-2">Compliance with subpoenas, data audits, regulatory oversight</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Consent</td>
                          <td className="border border-gray-600 px-4 py-2">Cookies, optional marketing, opt-in AI model feedback loops</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Vital Interests (Edge)</td>
                          <td className="border border-gray-600 px-4 py-2">Emergency security actions, zero-day breach mitigation</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* How We Use Data */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">How We Use Data</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Provide, personalize, and improve the Platform</li>
                    <li>Deliver real-time AI, agent management, and metric analytics</li>
                    <li>Monitor system abuse, prompt violations, and usage spikes</li>
                    <li>Fulfill billing, payouts, subscriptions, and affiliate payments</li>
                    <li>Respond to user support, bug reports, abuse flags</li>
                    <li>Detect malicious behavior, collusion, fake accounts, or prompt exfiltration attempts</li>
                    <li>Ensure compliance with Terms of Service and legal frameworks</li>
                  </ul>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* Sharing & Disclosure */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Data Sharing & Disclosure</h3>
                  <p className="mb-3">We never sell user data. We only share information:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>With subprocessors under strict DPA agreements (e.g., Stripe, Courier, Vercel)</li>
                    <li>With legal authorities if required by subpoena, warrant, or data breach notification laws</li>
                    <li>With authorized workspace members according to RBAC enforcement</li>
                    <li>With affiliated agents or partners only for operational fulfillment, never for cross-marketing</li>
                  </ul>
                  <p className="mt-3">Any disclosure required by law will be reviewed by counsel before action.</p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* Security */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Security & Safeguards</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Data-at-rest and data-in-transit encryption (AES-256 / TLS 1.3)</li>
                    <li>Agent sandboxing and read/write isolation</li>
                    <li>Workspace boundary enforcement</li>
                    <li>Role-based access control with session hardening</li>
                    <li>Automatic IP throttling, brute-force rate limits, and prompt abuse detectors</li>
                    <li>Background virus scanning for file uploads</li>
                    <li>SOC 2-aligned hosting infrastructure</li>
                    <li>Disaster recovery & incident response protocols</li>
                  </ul>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* Breach Notification */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Breach Notification & Risk Disclosure</h3>
                  <p className="mb-3">In the event of:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Any unauthorized access to your data</li>
                    <li>AI system compromise or model leakage</li>
                    <li>Successful zero-day attack or supply chain compromise</li>
                  </ul>
                  <p className="mt-3">We will:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Notify affected users within 72 hours (or sooner per regulation)</li>
                    <li>Cooperate with authorities and forensic partners</li>
                    <li>Provide full disclosure of scope, affected data, and remediation actions</li>
                  </ul>
                  <p className="mt-3">We log all access and maintain audit trails.</p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* Rights */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Your Rights</h3>

                  <h4 className="text-lg font-medium text-blue-400 mb-2">A. EU / UK (GDPR/DPA)</h4>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Access, rectification, erasure, objection, portability, restriction</li>
                    <li>Lodge complaint with data authority (e.g., ICO)</li>
                  </ul>

                  <h4 className="text-lg font-medium text-blue-400 mb-2">B. California (CCPA / CPRA)</h4>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Right to know, delete, correct</li>
                    <li>Right to opt-out of sale (we don’t sell)</li>
                    <li>Right to limit sensitive data use (applied by default)</li>
                    <li>Right to equal service and pricing</li>
                  </ul>

                  <h4 className="text-lg font-medium text-blue-400 mb-2">C. Other Regions</h4>
                  <p>
                    We honor regional rights and privacy requests globally. <br />
                    📩 To request: Email <a href="mailto:admin@control-room.ai" className="text-blue-400 hover:text-blue-300">admin@control-room.ai</a> from your account email with verification.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* Retention */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Data Retention</h3>
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
                          <td className="border border-gray-600 px-4 py-2">Active user account</td>
                          <td className="border border-gray-600 px-4 py-2">Until deleted by user</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Billing & affiliate history</td>
                          <td className="border border-gray-600 px-4 py-2">7 years (for compliance)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">AI logs and telemetry</td>
                          <td className="border border-gray-600 px-4 py-2">30–90 days (unless needed for audit/debug)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Workspace data</td>
                          <td className="border border-gray-600 px-4 py-2">30 days post-deletion unless preserved by contract</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-600 px-4 py-2">Abuse reports and audit trails</td>
                          <td className="border border-gray-600 px-4 py-2">Minimum 2 years or until legally expired</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* Staff & Vendors */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Employee, Contractor & Vendor Controls</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Must sign confidentiality and data protection agreements</li>
                    <li>Undergo training in privacy & AI ethics</li>
                    <li>Are role-restricted based on least privilege</li>
                    <li>Are monitored and logged for all access to production systems</li>
                    <li>Are prohibited from using live data for development without explicit approval</li>
                  </ul>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* Children */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Children</h3>
                  <p>
                    We do not knowingly allow access to users under age 18. If discovered, all data will be deleted immediately, and the account suspended.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* Data Transfers */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Data Transfers</h3>
                  <p className="mb-3">We host and process data primarily in the U.S., with global redundancy. Cross-border transfers follow:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Standard Contractual Clauses (SCC)</li>
                    <li>Adequacy decisions (for EEA transfers)</li>
                    <li>Regional compliance (e.g., India, UAE, Brazil)</li>
                  </ul>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* AI Risks & Consent */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">AI-Specific Risks & Consent</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You acknowledge that all AI output is probabilistic and may hallucinate or err.</li>
                    <li>You are solely responsible for reviewing AI-generated agents before deploying.</li>
                    <li>We are not liable for damages caused by user-submitted AI prompts, malicious uploads, or misuse of agents generated via our platform.</li>
                    <li>Use of AI services constitutes consent to such outputs and risks, which are non-deterministic by nature.</li>
                  </ul>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* Policy Changes */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Policy Changes</h3>
                  <p className="mb-2">
                    We may revise this Policy to reflect feature expansions, regulatory updates, or infrastructure changes. If material changes occur, we will:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Post notice at Intel</li>
                    <li>Email all affected users at least 14 days in advance</li>
                  </ul>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-600 pt-6" />

                {/* Contact */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Contact</h3>
                  <p>
                    📧 <a href="mailto:admin@control-room.ai" className="text-blue-400 hover:text-blue-300">admin@control-room.ai</a>
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