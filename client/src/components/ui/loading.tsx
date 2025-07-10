import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin',
        sizeClasses[size],
        className
      )} 
    />
  )
}

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  size = 'md',
  className 
}) => {
  return (
    <div className={cn('flex items-center justify-center py-8', className)}>
      <LoadingSpinner size={size} />
      <span className="ml-2 text-gray-600">{message}</span>
    </div>
  )
}

interface ErrorStateProps {
  message?: string
  error?: Error | any
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = 'Something went wrong', 
  error,
  onRetry,
  className 
}) => {
  return (
    <div className={cn('text-center py-8 text-red-600', className)}>
      <p className="font-medium">{message}</p>
      {error?.message && (
        <p className="text-sm mt-2 text-red-500">{error.message}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

interface EmptyStateProps {
  message?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = 'No data found', 
  description,
  icon,
  action,
  className 
}) => {
  return (
    <div className={cn('text-center py-8 text-gray-500', className)}>
      {icon && <div className="mb-4">{icon}</div>}
      <p className="font-medium">{message}</p>
      {description && (
        <p className="text-sm mt-2">{description}</p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </div>
  )
}
