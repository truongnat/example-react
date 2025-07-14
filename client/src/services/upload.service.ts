import { httpClient } from '@/lib/http-client'

export interface UploadResponse {
  file: {
    filename: string
    originalName: string
    mimetype: string
    size: number
    url: string
  }
  avatarUrl?: string
}

export class UploadService {
  async uploadFile(file: File): Promise<string> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed')
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB')
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await httpClient.post<UploadResponse>('/upload/image', formData)

      if (response.success && response.data) {
        return response.data.file.url
      }

      throw new Error(response.message || 'Upload failed')
    } catch (error: any) {
      throw new Error(error.message || 'Upload failed')
    }
  }

  async uploadAvatar(file: File): Promise<string> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed for avatars')
    }

    // Validate file size (2MB max for avatars)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Avatar file size must be less than 2MB')
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await httpClient.post<UploadResponse>('/upload/avatar', formData)

      if (response.success && response.data) {
        return response.data.avatarUrl || response.data.file.url
      }

      throw new Error(response.message || 'Avatar upload failed')
    } catch (error: any) {
      throw new Error(error.message || 'Avatar upload failed')
    }
  }
}

export const uploadService = new UploadService()
