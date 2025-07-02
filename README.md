# Control Room - AI Agent Governance & Monitoring System

A futuristic dark-ops styled AI Agent Governance & Monitoring System that allows companies to deploy, govern, and monitor AI agents securely with real-time performance tracking, policy automation, and marketplace integration.

## 🚀 Features

### Core Platform
- **Real-time Agent Monitoring** - Live dashboard with 5-second updates via Socket.io
- **Policy Automation** - Visual drag-and-drop policy builder using ReactFlow
- **Marketplace Integration** - Buy and sell AI agents with automatic payments
- **Role-Based Access Control** - Admin, Manager, Viewer, and Seller roles
- **Spending Controls** - Monthly caps, alerts, and auto-pause functionality
- **Custom Metrics** - Create and track custom performance indicators
- **Legal & Support Pages** - Privacy Policy, Terms of Service, Contact form, and Intel Knowledge Center

### Authentication & Security
- **NextAuth Integration** - Google OAuth and email/password authentication
- **JWT Sessions** - Secure session management with middleware protection
- **Route Protection** - Automatic redirects and role-based access control

### Billing & Payments
- **Stripe Integration** - Complete checkout flow for plans and marketplace
- **Subscription Management** - Free, Pro ($99/mo), Enterprise ($499/mo) plans
- **Marketplace Payments** - Automatic payouts for agent sellers

### UI/UX
- **Dark Military Theme** - Command center aesthetic with professional design
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Real-time Updates** - Live data visualization and notifications

## 📋 Prerequisites

Before running Control Room, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** 
- **PostgreSQL** (v13 or higher)
- **Redis** (optional, for rate limiting)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/trycontrolroom/control-room.git
cd control-room
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
The project includes a pre-configured `.env.local` file with all necessary environment variables:

```env
DATABASE_URL="postgresql://localhost:5432/controlroomdb"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="g9LJTLY19b+maVOHHNkhE24nocGnj/WuldGGX7zkJ/Y="
GOOGLE_CLIENT_ID="1072880026888-rsngbqseve98hr2c924gh9plh7ac96lk.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51RfAYuFZ6Bz0PROqh5LuKrmJPng91ZvoV6admG73YfcF1pjN6t4M6jWfa2X3AaFLGgIUMyRSsLyo5Jr1Kiemm1yP00hCRztScx"
STRIPE_SECRET_KEY="sk_test_51RfAYuFZ6Bz0PROqPFHynp5MSehKAUHEvUKRFxXKUmf1cZOYTDJkmpjHMW3JM3XYVhxkA6XjnqxDbgCsZHito3xC00w6jPRoTx"
REDIS_URL="redis://localhost:6379"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
```

### 4. Database Setup
```bash
# Start PostgreSQL service (varies by OS)
# Ubuntu/Debian:
sudo service postgresql start

# macOS with Homebrew:
brew services start postgresql

# Create database
createdb controlroomdb

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Optional: Seed database with sample data
npx prisma db seed
```

### 5. Start the Application

#### Terminal 1 - Socket.io Server
```bash
cd socket-server
node index.js
```

#### Terminal 2 - Next.js Application
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Socket.io Server**: http://localhost:3001

## 🌐 Deployment

### Vercel Deployment

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial Control Room deployment"
git push origin main
```

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Database Setup**:
   - Use a managed PostgreSQL service (Supabase, PlanetScale, etc.)
   - Update `DATABASE_URL` in Vercel environment variables
   - Run `npx prisma db push` after deployment

### Environment Variables for Production
Update these variables in your production environment:
- `DATABASE_URL` - Your production PostgreSQL connection string
- `NEXTAUTH_URL` - Your production domain (e.g., https://control-room.ai)
- `NEXT_PUBLIC_SOCKET_URL` - Your production Socket.io server URL

## 📁 Project Structure

```
control-room/
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # Dashboard pages
│   │   ├── page.tsx            # Main dashboard
│   │   ├── stats/              # Analytics page
│   │   ├── policies/           # Policy builder
│   │   └── settings/           # User settings
│   ├── admin/                  # Admin panel
│   ├── marketplace/            # Agent marketplace
│   ├── pricing/                # Pricing page
│   ├── login/                  # Authentication
│   ├── signup/                 # User registration
│   ├── checkout/               # Stripe checkout flow
│   ├── privacy/                # Privacy Policy page
│   ├── terms/                  # Terms of Service page
│   ├── contact/                # Contact form and support
│   ├── intel/                  # Intel Knowledge Center
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── contact/            # Contact form submission
│   │   └── ...                 # Other API endpoints
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/                  # Reusable React components
│   ├── ui/                     # UI component library
│   ├── navigation.tsx          # Navigation component
│   ├── footer.tsx              # Footer component
│   ├── providers.tsx           # Context providers
│   └── socket-provider.tsx     # Socket.io provider
├── prisma/                     # Database schema and migrations
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeding
├── socket-server/              # Socket.io server
│   └── index.js                # Real-time server
├── lib/                        # Utility libraries
├── types/                      # TypeScript type definitions
├── middleware.ts               # Authentication middleware
├── .env.local                  # Environment variables
└── package.json                # Dependencies and scripts
```

## 🎯 Usage

### Getting Started
1. **Sign Up**: Create an account using Google OAuth or email/password
2. **Choose Plan**: Select Free, Pro, or Enterprise plan based on your needs
3. **Add Agents**: Connect your AI agents to the monitoring system
4. **Set Policies**: Create automated rules using the visual policy builder
5. **Monitor**: Track performance, costs, and metrics in real-time

### Key Features

#### Dashboard
- View all connected agents with real-time status
- Monitor uptime, error rates, and performance metrics
- Control agents (pause, restart, view logs)

#### Policy Builder
- Drag-and-drop interface for creating automation rules
- Triggers: Agent errors, cost thresholds, performance issues
- Actions: Pause agents, send alerts, scale resources

#### Marketplace
- Browse and purchase pre-built AI agents
- Sell your own agents and receive automatic payouts
- Rate and review agents from the community

#### Analytics
- Detailed performance charts and graphs
- Custom metric tracking and visualization
- Cost analysis and spending forecasts

## 🔧 Configuration

### Custom Metrics
Add custom metrics in the dashboard:
1. Go to Dashboard → Stats
2. Click "Add Custom Metric"
3. Define name, unit, and calculation formula
4. Save and view in real-time charts

### Spending Controls
Set up spending limits:
1. Go to Dashboard → Settings
2. Configure monthly caps per agent
3. Set alert thresholds (80%, 100%)
4. Enable auto-pause on breach

### Notifications
Configure alerts:
1. Go to Dashboard → Settings → Notifications
2. Add Slack webhook, email, or SMS
3. Choose notification triggers
4. Test notification delivery

## 🛡️ Security

- **Authentication**: Secure JWT-based sessions with NextAuth
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Environment variables for sensitive data
- **API Security**: Protected routes with middleware validation
- **Payment Security**: PCI-compliant Stripe integration

## 🤝 Support

For support and questions:
- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Community**: Join our Discord for community support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🚀 What's Next

Control Room is ready for production use with all core features implemented:
- ✅ Complete authentication and authorization system
- ✅ Real-time agent monitoring with Socket.io
- ✅ Visual policy builder with ReactFlow
- ✅ Full marketplace with Stripe integration
- ✅ Responsive dark military-grade UI
- ✅ Role-based access control
- ✅ Custom metrics and analytics
- ✅ Spending controls and notifications

The platform is plug-and-play ready for immediate deployment and commercial use.
