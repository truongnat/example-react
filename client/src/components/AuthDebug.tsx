import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { httpClient } from '@/lib/http-client'

export const AuthDebug: React.FC = () => {
  const { user, isAuthenticated, tokens } = useAuthStore()
  
  const [storageData, setStorageData] = React.useState<any>(null)
  
  React.useEffect(() => {
    try {
      const authData = localStorage.getItem('auth-storage')
      if (authData) {
        setStorageData(JSON.parse(authData))
      }
    } catch (error) {
      console.error('Failed to parse auth storage:', error)
    }
  }, [])

  const handleReloadTokens = () => {
    httpClient.reloadTokens()
    // Force re-render by updating storage data
    try {
      const authData = localStorage.getItem('auth-storage')
      if (authData) {
        setStorageData(JSON.parse(authData))
      }
    } catch (error) {
      console.error('Failed to parse auth storage:', error)
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Auth Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>Auth Store:</strong>
          <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
            {JSON.stringify({ 
              isAuthenticated, 
              user: user ? { id: user.id, name: user.name, email: user.email } : null,
              hasTokens: !!tokens,
              tokens: tokens ? { 
                hasAccessToken: !!tokens.accessToken,
                hasRefreshToken: !!tokens.refreshToken,
                accessTokenLength: tokens.accessToken?.length || 0
              } : null
            }, null, 2)}
          </pre>
        </div>
        
        <div>
          <strong>LocalStorage:</strong>
          <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
            {storageData ? JSON.stringify(storageData, null, 2) : 'No data'}
          </pre>
        </div>
        
        <button 
          onClick={handleReloadTokens}
          className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Reload Tokens
        </button>
      </CardContent>
    </Card>
  )
}
