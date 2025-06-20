"use client"

import React, { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CloudinaryUploadResponse {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
  bytes: number
}

interface CloudinaryUploaderProps {
  onUploadSuccess: (url: string, publicId: string) => void
  onUploadError?: (error: string) => void
  onUploadStart?: () => void
  className?: string
  maxFileSize?: number // in MB
  acceptedFormats?: string[]
  uploadPreset: string // Your Cloudinary upload preset
  cloudName: string // Your Cloudinary cloud name
  folder?: string // Optional folder in Cloudinary
  transformation?: string // Optional Cloudinary transformation
  disabled?: boolean
  currentImageUrl?: string
  showPreview?: boolean
}

const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  onUploadStart,
  className,
  maxFileSize = 5, // 5MB default
  acceptedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  uploadPreset,
  cloudName, // Use the prop instead of env variable
  folder,
  transformation,
  disabled = false,
  currentImageUrl,
  showPreview = true,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  // Validate file before upload
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`
    }
    
    // Check file format
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!fileExtension || !acceptedFormats.includes(fileExtension)) {
      return `Only ${acceptedFormats.join(', ')} files are allowed`
    }
    
    // Check if it's actually an image
    if (!file.type.startsWith('image/')) {
      return 'Please select a valid image file'
    }
    
    return null
  }
  
  // Upload to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    // Validate required props
    if (!cloudName || !uploadPreset) {
      throw new Error('Cloud name and upload preset are required')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    
    if (folder) {
      formData.append('folder', folder)
    }
    
    if (transformation) {
      formData.append('transformation', transformation)
    }

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Cloudinary error response:', errorText)
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
      }

      const data: CloudinaryUploadResponse = await response.json()
      return data
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error(error instanceof Error ? error.message : 'Upload failed')
    }
  }

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      onUploadError?.(validationError)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadComplete(false)
    onUploadStart?.()

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Simulate progress (since Cloudinary doesn't provide real progress)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const uploadResult = await uploadToCloudinary(file)
      
      // Complete progress
      setUploadProgress(100)
      setUploadComplete(true)
      
      // Call success callback
      onUploadSuccess(uploadResult.secure_url, uploadResult.public_id)
      
      setTimeout(() => {
        setUploadComplete(false)
      }, 2000)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      onUploadError?.(errorMessage)
      setPreviewUrl(null)
    } finally {
      clearInterval(progressInterval)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [validateFile, uploadToCloudinary, onUploadSuccess, onUploadError, onUploadStart])

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled || isUploading) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [disabled, isUploading, handleFileUpload])

  // Handle file input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || isUploading) return

    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [disabled, isUploading, handleFileUpload])

  // Remove image
  const handleRemove = useCallback(() => {
    setPreviewUrl(null)
    setUploadProgress(0)
    setUploadComplete(false)
  }, [])

  return (
    <div className={cn("w-full", className)}>
      <Card className={cn(
        "relative border-2 border-dashed transition-all duration-200",
        dragActive && "border-primary bg-primary/5",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:border-primary/50"
      )}>
        <CardContent className="p-6">
          {/* Preview Image */}
          {showPreview && previewUrl && (
            <div className="relative mb-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              {!isUploading && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {uploadComplete && (
                <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <Check className="h-6 w-6" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload Area */}
          <div
            className={cn(
              "relative",
              previewUrl && showPreview && "mt-4"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept={acceptedFormats.map(format => `.${format}`).join(',')}
              onChange={handleInputChange}
              disabled={disabled || isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />

            <div className="text-center py-8">
              {isUploading ? (
                <div className="space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    {previewUrl ? (
                      <ImageIcon className="h-6 w-6 text-primary" />
                    ) : (
                      <Upload className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {previewUrl ? 'Replace image' : 'Upload an image'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Drag and drop or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max {maxFileSize}MB • {acceptedFormats.join(', ').toUpperCase()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CloudinaryUploader