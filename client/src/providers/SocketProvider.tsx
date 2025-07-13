import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { socketService } from '@/services/socket.service';

interface SocketContextType {
  connected: boolean;
  socketId: string | null;
  connectionError: string | null;
}

const SocketContext = createContext<SocketContextType>({
  connected: false,
  socketId: null,
  connectionError: null,
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const { isAuthenticated, tokens } = useAuthStore();
  const [connected, setConnected] = useState(socketService.connected);
  const [socketId, setSocketId] = useState<string | null>(socketService.socketId!);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Connect when authenticated, disconnect when not
  useEffect(() => {
    if (isAuthenticated && tokens?.accessToken) {
      console.log('SocketProvider: User authenticated, connecting socket...');
      
      const connectSocket = async () => {
        try {
          setConnectionError(null);
          await socketService.connect();
        } catch (error) {
          console.error('SocketProvider: Failed to connect socket:', error);
          setConnectionError(error instanceof Error ? error.message : 'Connection failed');
        }
      };

      connectSocket();
    } else {
      console.log('SocketProvider: User not authenticated, disconnecting socket...');
      socketService.disconnect();
    }
  }, [isAuthenticated, tokens?.accessToken]);

  // Listen for connection state changes
  useEffect(() => {
    const unsubscribe = socketService.onConnectionChange((isConnected) => {
      console.log('SocketProvider: Connection state changed:', isConnected);
      setConnected(isConnected);
      setSocketId(socketService.socketId!);
      
      if (isConnected) {
        setConnectionError(null);
      }
    });

    return unsubscribe;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('SocketProvider: Cleaning up socket connection');
      socketService.disconnect();
    };
  }, []);

  const contextValue: SocketContextType = {
    connected,
    socketId,
    connectionError,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}
