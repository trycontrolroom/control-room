'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Save, Palette } from 'lucide-react'

interface CustomMetricModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (metric: CustomMetricData) => void
}

interface CustomMetricData {
  name: string
  unit: string
  formula: string
  color: string
  grouping: string
}

const unitOptions = [
  { value: 'number', label: 'Number' },
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'milliseconds', label: 'Milliseconds (ms)' },
  { value: 'seconds', label: 'Seconds (s)' },
  { value: 'minutes', label: 'Minutes (min)' },
  { value: 'hours', label: 'Hours (h)' },
  { value: 'bytes', label: 'Bytes (B)' },
  { value: 'kilobytes', label: 'Kilobytes (KB)' },
  { value: 'megabytes', label: 'Megabytes (MB)' },
  { value: 'gigabytes', label: 'Gigabytes (GB)' },
  { value: 'requests', label: 'Requests' },
  { value: 'errors', label: 'Errors' },
  { value: 'currency', label: 'Currency ($)' }
]

const colorOptions = [
  { value: '#3b82f6', label: 'Blue', color: '#3b82f6' },
  { value: '#10b981', label: 'Green', color: '#10b981' },
  { value: '#f59e0b', label: 'Yellow', color: '#f59e0b' },
  { value: '#ef4444', label: 'Red', color: '#ef4444' },
  { value: '#8b5cf6', label: 'Purple', color: '#8b5cf6' },
  { value: '#06b6d4', label: 'Cyan', color: '#06b6d4' },
  { value: '#84cc16', label: 'Lime', color: '#84cc16' },
  { value: '#f97316', label: 'Orange', color: '#f97316' }
]

const groupingOptions = [
  { value: '', label: 'No Grouping' },
  { value: 'performance', label: 'Performance' },
  { value: 'reliability', label: 'Reliability' },
  { value: 'cost', label: 'Cost' },
  { value: 'usage', label: 'Usage' },
  { value: 'custom', label: 'Custom' }
]

export function CustomMetricModal({ isOpen, onClose, onSubmit }: CustomMetricModalProps) {
  const [metricData, setMetricData] = useState<CustomMetricData>({
    name: '',
    unit: 'number',
    formula: '',
    color: '#3b82f6',
    grouping: ''
  })

  const [errors, setErrors] = useState<Partial<CustomMetricData>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Partial<CustomMetricData> = {}
    if (!metricData.name.trim()) {
      newErrors.name = 'Metric name is required'
    }
    if (!metricData.unit) {
      newErrors.unit = 'Unit type is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(metricData)
    handleClose()
  }

  const handleClose = () => {
    setMetricData({
      name: '',
      unit: 'number',
      formula: '',
      color: '#3b82f6',
      grouping: ''
    })
    setErrors({})
    onClose()
  }

  const updateMetricData = (field: keyof CustomMetricData, value: string) => {
    setMetricData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="glass-panel border-blue-500/20 w-full max-w-lg mx-4">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-white flex items-center space-x-2">
            <Palette className="w-5 h-5 text-blue-400" />
            <span>Add Custom Metric</span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Metric Name *
              </Label>
              <Input
                id="name"
                value={metricData.name}
                onChange={(e) => updateMetricData('name', e.target.value)}
                placeholder="e.g., Response Time, Success Rate"
                className="bg-gray-800/50 border-gray-600 text-white"
                required
              />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-gray-300">
                  Unit Type *
                </Label>
                <Select value={metricData.unit} onValueChange={(value) => updateMetricData('unit', value)}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {unitOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit && (
                  <p className="text-sm text-red-400">{errors.unit}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="color" className="text-gray-300">
                  Color
                </Label>
                <Select value={metricData.color} onValueChange={(value) => updateMetricData('color', value)}>
                  <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: option.color }}
                          />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grouping" className="text-gray-300">
                Grouping
              </Label>
              <Select value={metricData.grouping} onValueChange={(value) => updateMetricData('grouping', value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                  <SelectValue placeholder="Select grouping" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {groupingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="formula" className="text-gray-300">
                Formula (Optional)
              </Label>
              <Input
                id="formula"
                value={metricData.formula}
                onChange={(e) => updateMetricData('formula', e.target.value)}
                placeholder="e.g., (successful_requests / total_requests) * 100"
                className="bg-gray-800/50 border-gray-600 text-white"
              />
              <p className="text-xs text-gray-500">
                Define how this metric should be calculated from other metrics
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                type="submit" 
                className="command-button flex-1"
                disabled={!metricData.name.trim() || !metricData.unit}
              >
                <Save className="w-4 h-4 mr-2" />
                Add Metric
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="border-gray-600 hover:bg-gray-700/50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
