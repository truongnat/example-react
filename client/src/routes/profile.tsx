import { createFileRoute, redirect } from '@tanstack/react-router'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Save, LogOut, Loader2 } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { useAuthStore } from '@/stores/authStore'
import { useCurrentUser, useUpdateProfile, useLogout } from '@/hooks/useAuth'

export const Route = createFileRoute('/profile')({
  beforeLoad: ({ context, location }) => {
    // Check if user is authenticated
    const isAuthenticated = useAuthStore.getState().isAuthenticated

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: MyProfilePage,
})

function MyProfilePage() {
  const { user } = useAuthStore()
  const { data: currentUser, isLoading, error } = useCurrentUser()
  const updateProfileMutation = useUpdateProfile()
  const logoutMutation = useLogout()

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: 'Software developer passionate about creating amazing user experiences.',
    avatar: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [validationError, setValidationError] = useState('')

  // Update profile state when user data is loaded
  React.useEffect(() => {
    if (currentUser) {
      setProfile({
        name: currentUser.username || '',
        email: currentUser.email || '',
        bio: 'Software developer passionate about creating amazing user experiences.',
        avatar: currentUser.avatarUrl || '/api/placeholder/120/120'
      })
    }
  }, [currentUser])

  const validateProfile = () => {
    if (!profile.name.trim()) {
      setValidationError('Name is required')
      return false
    }
    if (profile.name.trim().length < 3) {
      setValidationError('Name must be at least 3 characters long')
      return false
    }
    if (profile.name.trim().length > 50) {
      setValidationError('Name must be less than 50 characters')
      return false
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(profile.name.trim())) {
      setValidationError('Name can only contain letters, numbers, underscores, and hyphens')
      return false
    }
    if (profile.avatar.trim() && !isValidUrl(profile.avatar.trim())) {
      setValidationError('Avatar URL must be a valid URL')
      return false
    }
    setValidationError('')
    return true
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSave = () => {
    if (!validateProfile()) return

    const updateData: any = {}

    // Only include fields that have changed
    if (profile.name !== currentUser?.username) {
      updateData.username = profile.name.trim()
    }
    if (profile.avatar !== currentUser?.avatarUrl) {
      updateData.avatarUrl = profile.avatar.trim() || undefined
    }

    // If no changes, don't make API call
    if (Object.keys(updateData).length === 0) {
      setValidationError('No changes to save')
      return
    }

    updateProfileMutation.mutate(updateData, {
      onSuccess: () => {
        setIsEditing(false)
        setValidationError('')
      },
      onError: (error: any) => {
        setValidationError(error.message || 'Failed to update profile')
      }
    })
  }

  const handleAvatarChange = () => {
    const newAvatarUrl = prompt('Enter new avatar URL:', profile.avatar)
    if (newAvatarUrl !== null) {
      setProfile({ ...profile, avatar: newAvatarUrl })
    }
  }

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation title="My Profile" />
        <div className="py-8">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading profile...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation title="My Profile" />
        <div className="py-8">
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center py-8 text-red-600">
              <p>Failed to load profile. Please try again.</p>
              <p className="text-sm mt-2">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="My Profile" />
      <div className="py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-lg">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={handleAvatarChange}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" onClick={handleAvatarChange}>
                Change Avatar
              </Button>
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {validationError}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => {
                    setProfile({ ...profile, name: e.target.value })
                    if (validationError) setValidationError('')
                  }}
                  placeholder="Enter your username"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500">
                  Username can only contain letters, numbers, underscores, and hyphens
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={profile.avatar}
                  onChange={(e) => {
                    setProfile({ ...profile, avatar: e.target.value })
                    if (validationError) setValidationError('')
                  }}
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-xs text-gray-500">
                  Enter a valid URL for your avatar image
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  disabled
                />
                <p className="text-xs text-gray-500">
                  Bio editing coming soon
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2"
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Privacy Settings
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              Sign Out
            </Button>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
