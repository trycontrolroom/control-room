'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
      <div className="min-h-screen command-center-bg">
        <Navigation />
        <div className="pt-32 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen command-center-bg">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Agent Marketplace</h1>
              <p className="text-gray-400">
                Discover and deploy AI agents built by the community
              </p>
            </div>
            
            {canSellAgents && (
              <Link href="/marketplace/sell">
                <Button className="command-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Sell Agent
                </Button>
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-panel border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Total Agents</p>
                    <p className="text-2xl font-bold text-white">{agents.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Total Installs</p>
                    <p className="text-2xl font-bold text-white">
                      {agents.reduce((sum, agent) => sum + (agent.installCount || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Active Sellers</p>
                    <p className="text-2xl font-bold text-white">
                      {new Set(agents.map(a => a.author)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-yellow-500/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Avg Rating</p>
                    <p className="text-2xl font-bold text-white">
                      {(agents.reduce((sum, agent) => sum + agent.rating, 0) / agents.length).toFixed(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="glass-panel border-gray-500/20 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                {/* Search */}
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search agents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 form-input-enhanced"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 form-input-enhanced">
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

                {/* Price Filter */}
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-32 form-input-enhanced">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 form-input-enhanced">
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

          {/* Agent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="glass-panel border-blue-500/20 hover:border-blue-400/40 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-white mb-1">
                        {agent.name}
                      </CardTitle>
                      <p className="text-sm text-gray-400 mb-2">by {agent.author}</p>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                        {agent.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      {agent.isFree ? (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                          Free
                        </Badge>
                      ) : (
                        <div className="text-lg font-bold text-white">
                          ${agent.price}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-300 line-clamp-3">
                    {agent.description}
                  </CardDescription>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {agent.tags && agent.tags.slice(0, 3).map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="text-xs border-gray-600 text-gray-400"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {agent.tags && agent.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                        +{agent.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{agent.rating.toFixed(1)}</span>
                      <span>({agent.reviewCount})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{(agent.installCount || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Link href={`/marketplace/${agent.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-gray-600 hover:bg-gray-700/50">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    
                    {agent.isInstalled ? (
                      <Button size="sm" disabled className="bg-green-500/20 text-green-400">
                        Installed
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleInstallAgent(agent.id, agent.price)}
                        className="command-button"
                      >
                        {agent.isFree ? (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Install
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
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

          {/* Empty State */}
          {filteredAgents.length === 0 && (
            <Card className="glass-panel border-gray-500/20">
              <CardContent className="text-center py-12">
                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Agents Found</h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search criteria or browse different categories.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All Categories')
                    setPriceFilter('all')
                  }}
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700/50"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
