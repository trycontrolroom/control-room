Control Room - AI Agent Creation, Governance & Monitoring System

A futuristic, modern,  minimalistic styled AI Agent Creation, Governance & Monitoring System that is a command-center for creating, deploying, governing, and monitoring AI agents securely—featuring real-time performance tracking, policy automation, marketplace integration, and built-in AI assistants.

🚀 Features 

Core Platform
	•	Create AI: Describe the agent you need in plain English; generate, preview, and deploy a complete, editable agent bundle.
	•	Helper AI: In-dashboard assistant offering Explain and Action modes for guided setup and troubleshooting.
	•	Real-time Agent Monitoring: Live dashboard with 5-second updates via Socket.io.
	•	Policy Automation: Visual drag-and-drop policy builder using ReactFlow for guardrails and budget controls.
	•	Custom Metrics & Monitoring: Track latency, errors, cost, and your own KPIs across all agents, whether built here or imported.
	•	Manage Tasks: Schedule, pause/resume, and audit every agent execution with detailed logs.
	•	Marketplace Integration: Browse, deploy, buy, and sell AI agents—80/20 revenue split, automatic payouts via Stripe.
	•	Role-Based Access Control: Admin, Manager, Viewer, and Seller roles with workspace isolation.

AI Assistants
	•	Create AI: Smart agent generation, multi-file code, versioned bundles, one-click deploy.
	•	Helper AI: Context-aware guidance, security-aware actions, never oversteps your permissions.

Affiliate Program
	•	50% Lifetime Commission: Earn on every referral, monthly payouts, track in dashboard.
	•	Transparent Terms: Simple requirements, clear reporting, no surprises.

Legal & Support
	•	Privacy Policy & Terms: In-app pages with up-to-date compliance.
	•	Intel Knowledge Center: Quick-start guides, video walkthroughs, full documentation, community & support, platform updates.
   •  Affiliate agreement
   •  Marketplace buyers and sellers agreement
   
🛠️ Prerequisites
	•	Node.js v18+ and npm / pnpm
	•	PostgreSQL v13+ (create and seed controlroomdb)
	•	Redis (optional, for rate limiting and caching)

🔧 Installation
	1.	Clone the repo

git clone https://github.com/trycontrolroom/control-room.git
cd control-room

2. **Install dependencies**
   ```bash
npm ci

	3.	Environment
Copy .env.local.example to .env.local and fill in your connection strings, secrets, and keys.
	4.	Database

npm run db:generate
npm run db:push
npm run db:seed  # optional sample data

5. **Start Services**
   - **Socket.io server**: `cd socket-server && node index.js`
   - **Next.js app**: `npm run dev`

App is at http://localhost:3000, realtime API at http://localhost:3001.

## 📁 Project Structure

control-room/
├── app/                # Next.js pages & API
├── components/         # Reusable UI & logic
├── prisma/             # Schema & migrations
├── socket-server/      # Realtime server code
├── lib/                # Utilities
├── types/              # TypeScript definitions
├── middleware.ts       # Auth & route protection
├── .env.local          # Local env vars
└── package.json        # Scripts & dependencies

## 🎯 Usage
1. **Sign Up**: Email/password or Google OAuth
2. **Choose Plan**: Starter, Pro, Enterprise
3. **Add Agents**: Use Create AI or import existing
4. **Set Policies**: Create automation rules with drag-and-drop
5. **Monitor & Manage**: Live status, logs, metrics, and tasks
6. **Explore Marketplace**: Deploy pre-built agents or list your own

## 🛡️ Security
- **NextAuth**: Secure sessions, Google OAuth
- **JWT & Middleware**: Route protection, RBAC
- **Encryption**: TLS in transit; AES-256 at rest

## 🤝 Support
- **Helper AI**: Ai which can help explain everything control room to users.
- **Docs & Guides**: Inline code comments and README
- **Intel Page**: Check out our intel page.
