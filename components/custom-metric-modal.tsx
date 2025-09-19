'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { X, Save, Palette, Info, HelpCircleIcon } from 'lucide-react'

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
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Yellow' },
  { value: '#ef4444', label: 'Red' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#84cc16', label: 'Lime' },
  { value: '#f97316', label: 'Orange' }
]

const groupingOptions = [
  { value: 'performance', label: 'Performance' },
  { value: 'reliability', label: 'Reliability' },
  { value: 'cost', label: 'Cost' },
  { value: 'usage', label: 'Usage' },
  { value: 'custom', label: 'Custom' }
]

export function CustomMetricModal({
  isOpen,
  onClose,
  onSubmit
}: CustomMetricModalProps) {
  const [metricData, setMetricData] = useState<CustomMetricData>({
    name: '',
    unit: 'number',
    formula: '',
    color: '#3b82f6',
    grouping: ''
  })
  const [errors, setErrors] = useState<Partial<CustomMetricData>>({})

  const updateMetricData = (field: keyof CustomMetricData, value: string) => {
    setMetricData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleClose = () => {
    setMetricData({ name: '', unit: 'number', formula: '', color: '#3b82f6', grouping: '' })
    setErrors({})
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Partial<CustomMetricData> = {}
    if (!metricData.name.trim()) newErrors.name = 'Metric name is required'
    if (!metricData.unit) newErrors.unit = 'Unit type is required'
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }
    onSubmit(metricData)
    handleClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="glass-panel border-blue-500/20 w-full max-w-lg">
        <CardHeader className="flex items-center justify-between pb-4">
          <div className="flex items-center space-x-2 text-white text-xl">
            <Palette className="w-5 h-5 text-blue-400" />
            <span>Add Custom Metric</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-4 h-4 text-gray-400 hover:text-white" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Metric Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center text-gray-300">
                Metric Name *
                <div className="relative group ml-2 inline-block">
                  <HelpCircleIcon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                  <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 transition-all">
                    Enter a unique name (e.g. Success Rate)
                  </div>
                </div>
              </Label>
              <Input
                id="name"
                value={metricData.name}
                onChange={e => updateMetricData('name', e.target.value)}
                placeholder="e.g., Success Rate"
                className="bg-gray-800/50 border-gray-600 text-white"
              />
              {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Unit & Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label htmlFor="unit" className="flex items-center text-gray-300">
                  Unit Type *
                  <div className="relative group ml-2 inline-block">
                    <HelpCircleIcon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 transition-all">
                      How should values be displayed (%, ms, count…)
                    </div>
                  </div>
                </Label>
                <Select
                  value={metricData.unit}
                  onValueChange={v => updateMetricData('unit', v)}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {unitOptions.map(o => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit && <p className="text-xs text-red-400">{errors.unit}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="color" className="flex items-center text-gray-300">
                  Color
                  <div className="relative group ml-2 inline-block">
                    <HelpCircleIcon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 transition-all">
                      Pick a color for the metric in charts
                    </div>
                  </div>
                </Label>
                <Select
                  value={metricData.color}
                  onValueChange={v => updateMetricData('color', v)}
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {colorOptions.map(o => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Grouping */}
            <div className="space-y-2">
              <Label htmlFor="grouping" className="flex items-center text-gray-300">
                Grouping
                <div className="relative group ml-2 inline-block">
                  <HelpCircleIcon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                  <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 transition-all">
                    Optionally group this metric under a category
                  </div>
                </div>
              </Label>
              <Select
                value={metricData.grouping}
                onValueChange={v => updateMetricData('grouping', v)}
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                  <SelectValue placeholder="No Grouping" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {groupingOptions.map(o => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Formula */}
            <div className="space-y-2">
              <Label htmlFor="formula" className="flex items-center text-gray-300">
                Formula (Optional)
                <div className="relative group ml-2 inline-block">
                  <HelpCircleIcon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                  <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 transition-all">
                    Define how to compute this from other metrics
                  </div>
                </div>
              </Label>
              <Input
                id="formula"
                value={metricData.formula}
                onChange={e => updateMetricData('formula', e.target.value)}
                placeholder="e.g., (successes/requests)*100"
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                className="command-button flex-1"
                disabled={!metricData.name.trim() || !metricData.unit}
              >
                <Save className="w-4 h-4 mr-2" />
                Add Metric
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}