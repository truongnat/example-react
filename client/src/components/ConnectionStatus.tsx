import React from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useSocket } from '@/providers/SocketProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ConnectionStatus() {
  const { connected, connectionError } = useSocket();

  // Don't show anything if connected and no errors
  if (connected && !connectionError) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {connectionError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connection Error: {connectionError}
          </AlertDescription>
        </Alert>
      ) : !connected ? (
        <Alert variant="default" className="border-yellow-200 bg-yellow-50">
          <WifiOff className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Connecting to chat server...
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}

// Inline connection indicator for chat components
export function InlineConnectionStatus() {
  const { connected, connectionError } = useSocket();

  if (connected && !connectionError) {
    return (
      <div className="flex items-center text-green-600 text-sm">
        <Wifi className="h-3 w-3 mr-1" />
        <span>Connected</span>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="flex items-center text-red-600 text-sm">
        <AlertCircle className="h-3 w-3 mr-1" />
        <span>Connection Error</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-yellow-600 text-sm">
      <WifiOff className="h-3 w-3 mr-1" />
      <span>Connecting...</span>
    </div>
  );
}
