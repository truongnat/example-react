import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, Upload, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface FileUploadProps {
  onUpload: (file: File) => Promise<string>
  accept?: string
  maxSize?: number // in MB
  children?: React.ReactNode
  className?: string
  disabled?: boolean
}

export function FileUpload({
  onUpload,
  accept = 'image/*',
  maxSize = 5, // 5MB default
  children,
  className = '',
  disabled = false
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    if (accept && accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const isValidType = acceptedTypes.some(type => {
        if (type.includes('*')) {
          // Handle wildcard types like 'image/*'
          const baseType = type.split('/')[0]
          return file.type.startsWith(baseType + '/')
        }
        return file.type === type
      })

      if (!isValidType) {
        toast.error('Invalid file type')
        return
      }
    }

    setIsUploading(true)
    try {
      const url = await onUpload(file)
      toast.success('File uploaded successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Upload failed')
    } finally {
      setIsUploading(false)
      // Clear the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
      
      {children ? (
        <div onClick={handleClick} className={`cursor-pointer ${className}`}>
          {children}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className={className}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </>
          )}
        </Button>
      )}
    </>
  )
}

interface AvatarUploadProps {
  onUpload: (file: File) => Promise<string>
  disabled?: boolean
  className?: string
}

export function AvatarUpload({ onUpload, disabled = false, className = '' }: AvatarUploadProps) {
  return (
    <FileUpload
      onUpload={onUpload}
      accept="image/*"
      maxSize={2} // 2MB for avatars
      disabled={disabled}
      className={className}
    >
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
        disabled={disabled}
      >
        <Camera className="w-4 h-4" />
      </Button>
    </FileUpload>
  )
}
