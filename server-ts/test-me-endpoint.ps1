# Test /me endpoint with full user information

Write-Host "🧪 Testing /me endpoint with full user information..." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Test if server is running
Write-Host "`n1. Checking if server is running..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET
    Write-Host "✅ Server is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Server is not running. Please start the server first:" -ForegroundColor Red
    Write-Host "   cd server-ts && npm run dev" -ForegroundColor Yellow
    exit 1
}

# Register or login to get token
Write-Host "`n2. Getting authentication token..." -ForegroundColor Yellow

$registerData = @{
    username = "testuser123"
    email = "testuser123@example.com"
    password = "TestPassword123"
    avatarUrl = "https://avatars.dicebear.com/api/male/testuser123.svg"
} | ConvertTo-Json

$accessToken = $null

# Try to register first
Write-Host "   Attempting to register new user..." -ForegroundColor Gray
try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "   ✅ User registration successful" -ForegroundColor Green
    $accessToken = $registerResponse.data.tokens.accessToken
    Write-Host "   User ID: $($registerResponse.data.user.id)" -ForegroundColor Cyan
    Write-Host "   Username: $($registerResponse.data.user.username)" -ForegroundColor Cyan
    Write-Host "   Email: $($registerResponse.data.user.email)" -ForegroundColor Cyan
} catch {
    if (($_.Exception.Message -like "*409*") -or ($_.Exception.Message -like "*Conflict*")) {
        Write-Host "   ℹ️  User already exists, trying to login..." -ForegroundColor Blue
        
        # Try to login instead
        $loginData = @{
            email = "testuser123@example.com"
            password = "TestPassword123"
        } | ConvertTo-Json
        
        try {
            $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
            Write-Host "   ✅ User login successful" -ForegroundColor Green
            $accessToken = $loginResponse.data.tokens.accessToken
            Write-Host "   User ID: $($loginResponse.data.user.id)" -ForegroundColor Cyan
            Write-Host "   Username: $($loginResponse.data.user.username)" -ForegroundColor Cyan
            Write-Host "   Email: $($loginResponse.data.user.email)" -ForegroundColor Cyan
        } catch {
            Write-Host "   ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "   ❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

if (-not $accessToken) {
    Write-Host "❌ Could not obtain access token" -ForegroundColor Red
    exit 1
}

Write-Host "   Access Token: $($accessToken.Substring(0, 20))..." -ForegroundColor Cyan

# Test /me endpoint
Write-Host "`n3. Testing /me endpoint..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $accessToken"
}

try {
    $meResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET -Headers $headers
    Write-Host "✅ /me endpoint successful" -ForegroundColor Green
    
    Write-Host "`n📋 Full User Profile Information:" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Cyan
    
    $user = $meResponse.data
    Write-Host "ID: $($user.id)" -ForegroundColor White
    Write-Host "Username: $($user.username)" -ForegroundColor White
    Write-Host "Email: $($user.email)" -ForegroundColor White
    Write-Host "Avatar URL: $($user.avatarUrl)" -ForegroundColor White
    Write-Host "Is Active: $($user.isActive)" -ForegroundColor White
    Write-Host "Is Online: $($user.isOnline)" -ForegroundColor White
    Write-Host "Created At: $($user.createdAt)" -ForegroundColor White
    Write-Host "Updated At: $($user.updatedAt)" -ForegroundColor White
    
    Write-Host "`n🔍 Response Structure:" -ForegroundColor Cyan
    Write-Host "=====================" -ForegroundColor Cyan
    Write-Host "Success: $($meResponse.success)" -ForegroundColor White
    Write-Host "Message: $($meResponse.message)" -ForegroundColor White
    
    # Check if all expected fields are present
    $expectedFields = @('id', 'username', 'email', 'avatarUrl', 'isActive', 'isOnline', 'createdAt', 'updatedAt')
    $missingFields = @()
    
    foreach ($field in $expectedFields) {
        if (-not $user.PSObject.Properties.Name -contains $field) {
            $missingFields += $field
        }
    }
    
    if ($missingFields.Count -eq 0) {
        Write-Host "`n✅ All expected fields are present!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Missing fields: $($missingFields -join ', ')" -ForegroundColor Yellow
    }
    
    # Check that sensitive fields are NOT present
    $sensitiveFields = @('password', 'otp', 'otpExpiresAt')
    $exposedSensitiveFields = @()
    
    foreach ($field in $sensitiveFields) {
        if ($user.PSObject.Properties.Name -contains $field) {
            $exposedSensitiveFields += $field
        }
    }
    
    if ($exposedSensitiveFields.Count -eq 0) {
        Write-Host "✅ No sensitive fields exposed!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Exposed sensitive fields: $($exposedSensitiveFields -join ', ')" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ /me endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error details: $errorBody" -ForegroundColor Red
    }
}

# Test without token (should fail)
Write-Host "`n4. Testing /me endpoint without token (should fail)..." -ForegroundColor Yellow

try {
    $unauthorizedResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET
    Write-Host "❌ Endpoint should have failed without token!" -ForegroundColor Red
} catch {
    if ($_.Exception.Message -like "*401*" -or $_.Exception.Message -like "*Unauthorized*") {
        Write-Host "✅ Correctly rejected request without token" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Unexpected error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`n🎉 /me endpoint testing completed!" -ForegroundColor Green
Write-Host "📚 Check Swagger UI for interactive testing: http://localhost:5000/api-docs" -ForegroundColor Cyan
