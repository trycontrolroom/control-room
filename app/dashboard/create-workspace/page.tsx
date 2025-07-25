'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2, ArrowRight } from 'lucide-react'

export default function CreateWorkspacePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return
    setError('')

    if (!formData.name.trim()) {
      setError('Workspace name is required')
      return
    }

    try {
      setIsLoading(true)
      // 1) CREATE
      const createRes = await fetch('/api/workspaces/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // only send name (your route no longer accepts description)
        body: JSON.stringify({ name: formData.name.trim() }),
      })
      const createData = await createRes.json()

      if (!createRes.ok) {
        setError(createData.error || 'Failed to create workspace')
        return
      }

      // 2) SWITCH
      const switchRes = await fetch('/api/workspaces/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: createData.workspace.id }),
      })
      const switchData = await switchRes.json()

      if (!switchRes.ok) {
        setError(switchData.error || 'Failed to switch workspace')
        return
      }

      // 3) REDIRECT
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: 'name' | 'description', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Workspace</h1>
          <p className="text-gray-400">
            Welcome! Let’s set up your workspace to get started.
          </p>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Workspace Details</CardTitle>
            <CardDescription className="text-gray-400">
              Create a new workspace to organize your AI agents and collaborators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="My Company, Personal Projects..."
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="What will you use this workspace for?"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded p-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !formData.name.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Creating…' : <>Create Workspace<ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            You’ll be the workspace admin and can invite your team later.
          </p>
        </div>
      </div>
    </div>
  )
}