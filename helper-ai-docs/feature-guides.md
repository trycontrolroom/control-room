# Control Room Feature Guides

This document equips the Helper AI with clear, complete reference points for each major feature of the Control Room platform. These guides are structured to ensure the AI can confidently explain features, guide usage, and help troubleshoot (without accessing sensitive data).

---

## 🧠 1. Dashboard Overview
- Displays summary of key metrics, agent statuses, and alerts.
- Persistent AI Helper button (bottom-right) for user support.
- Clicking any dashboard item opens its detailed view (agent, metric, task, etc).
- Viewer role can view all data, but cannot perform actions.

---

## 🧩 2. Manage Tab
- Core hub for managing agents, tasks, metrics, and logs.
- Sections include:
  - **Agents** – Edit, delete, restart, or redeploy
  - **Custom Tasks** – Logic-based actions triggered by policies or manually
  - **Custom Metrics** – Defined by users to monitor agent behavior
  - **Logs** – Track activity, errors, and audit trails
- Only `Admin` and `Manager` roles can modify items.

---

## 🕹️ 3. Create Tab
- Allows users to build new AI agents using the Create AI assistant.
- Features:
  - Prompt bar for natural language input
  - Live chat flow with clarification questions
  - Generated agent preview and file viewer
  - Downloadable agent package
  - Option to “Deploy” (if authorized)
- Only `Admin` and `Manager` roles can deploy or finalize agents.

---

## 📜 4. Policy Builder
- Visual no-code interface using React Flow to create agent governance rules.
- Users can:
  - Determine triggers, conditions, and actions
  - Define things like: “If Agent Fails 3x, alert Admin”
  - Assign policies to specific agents or workspace-level rules
- Policies run in real-time and can auto-trigger notifications or tasks.
- Helper AI can guide creation and offer optimization tips.
- `Admin` or `Manager` required to publish or edit.

---

## 📊 5. Custom Metrics
- Define metrics to track usage, risk, or performance:
  - Examples: API calls per minute, last success timestamp, memory usage
- Metrics can:
  - Be visualized on the dashboard
  - Be used as policy conditions
- Users specify name, type (number/string/status), and source (agent, task, etc).
- Only `Admin` or `Manager` may create/edit metrics.

---

## ✅ 6. Custom Tasks
- Repeatable automated actions users can define.
- Examples:
  - Restart agent
  - Clear cache
  - Send summary email
- Tasks can be triggered manually or via policies.
- Fully configurable: execution logic, environment, input/output.
- Task templates may be offered in future versions.

---

## 💼 7. Workspaces
- All user activity is scoped to a specific workspace.
- Features and data do **not** cross between workspaces.
- Roles (Admin, Manager, Viewer) are assigned per workspace.
- Switching workspaces refreshes the UI and permissions.
- Helper AI must respect role/workspace boundaries.

---

## 🔐 8. RBAC (Roles & Permissions)
- Users have one of three roles per workspace:
  - `Admin` – Full access to all features
  - `Manager` – Can perform all actions within a workspace **except** workspace-level or role management. This includes creating/editing agents, tasks, policies, metrics, logs, and settings that do not affect access control.
  - `Viewer` – Read-only access; cannot deploy, edit, or delete
- Helper AI must never violate these restrictions.
- If a user requests something outside their role:
  - Respond professionally and suggest sharing with a team lead.

---

## 💸 9. Billing (Settings > Billing)
- Users can:
  - View current plan (Beginner, Unlimited, Enterprise)
  - Upgrade/downgrade plans
  - Update payment method (via Stripe)
  - View/download invoices
- Helper AI cannot access payment data.
- If asked about pricing or plan features, explain them and link to pricing page.

---

## 👥 10. Affiliate Dashboard (Settings > Affiliate)
- Available to users who signed up via public affiliate entry.
- Shows:
  - Clicks
  - Referrals
  - Commission earned
  - Payout status
- Payouts handled through Stripe.
- Auto-enrolled if user signs up with a referral link.

---

## 🔔 11. Notifications (Settings > Notifications)
- Alerts users of:
  - Agent crashes
  - Policy rule triggers
  - Threshold breaches
- Notifications can be:
  - Email
  - In-app popup
  - (Future) Slack or Webhook
- Configurable per policy or agent.

---

## 📂 12. Logs & Troubleshooting
- All important system events are logged.
- Types of logs:
  - Agent lifecycle (start/stop/fail)
  - Policy triggers
  - User actions (edit, delete, deploy)
- Found in the Manage tab > Logs section.
- Helper AI may help interpret logs **with user permission**, but must never access automatically.

---

## 📌 Helper AI Notes
- May explain any of these features in “Explain Mode”
- May **create** policies, tasks, or metrics in “Action Mode” (after user confirmation)
- Must always guide the user clearly, respect roles, and redirect to the Contact Page if unsure