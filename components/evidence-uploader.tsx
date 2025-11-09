"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Upload, File, Image, FileText, X, Loader2, Box } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: string
}

interface EvidenceUploaderProps {
  sceneId: string
  sceneName: string
  onFilesUploaded?: (files: UploadedFile[]) => void
}

export function EvidenceUploader({ sceneId, sceneName, onFilesUploaded }: EvidenceUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      'image/',
      'video/',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'model/gltf-binary', // GLB files
      '.glb' // fallback for GLB detection
    ]
    return validTypes.some(type => 
      file.type.startsWith(type) || file.name.toLowerCase().endsWith(type)
    )
  }

  const handleFiles = async (fileList: File[]) => {
    // Filter out invalid file types
    const validFiles = fileList.filter(file => {
      if (!isValidFileType(file)) {
        console.warn(`⚠️ Rejected file: ${file.name} (type: ${file.type})`)
        alert(`Cannot upload "${file.name}"\n\nAllowed file types:\n• 3D Models (GLB)\n• Images (JPG, PNG, etc.)\n• Videos (MP4, MOV, etc.)\n• Documents (PDF, DOC, TXT)`)
        return false
      }
      if (file.size > 50 * 1024 * 1024) {
        alert(`File "${file.name}" is too large (max 50MB)`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    setUploadSuccess(false)
    setUploadMessage('')
    
    try {
      const uploadedFiles: UploadedFile[] = []
      
      for (const file of validFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('sceneId', sceneId)
        formData.append('sceneName', sceneName)
        
        const response = await fetch('/api/upload-evidence', {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`)
        }
        
        const result = await response.json()
        uploadedFiles.push(result.file)
      }
      
      setFiles(prev => [...prev, ...uploadedFiles])
      if (onFilesUploaded) {
        onFilesUploaded(uploadedFiles)
      }
      
      // Show success message
      setUploadSuccess(true)
      const fileCount = uploadedFiles.length
      const hasGLB = uploadedFiles.some(f => f.name.toLowerCase().endsWith('.glb'))
      const glbMessage = hasGLB ? ' Scene list will refresh automatically.' : ''
      setUploadMessage(`✅ ${fileCount} file${fileCount > 1 ? 's' : ''} uploaded successfully!${glbMessage}`)
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setUploadSuccess(false)
        setUploadMessage('')
      }, 5000)
      
    } catch (error) {
      console.error('Upload error:', error)
      setUploadSuccess(false)
      setUploadMessage('❌ Upload failed. Please try again.')
      
      // Hide error message after 5 seconds
      setTimeout(() => {
        setUploadMessage('')
      }, 5000)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const getFileIcon = (type: string, name: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />
    if (type.startsWith('video/')) return <File className="w-4 h-4" />
    if (type === 'model/gltf-binary' || name.toLowerCase().endsWith('.glb')) return <Box className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Evidence Files</h3>
          <Badge variant="outline">{files.length} file{files.length !== 1 ? 's' : ''}</Badge>
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            onChange={handleChange}
            className="hidden"
            id="file-upload"
            accept="image/*,video/*,.pdf,.doc,.docx,.txt,.glb,model/gltf-binary"
          />
          
          <div className="space-y-3">
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Uploading evidence...</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Drag and drop files here, or{' '}
                    <label htmlFor="file-upload" className="text-primary cursor-pointer hover:underline">
                      browse
                    </label>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3D models (GLB), images, videos, documents • Max 50MB per file
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Success/Error Message */}
        {uploadMessage && (
          <div className={`p-3 rounded-md text-sm font-medium transition-all ${
            uploadSuccess 
              ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' 
              : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
          }`}>
            {uploadMessage}
          </div>
        )}

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Uploaded Evidence</p>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 rounded-md border border-border bg-background/50 hover:bg-background transition-colors"
                  >
                    <div className="flex-shrink-0 p-2 rounded-md bg-primary/10 text-primary">
                      {getFileIcon(file.type, file.name)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        {file.name.toLowerCase().endsWith('.glb') && (
                          <Badge variant="outline" className="text-xs">3D Model</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    
                    {file.type.startsWith('image/') && (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0"
                      >
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded border border-border"
                        />
                      </a>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </Card>
  )
}

