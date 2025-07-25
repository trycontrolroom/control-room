'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Code,
  FileText,
  Folder,
  FolderOpen,
  Save,
  X,
  Trash2,
  Plus,
  Edit,
  Loader2,
  AlertCircle,
  CheckCircle,
  Download,
  Upload
} from 'lucide-react'

interface AgentFile {
  id?: string
  path: string
  content: string
  isNew?: boolean
  updatedAt?: string
}

interface CodeEditorProps {
  agentId?: string
  files: AgentFile[]
  onFilesChange: (files: AgentFile[]) => void
  onSave?: () => Promise<void>
  onDiscard?: () => void
  onDelete?: () => Promise<void>
  canModify?: boolean
  hasUnsavedChanges?: boolean
  isSaving?: boolean
  className?: string
  showActions?: boolean
}

export function CodeEditor({
  agentId,
  files,
  onFilesChange,
  onSave,
  onDiscard,
  onDelete,
  canModify = true,
  hasUnsavedChanges = false,
  isSaving = false,
  className = '',
  showActions = true
}: CodeEditorProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [newFileName, setNewFileName] = useState('')
  const [showNewFileInput, setShowNewFileInput] = useState(false)
  const [editingFileName, setEditingFileName] = useState<string | null>(null)
  const [newFileNameValue, setNewFileNameValue] = useState('')

  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      setSelectedFile(files[0].path)
    }
  }, [files, selectedFile])

  useEffect(() => {
    if (selectedFile) {
      const parts = selectedFile.split('/')
      const newExpanded = new Set(expandedFolders)
      let currentPath = ''
      parts.slice(0, -1).forEach(part => {
        currentPath = currentPath ? `${currentPath}/${part}` : part
        newExpanded.add(currentPath)
      })
      setExpandedFolders(newExpanded)
    }
  }, [selectedFile])

  function updateFileContent(path: string, content: string) {
    const updatedFiles = files.map(file => 
      file.path === path 
        ? { ...file, content, updatedAt: new Date().toISOString() }
        : file
    )
    onFilesChange(updatedFiles)
  }

  function toggleFolder(folderPath: string) {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath)
      } else {
        newSet.add(folderPath)
      }
      return newSet
    })
  }

  function getFileTree() {
    const tree: any = {}
    files.forEach(file => {
      const parts = file.path.split('/')
      let current = tree
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = file
        } else {
          if (!current[part]) {
            current[part] = {}
          }
          current = current[part]
        }
      })
    })
    return tree
  }

  function createNewFile() {
    if (!newFileName.trim() || !canModify) return
    
    const newFile: AgentFile = {
      path: newFileName.trim(),
      content: '',
      isNew: true,
      updatedAt: new Date().toISOString()
    }
    
    const updatedFiles = [...files, newFile]
    onFilesChange(updatedFiles)
    setSelectedFile(newFile.path)
    setNewFileName('')
    setShowNewFileInput(false)
  }

  function deleteFile(filePath: string) {
    if (!canModify) return
    
    const updatedFiles = files.filter(file => file.path !== filePath)
    onFilesChange(updatedFiles)
    
    if (selectedFile === filePath) {
      setSelectedFile(updatedFiles.length > 0 ? updatedFiles[0].path : null)
    }
  }

  function renameFile(oldPath: string, newPath: string) {
    if (!canModify || !newPath.trim() || oldPath === newPath) return
    
    const updatedFiles = files.map(file => 
      file.path === oldPath 
        ? { ...file, path: newPath.trim(), updatedAt: new Date().toISOString() }
        : file
    )
    onFilesChange(updatedFiles)
    
    if (selectedFile === oldPath) {
      setSelectedFile(newPath.trim())
    }
    setEditingFileName(null)
    setNewFileNameValue('')
  }

  function getFileExtension(filename: string) {
    return filename.split('.').pop()?.toLowerCase() || ''
  }

  function getFileIcon(filename: string) {
    const ext = getFileExtension(filename)
    switch (ext) {
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
        return <Code className="w-4 h-4 text-yellow-400" />
      case 'json':
        return <FileText className="w-4 h-4 text-green-400" />
      case 'md':
        return <FileText className="w-4 h-4 text-blue-400" />
      default:
        return <FileText className="w-4 h-4 text-gray-400" />
    }
  }

  function renderFileTree(tree: any, path = '') {
    return Object.entries(tree).map(([name, value]) => {
      const fullPath = path ? `${path}/${name}` : name
      const isFile = value && typeof value === 'object' && 'content' in value
      
      if (isFile) {
        const file = value as AgentFile
        return (
          <div key={fullPath} className="group">
            <div
              className={`flex items-center justify-between p-2 cursor-pointer rounded transition-colors ${
                selectedFile === fullPath 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                  : 'hover:bg-gray-700'
              }`}
              onClick={() => setSelectedFile(fullPath)}
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                {getFileIcon(name)}
                {editingFileName === fullPath ? (
                  <input
                    type="text"
                    value={newFileNameValue}
                    onChange={(e) => setNewFileNameValue(e.target.value)}
                    onBlur={() => renameFile(fullPath, newFileNameValue)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        renameFile(fullPath, newFileNameValue)
                      } else if (e.key === 'Escape') {
                        setEditingFileName(null)
                        setNewFileNameValue('')
                      }
                    }}
                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white flex-1 min-w-0"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="text-sm truncate">{name}</span>
                )}
                {file.isNew && (
                  <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
                    New
                  </Badge>
                )}
              </div>
              {canModify && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0 border-gray-600 hover:bg-gray-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingFileName(fullPath)
                      setNewFileNameValue(name)
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0 border-red-500/50 hover:bg-red-500/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteFile(fullPath)
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )
      } else {
        const isExpanded = expandedFolders.has(fullPath)
        return (
          <div key={fullPath}>
            <div
              className="flex items-center space-x-2 p-2 cursor-pointer rounded hover:bg-gray-700 transition-colors"
              onClick={() => toggleFolder(fullPath)}
            >
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 text-blue-400" />
              )}
              <span className="text-sm">{name}</span>
            </div>
            {isExpanded && (
              <div className="ml-4 border-l border-gray-700 pl-2">
                {renderFileTree(value, fullPath)}
              </div>
            )}
          </div>
        )
      }
    })
  }

  const selectedFileContent = files.find(f => f.path === selectedFile)
  const lineCount = selectedFileContent?.content.split('\n').length || 0

  return (
    <Card className={`glass-panel border-purple-500/20 flex flex-col ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Code Editor
            {hasUnsavedChanges && (
              <Badge variant="outline" className="ml-2 border-yellow-500/50 text-yellow-400">
                Unsaved Changes
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {files.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <FileText className="w-4 h-4" />
                <span>{files.length} files</span>
              </div>
            )}
            {showActions && (
              <div className="flex space-x-2">
                {onDiscard && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onDiscard}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Discard
                  </Button>
                )}
                {onSave && (
                  <Button 
                    size="sm" 
                    onClick={onSave}
                    disabled={isSaving}
                    className="command-button"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-1" />
                    )}
                    Save
                  </Button>
                )}
                {onDelete && canModify && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onDelete}
                    disabled={isSaving}
                    className="border-red-500/50 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete Agent
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex min-h-0">
        {files.length > 0 ? (
          <>
            {/* File Tree */}
            <div className="w-64 border-r border-gray-700 pr-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Files</h3>
                {canModify && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0 border-green-500/50 hover:bg-green-500/10"
                    onClick={() => setShowNewFileInput(true)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                )}
              </div>
              
              {/* New File Input */}
              {showNewFileInput && canModify && (
                <div className="mb-3 space-y-2">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        createNewFile()
                      } else if (e.key === 'Escape') {
                        setShowNewFileInput(false)
                        setNewFileName('')
                      }
                    }}
                    placeholder="filename.js"
                    className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white placeholder-gray-400"
                    autoFocus
                  />
                  <div className="flex space-x-1">
                    <Button size="sm" onClick={createNewFile} disabled={!newFileName.trim()}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setShowNewFileInput(false)
                        setNewFileName('')
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* File Tree */}
              <div className="flex-1 overflow-y-auto space-y-1">
                {renderFileTree(getFileTree())}
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 pl-4 flex flex-col min-w-0">
              {selectedFileContent ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium truncate">{selectedFile}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {lineCount} lines
                      </Badge>
                      {selectedFileContent.updatedAt && (
                        <Badge variant="outline" className="text-xs text-gray-400">
                          {new Date(selectedFileContent.updatedAt).toLocaleTimeString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <textarea
                    value={selectedFileContent.content}
                    onChange={(e) => canModify && updateFileContent(selectedFile!, e.target.value)}
                    readOnly={!canModify}
                    className="flex-1 bg-gray-900 border border-gray-600 rounded p-3 text-white font-mono text-sm resize-none focus:border-blue-500/50 focus:outline-none"
                    placeholder={canModify ? "Start typing your code..." : "File content (read-only)"}
                    spellCheck={false}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-2" />
                    <p>Select a file to edit</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Code className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Files Available</h3>
              <p className="mb-4">
                {canModify 
                  ? 'Create your first file to get started with coding.'
                  : 'No files to display.'
                }
              </p>
              {canModify && (
                <Button onClick={() => setShowNewFileInput(true)} className="command-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First File
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
