import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/verify-otp')({
  component: VerifyOtpPage,
  validateSearch: (search: Record<string, unknown>) => ({
    e: (search.e as string) || '',
  }),
})

function VerifyOtpPage() {
  const search = useSearch({ from: '/verify-otp' })
  const [otp, setOtp] = useState("")

  const handleSubmit = () => {
    console.log('Verifying OTP:', otp, 'for email:', search.e)
    // Handle OTP verification logic here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
      {/* Back to Forgot Password Button */}
      <Link to="/forgot-password" className="absolute top-4 left-4">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {search.e || 'your email'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">OTP Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-widest"
              required
            />
          </div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={otp.length !== 6}
          >
            Verify OTP
          </Button>
          <div className="text-center space-y-2">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Resend Code
            </Link>
            <div>
              <Link
                to="/login"
                className="text-sm text-blue-600 hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
