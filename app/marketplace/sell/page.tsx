'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  DollarSign, 
  Tag, 
  FileText, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Bot,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

interface AgentFormData {
  name: string
  description: string
  price: number
  category: string
  capabilities: string[]
  instructions: string
  image: File | null
  tags: string[]
}

const categories = [
  'Customer Service',
  'Data Analysis', 
  'Content Creation',
  'Sales & Marketing',
  'Development',
  'Finance & Accounting',
  'HR & Recruitment',
  'Operations',
  'Security',
  'Other'
]

const capabilityOptions = [
  'Natural Language Processing',
  'Data Analysis & Visualization',
  'API Integration',
  'File Processing',
  'Email Automation',
  'Web Scraping',
  'Database Operations',
  'Report Generation',
  'Workflow Automation',
  'Real-time Monitoring',
  'Machine Learning',
  'Image Processing',
  'Voice Recognition',
  'Chatbot Functionality',
  'Custom Logic'
]

export default function SellAgentPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    capabilities: [],
    instructions: '',
    image: null,
    tags: []
  })
  
  const [currentTag, setCurrentTag] = useState('')
  const [errors, setErrors] = useState<Partial<AgentFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAgreement, setShowAgreement] = useState(false)
  const [agreementAccepted, setAgreementAccepted] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    
    if (status === 'authenticated' && session?.user?.role !== 'SELLER' && session?.user?.role !== 'ADMIN') {
      router.push('/marketplace')
      return
    }
  }, [status, session, router])

  const updateFormData = (field: keyof AgentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' as any }))
        return
      }
      
      updateFormData('image', file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      updateFormData('tags', [...formData.tags, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateFormData('tags', formData.tags.filter(tag => tag !== tagToRemove))
  }

  const toggleCapability = (capability: string) => {
    const capabilities = formData.capabilities.includes(capability)
      ? formData.capabilities.filter(c => c !== capability)
      : [...formData.capabilities, capability]
    updateFormData('capabilities', capabilities)
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<AgentFormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Agent name is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (formData.capabilities.length === 0) {
      newErrors.capabilities = 'At least one capability is required' as any
    }
    
    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required'
    }
    
    if (formData.price < 0) {
      newErrors.price = 'Price cannot be negative' as any
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    if (!agreementAccepted) {
      setShowAgreement(true)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('price', formData.price.toString())
      submitData.append('category', formData.category)
      submitData.append('capabilities', JSON.stringify(formData.capabilities))
      submitData.append('instructions', formData.instructions)
      submitData.append('tags', JSON.stringify(formData.tags))
      
      if (formData.image) {
        submitData.append('image', formData.image)
      }
      
      const response = await fetch('/api/marketplace/agents', {
        method: 'POST',
        body: submitData
      })
      
      if (response.ok) {
        router.push('/marketplace?success=agent-submitted')
      } else {
        const error = await response.json()
        console.error('Failed to submit agent:', error)
        alert('Failed to submit agent. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting agent:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAgreementAccept = () => {
    setAgreementAccepted(true)
    setShowAgreement(false)
    handleSubmit(new Event('submit') as any)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen command-center-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (status === 'authenticated' && session?.user?.role !== 'SELLER' && session?.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen command-center-bg">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Card className="glass-panel border-red-500/20 max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Access Denied</h3>
              <p className="text-gray-400 mb-6">
                You need seller permissions to list agents in the marketplace.
              </p>
              <Link href="/marketplace">
                <Button variant="outline" className="border-gray-600 hover:bg-gray-700/50">
                  Back to Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen command-center-bg">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">List Your Agent</h1>
            <p className="text-gray-400 mt-1">
              Share your AI agent with the Control Room community
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card className="glass-panel border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-blue-400" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">
                      Agent Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      placeholder="e.g., Customer Support Assistant"
                      className="bg-gray-800/50 border-gray-600 text-white"
                      required
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="Describe what your agent does and how it helps users..."
                      className="bg-gray-800/50 border-gray-600 text-white min-h-[100px]"
                      required
                    />
                    {errors.description && (
                      <p className="text-sm text-red-400">{errors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-300">
                        Category *
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-red-400">{errors.category}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-gray-300">
                        Price (USD)
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => updateFormData('price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="bg-gray-800/50 border-gray-600 text-white pl-10"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Set to $0 for free agents</p>
                      {errors.price && (
                        <p className="text-sm text-red-400">{errors.price}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Image */}
              <Card className="glass-panel border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-purple-400" />
                    <span>Agent Image</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800/30 hover:bg-gray-700/30">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-400">
                            <span className="font-semibold">Click to upload</span> agent image
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 5MB)</p>
                        </div>
                        <input 
                          id="image-upload" 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    
                    {imagePreview && (
                      <div className="flex justify-center">
                        <img 
                          src={imagePreview} 
                          alt="Agent preview" 
                          className="w-24 h-24 object-cover rounded-lg border border-gray-600"
                        />
                      </div>
                    )}
                    
                    {errors.image && (
                      <p className="text-sm text-red-400">{String(errors.image)}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Capabilities */}
              <Card className="glass-panel border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Capabilities *</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Select all capabilities that your agent supports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {capabilityOptions.map((capability) => (
                      <div
                        key={capability}
                        onClick={() => toggleCapability(capability)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.capabilities.includes(capability)
                            ? 'border-green-500/50 bg-green-500/10 text-green-400'
                            : 'border-gray-600 bg-gray-800/30 text-gray-300 hover:bg-gray-700/30'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            formData.capabilities.includes(capability)
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-500'
                          }`}>
                            {formData.capabilities.includes(capability) && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-sm">{capability}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.capabilities && (
                    <p className="text-sm text-red-400 mt-2">{errors.capabilities}</p>
                  )}
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="glass-panel border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-yellow-400" />
                    <span>Setup Instructions *</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Provide detailed instructions on how to configure and use your agent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.instructions}
                    onChange={(e) => updateFormData('instructions', e.target.value)}
                    placeholder="1. Configure your API keys in the settings panel...&#10;2. Set up the required webhooks...&#10;3. Test the agent with sample data..."
                    className="bg-gray-800/50 border-gray-600 text-white min-h-[150px]"
                    required
                  />
                  {errors.instructions && (
                    <p className="text-sm text-red-400 mt-2">{errors.instructions}</p>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="glass-panel border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-cyan-400" />
                    <span>Tags</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Add tags to help users discover your agent
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Enter a tag"
                      className="bg-gray-800/50 border-gray-600 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button 
                      type="button" 
                      onClick={addTag}
                      variant="outline"
                      className="border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400"
                    >
                      Add
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link href="/marketplace">
                  <Button variant="outline" className="border-gray-600 hover:bg-gray-700/50">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="command-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      List Agent
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guidelines */}
            <Card className="glass-panel border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span>Listing Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Provide clear, accurate descriptions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Include detailed setup instructions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Test your agent thoroughly before listing</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Respond to user feedback promptly</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>All agents are reviewed before approval</span>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Info */}
            <Card className="glass-panel border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span>Revenue Sharing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Your Share:</span>
                  <span className="text-green-400 font-semibold">70%</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span className="text-gray-400">30%</span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <p className="text-xs text-gray-500">
                    Payments are processed monthly via Stripe. You'll receive detailed revenue reports.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Seller Agreement Modal */}
      {showAgreement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="glass-panel border-red-500/20 w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-400" />
                <span>Seller Agreement Required</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-red-400 font-semibold">Legal Agreement Required</h4>
                    <p className="text-gray-300 text-sm mt-1">
                      Before listing your agent, you must accept our seller agreement which includes terms of service, liability, and revenue sharing details.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  onClick={handleAgreementAccept}
                  className="command-button flex-1"
                >
                  Accept Agreement & Submit
                </Button>
                <Button 
                  onClick={() => setShowAgreement(false)}
                  variant="outline"
                  className="border-gray-600 hover:bg-gray-700/50"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  )
}
