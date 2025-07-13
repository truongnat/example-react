// Mock upload service - in a real app, this would integrate with a service like Cloudinary, AWS S3, etc.
export class UploadService {
  async uploadFile(file: File): Promise<string> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, create a local object URL
    // In a real app, this would upload to a cloud service and return the URL
    const url = URL.createObjectURL(file)
    
    // Store in localStorage to persist across page reloads (for demo)
    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '{}')
    const fileId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    uploadedFiles[fileId] = url
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles))
    
    // Return a mock URL that would be returned by a real service
    return `https://example.com/uploads/${fileId}.${file.name.split('.').pop()}`
  }

  async uploadAvatar(file: File): Promise<string> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed for avatars')
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Avatar file size must be less than 2MB')
    }

    return this.uploadFile(file)
  }
}

export const uploadService = new UploadService()
