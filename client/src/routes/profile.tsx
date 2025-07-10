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
import { useCurrentUser, useLogout } from '@/hooks/useAuth'

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
  const logoutMutation = useLogout()

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: 'Software developer passionate about creating amazing user experiences.',
    avatar: ''
  })

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

  const handleSave = () => {
    console.log('Saving profile:', profile)
    // TODO: Implement profile update API call
    alert('Profile update functionality coming soon!')
  }

  const handleAvatarChange = () => {
    console.log('Change avatar clicked')
    // TODO: Implement avatar upload
    alert('Avatar upload functionality coming soon!')
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

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
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
