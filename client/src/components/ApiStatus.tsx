import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { config } from '@/lib/config'

interface ApiStatusProps {
  className?: string
}

export const ApiStatus: React.FC<ApiStatusProps> = ({ className }) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [serverInfo, setServerInfo] = useState<any>(null)

  const checkApiStatus = async () => {
    setStatus('checking')
    try {
      // Health endpoint is at /health, not /api/health
      const healthUrl = config.apiBaseUrl.replace('/api', '/health')
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStatus('connected')
        setServerInfo(data)
      } else {
        setStatus('disconnected')
        setServerInfo(null)
      }
    } catch (error) {
      setStatus('error')
      setServerInfo(null)
      console.error('API status check failed:', error)
    }
    setLastChecked(new Date())
  }

  useEffect(() => {
    checkApiStatus()
    // Check every 30 seconds
    const interval = setInterval(checkApiStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking connection...'
      case 'connected':
        return 'Connected to API'
      case 'disconnected':
        return 'API not responding'
      case 'error':
        return 'Connection error'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'border-blue-200 bg-blue-50'
      case 'connected':
        return 'border-green-200 bg-green-50'
      case 'disconnected':
        return 'border-red-200 bg-red-50'
      case 'error':
        return 'border-orange-200 bg-orange-50'
    }
  }

  return (
    <Card className={`${className} ${getStatusColor()}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {getStatusIcon()}
          API Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">{getStatusText()}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={checkApiStatus}
              disabled={status === 'checking'}
            >
              <RefreshCw className={`w-3 h-3 ${status === 'checking' ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <div>Endpoint: {config.apiBaseUrl}</div>
            {lastChecked && (
              <div>Last checked: {lastChecked.toLocaleTimeString()}</div>
            )}
            {serverInfo && (
              <div className="mt-2 p-2 bg-white rounded border">
                <div className="font-medium">Server Info:</div>
                <div>Status: {serverInfo.status || 'OK'}</div>
                {serverInfo.version && <div>Version: {serverInfo.version}</div>}
                {serverInfo.timestamp && (
                  <div>Server Time: {new Date(serverInfo.timestamp).toLocaleString()}</div>
                )}
              </div>
            )}
          </div>

          {status === 'disconnected' || status === 'error' ? (
            <div className="mt-3 p-2 bg-white rounded border text-xs">
              <div className="font-medium text-red-600 mb-1">Troubleshooting:</div>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Check if backend server is running</li>
                <li>Verify API URL in environment variables</li>
                <li>Check network connection</li>
                <li>Look for CORS issues in browser console</li>
              </ul>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
