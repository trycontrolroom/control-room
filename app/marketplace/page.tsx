'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GlassPanel } from '@/components/ui/glass-panel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  DollarSign, 
  Plus,
  ShoppingCart,
  Eye,
  TrendingUp,
  Users,
  Bot
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

interface MarketplaceAgent {
  id: string
  name: string
  description: string
  price: number
  category: string
  rating: number
  reviewCount: number
  installCount: number
  image: string
  author: string
  tags: string[]
  isFree: boolean
  isInstalled?: boolean
}

const categories = [
  'All Categories',
  'Customer Service',
  'Data Analysis',
  'Content Creation',
  'Sales & Marketing',
  'Development',
  'Finance',
  'HR & Recruiting'
]

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' }
]

export default function MarketplacePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [agents, setAgents] = useState<MarketplaceAgent[]>([])
  const [filteredAgents, setFilteredAgents] = useState<MarketplaceAgent[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [sortBy, setSortBy] = useState('popular')
  const [priceFilter, setPriceFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMarketplaceAgents()
  }, [])

  useEffect(() => {
    filterAndSortAgents()
  }, [agents, searchQuery, selectedCategory, sortBy, priceFilter])

  const fetchMarketplaceAgents = async () => {
    try {
      const response = await fetch('/api/marketplace')
      if (response.ok) {
        const data = await response.json()
        setAgents(data)
      }
    } catch (error) {
      console.error('Failed to fetch marketplace agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortAgents = () => {
    let filtered = [...agents]

    if (searchQuery) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (agent.tags && agent.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    }

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(agent => agent.category === selectedCategory)
    }

    if (priceFilter === 'free') {
      filtered = filtered.filter(agent => agent.isFree)
    } else if (priceFilter === 'paid') {
      filtered = filtered.filter(agent => !agent.isFree)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'price_low':
          return a.price - b.price
        case 'price_high':
          return b.price - a.price
        case 'newest':
          return new Date(b.id).getTime() - new Date(a.id).getTime()
        case 'popular':
        default:
          return (b.installCount || 0) - (a.installCount || 0)
      }
    })

    setFilteredAgents(filtered)
  }

  const handleInstallAgent = async (agentId: string, price: number) => {
    if (!session) {
      router.push('/login')
      return
    }

    if (price > 0) {
      router.push(`/checkout?type=agent&id=${agentId}`)
    } else {
      try {
        const response = await fetch(`/api/marketplace/${agentId}/install`, {
          method: 'POST'
        })
        if (response.ok) {
          fetchMarketplaceAgents()
        }
      } catch (error) {
        console.error('Failed to install agent:', error)
      }
    }
  }

  const canSellAgents = session?.user?.role === 'SELLER' || session?.user?.role === 'ADMIN'

  if (loading) {
    return (
      <div className="page">
        <div className="bg-gradient" />
        <div className="bg-vignette" />
        <div className="bg-aurora" />
        <Navigation />
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
        <style jsx>{`
          .page {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
          }
          .bg-gradient {
            position: fixed;
            inset: 0;
            background: 
              radial-gradient(1200px 600px at 50% -10%, rgba(110,104,220,.12), transparent 60%),
              radial-gradient(900px 520px at 72% 120%, rgba(60,80,220,.08), transparent 60%);
            pointer-events: none;
            z-index: -3;
          }
          .bg-vignette {
            position: fixed;
            inset: -1px;
            background: radial-gradient(160% 110% at 50% 0%, transparent 50%, rgba(0,0,0,.35) 90%);
            pointer-events: none;
            z-index: -2;
          }
          .bg-aurora {
            position: fixed;
            inset: 0;
            background: 
              radial-gradient(50% 40% at 20% 20%, rgba(130,120,255,.07), transparent 60%),
              radial-gradient(40% 35% at 80% 85%, rgba(80,120,255,.06), transparent 60%);
            filter: blur(40px);
            pointer-events: none;
            z-index: -1;
            animation: drift 20s ease-in-out infinite alternate;
          }
          @keyframes drift {
            from { transform: rotate(-10deg) scale(1.1); }
            to { transform: rotate(10deg) scale(1.2); }
          }
          .loading-container {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 16rem;
            padding-top: 8rem;
          }
          .loading-spinner {
            width: 2rem;
            height: 2rem;
            border: 2px solid transparent;
            border-top: 2px solid #4F6AFF;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="bg-gradient" />
      <div className="bg-vignette" />
      <div className="bg-aurora" />
      <Navigation />
      
      <div className="marketplace-container">
        <div className="marketplace-header">
          <div className="header-content">
            <h1 className="page-title">Agent Marketplace</h1>
            <p className="page-subtitle">
              Discover and deploy AI agents built by the community
            </p>
          </div>
          
          {canSellAgents && (
            <Link href="/marketplace/sell">
              <Button className="sell-button">
                <Plus className="button-icon" />
                Sell Agent
              </Button>
            </Link>
          )}
        </div>

        <div className="stats-grid">
          <Card className="stat-card blue">
            <CardContent className="stat-content">
              <div className="stat-item">
                <Bot className="stat-icon blue" />
                <div className="stat-info">
                  <p className="stat-label">Total Agents</p>
                  <p className="stat-value">{agents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card green">
            <CardContent className="stat-content">
              <div className="stat-item">
                <Download className="stat-icon green" />
                <div className="stat-info">
                  <p className="stat-label">Total Installs</p>
                  <p className="stat-value">
                    {agents.reduce((sum, agent) => sum + (agent.installCount || 0), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card purple">
            <CardContent className="stat-content">
              <div className="stat-item">
                <Users className="stat-icon purple" />
                <div className="stat-info">
                  <p className="stat-label">Active Sellers</p>
                  <p className="stat-value">
                    {new Set(agents.map(a => a.author)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card yellow">
            <CardContent className="stat-content">
              <div className="stat-item">
                <Star className="stat-icon yellow" />
                <div className="stat-info">
                  <p className="stat-label">Avg Rating</p>
                  <p className="stat-value">
                    {(agents.reduce((sum, agent) => sum + agent.rating, 0) / agents.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="filters-card">
          <CardContent className="filters-content">
            <div className="filters-grid">
              <div className="search-wrapper">
                <div className="search-container">
                  <Search className="search-icon" />
                  <Input
                    placeholder="Search agents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="filter-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="filter-select price">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="filter-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="agents-grid">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="agent-card">
              <CardHeader className="agent-header">
                <div className="agent-header-content">
                  <div className="agent-info">
                    <CardTitle className="agent-name">
                      {agent.name}
                    </CardTitle>
                    <p className="agent-author">by {agent.author}</p>
                    <Badge className="category-badge">
                      {agent.category}
                    </Badge>
                  </div>
                  <div className="agent-price">
                    {agent.isFree ? (
                      <Badge className="free-badge">
                        Free
                      </Badge>
                    ) : (
                      <div className="price-amount">
                        ${agent.price}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="agent-content">
                <CardDescription className="agent-description">
                  {agent.description}
                </CardDescription>

                <div className="agent-tags">
                  {agent.tags && agent.tags.slice(0, 3).map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="tag-badge"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {agent.tags && agent.tags.length > 3 && (
                    <Badge variant="outline" className="tag-badge">
                      +{agent.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="agent-stats">
                  <div className="rating-stats">
                    <Star className="rating-star" />
                    <span className="rating-value">{agent.rating.toFixed(1)}</span>
                    <span className="rating-count">({agent.reviewCount})</span>
                  </div>
                  <div className="install-stats">
                    <Download className="install-icon" />
                    <span className="install-count">{(agent.installCount || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="agent-actions">
                  <Link href={`/marketplace/${agent.id}`} className="view-link">
                    <Button variant="outline" size="sm" className="view-button">
                      <Eye className="button-icon" />
                      View Details
                    </Button>
                  </Link>
                  
                  {agent.isInstalled ? (
                    <Button size="sm" disabled className="installed-button">
                      Installed
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => handleInstallAgent(agent.id, agent.price)}
                      className="install-button"
                    >
                      {agent.isFree ? (
                        <>
                          <Download className="button-icon" />
                          Install
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="button-icon" />
                          Buy
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <Card className="empty-state-card">
            <CardContent className="empty-state-content">
              <Bot className="empty-icon" />
              <h3 className="empty-title">No Agents Found</h3>
              <p className="empty-message">
                Try adjusting your search criteria or browse different categories.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All Categories')
                  setPriceFilter('all')
                }}
                variant="outline"
                className="clear-button"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />

      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .bg-gradient {
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(1200px 600px at 50% -10%, rgba(110,104,220,.12), transparent 60%),
            radial-gradient(900px 520px at 72% 120%, rgba(60,80,220,.08), transparent 60%);
          pointer-events: none;
          z-index: -3;
        }

        .bg-vignette {
          position: fixed;
          inset: -1px;
          background: radial-gradient(160% 110% at 50% 0%, transparent 50%, rgba(0,0,0,.35) 90%);
          pointer-events: none;
          z-index: -2;
        }

        .bg-aurora {
          position: fixed;
          inset: 0;
          background: 
            radial-gradient(50% 40% at 20% 20%, rgba(130,120,255,.07), transparent 60%),
            radial-gradient(40% 35% at 80% 85%, rgba(80,120,255,.06), transparent 60%);
          filter: blur(40px);
          pointer-events: none;
          z-index: -1;
          animation: drift 20s ease-in-out infinite alternate;
        }

        @keyframes drift {
          from { transform: rotate(-10deg) scale(1.1); }
          to { transform: rotate(10deg) scale(1.2); }
        }

        .marketplace-container {
          padding: 8rem 2rem 5rem;
          max-width: 112rem;
          margin: 0 auto;
          width: 100%;
        }

        .marketplace-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .header-content {
          flex: 1;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
          letter-spacing: -0.025em;
        }

        .page-subtitle {
          color: #8a96ad;
          font-size: 1.125rem;
        }

        .sell-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          height: 3rem;
          background: linear-gradient(135deg, #8A7FFF, #4F6AFF);
          border: none;
          border-radius: 14px;
          color: #FFFFFF;
          font-size: 1rem;
          font-weight: 600;
          padding: 0 1.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 12px 30px rgba(79,106,255,.32);
          text-decoration: none;
        }

        .sell-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 40px rgba(79,106,255,.4);
        }

        .button-icon {
          width: 1rem;
          height: 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stat-card {
          background: linear-gradient(180deg, rgba(14,20,36,.85), rgba(10,14,26,.98));
          border-radius: 24px;
          box-shadow: 0 34px 90px rgba(0,0,0,.55), 0 6px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06);
          backdrop-filter: blur(24px);
        }

        .stat-card.blue {
          border: 1px solid rgba(79, 106, 255, 0.2);
        }

        .stat-card.green {
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .stat-card.purple {
          border: 1px solid rgba(147, 51, 234, 0.2);
        }

        .stat-card.yellow {
          border: 1px solid rgba(251, 191, 36, 0.2);
        }

        .stat-content {
          padding: 1.5rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .stat-icon.blue {
          color: #4F6AFF;
        }

        .stat-icon.green {
          color: #22c55e;
        }

        .stat-icon.purple {
          color: #9333ea;
        }

        .stat-icon.yellow {
          color: #fbbf24;
        }

        .stat-info {
          flex: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #8a96ad;
          margin: 0;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
        }

        .filters-card {
          background: linear-gradient(180deg, rgba(14,20,36,.85), rgba(10,14,26,.98));
          border: 1px solid rgba(107, 114, 128, 0.2);
          border-radius: 24px;
          box-shadow: 0 34px 90px rgba(0,0,0,.55), 0 6px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06);
          backdrop-filter: blur(24px);
          margin-bottom: 2rem;
        }

        .filters-content {
          padding: 1.5rem;
        }

        .filters-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .search-wrapper {
          flex: 1;
          min-width: 16rem;
        }

        .search-container {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1rem;
          height: 1rem;
          color: #8a96ad;
        }

        .search-input {
          width: 100%;
          height: 3rem;
          background: rgba(8,12,22,.95);
          border: 1px solid rgba(175,190,255,.18);
          border-radius: 14px;
          padding: 0 1rem 0 2.5rem;
          color: #eaf0ff;
          font-size: 1rem;
          transition: all 0.18s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: rgba(200,214,255,.44);
          box-shadow: 0 0 0 4px rgba(79,106,255,.10);
        }

        .search-input::placeholder {
          color: #8a96ad;
        }

        .filter-select {
          width: 12rem;
          height: 3rem;
          background: rgba(8,12,22,.95);
          border: 1px solid rgba(175,190,255,.18);
          border-radius: 14px;
          color: #eaf0ff;
          font-size: 1rem;
          transition: all 0.18s ease;
        }

        .filter-select.price {
          width: 8rem;
        }

        .filter-select:focus {
          outline: none;
          border-color: rgba(200,214,255,.44);
          box-shadow: 0 0 0 4px rgba(79,106,255,.10);
        }

        .agents-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .agents-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .agents-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .agent-card {
          background: linear-gradient(180deg, rgba(14,20,36,.85), rgba(10,14,26,.98));
          border: 1px solid rgba(79, 106, 255, 0.2);
          border-radius: 24px;
          box-shadow: 0 34px 90px rgba(0,0,0,.55), 0 6px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06);
          backdrop-filter: blur(24px);
          transition: all 0.2s ease;
        }

        .agent-card:hover {
          border-color: rgba(79, 106, 255, 0.4);
          transform: translateY(-2px);
        }

        .agent-header {
          padding-bottom: 0.75rem;
        }

        .agent-header-content {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .agent-info {
          flex: 1;
        }

        .agent-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 0.25rem;
        }

        .agent-author {
          font-size: 0.875rem;
          color: #8a96ad;
          margin-bottom: 0.5rem;
        }

        .category-badge {
          background: rgba(79, 106, 255, 0.1);
          color: #4F6AFF;
          border: 1px solid rgba(79, 106, 255, 0.3);
          border-radius: 6px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .agent-price {
          text-align: right;
        }

        .free-badge {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 6px;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .price-amount {
          font-size: 1.125rem;
          font-weight: 800;
          color: #FFFFFF;
        }

        .agent-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .agent-description {
          color: #d1d5db;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .agent-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .tag-badge {
          font-size: 0.75rem;
          border: 1px solid rgba(107, 114, 128, 0.6);
          color: #8a96ad;
          background: transparent;
          border-radius: 4px;
          padding: 0.125rem 0.375rem;
        }

        .agent-stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #8a96ad;
        }

        .rating-stats {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .rating-star {
          width: 1rem;
          height: 1rem;
          color: #fbbf24;
          fill: currentColor;
        }

        .rating-value {
          color: #FFFFFF;
        }

        .rating-count {
          color: #8a96ad;
        }

        .install-stats {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .install-icon {
          width: 1rem;
          height: 1rem;
        }

        .install-count {
          color: #8a96ad;
        }

        .agent-actions {
          display: flex;
          gap: 0.5rem;
          padding-top: 0.5rem;
        }

        .view-link {
          flex: 1;
          text-decoration: none;
        }

        .view-button {
          width: 100%;
          background: rgba(8,12,22,.95);
          border: 1px solid rgba(107, 114, 128, 0.6);
          border-radius: 8px;
          color: #a3b3ff;
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .view-button:hover {
          background: rgba(107, 114, 128, 0.1);
          border-color: rgba(107, 114, 128, 0.8);
        }

        .installed-button {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 8px;
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
          cursor: not-allowed;
          opacity: 0.8;
        }

        .install-button {
          background: linear-gradient(135deg, #8A7FFF, #4F6AFF);
          border: none;
          border-radius: 8px;
          color: #FFFFFF;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(79,106,255,.25);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .install-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(79,106,255,.35);
        }

        .empty-state-card {
          background: linear-gradient(180deg, rgba(14,20,36,.85), rgba(10,14,26,.98));
          border: 1px solid rgba(107, 114, 128, 0.2);
          border-radius: 24px;
          box-shadow: 0 34px 90px rgba(0,0,0,.55), 0 6px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06);
          backdrop-filter: blur(24px);
        }

        .empty-state-content {
          text-align: center;
          padding: 3rem;
        }

        .empty-icon {
          width: 3rem;
          height: 3rem;
          color: #8a96ad;
          margin: 0 auto 1rem;
        }

        .empty-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
        }

        .empty-message {
          color: #8a96ad;
          margin-bottom: 1.5rem;
        }

        .clear-button {
          background: rgba(8,12,22,.95);
          border: 1px solid rgba(107, 114, 128, 0.6);
          border-radius: 8px;
          color: #a3b3ff;
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
          transition: all 0.2s ease;
        }

        .clear-button:hover {
          background: rgba(107, 114, 128, 0.1);
          border-color: rgba(107, 114, 128, 0.8);
        }
      `}</style>
    </div>
  )
}
