# Simple test for /me endpoint

Write-Host "Testing /me endpoint..." -ForegroundColor Green

# Step 1: Register user
$registerData = @{
    username = "simpletest"
    email = "simpletest@example.com"
    password = "SimpleTest123"
    avatarUrl = "https://example.com/avatar.jpg"
}

$registerJson = $registerData | ConvertTo-Json

try {
    Write-Host "1. Registering user..." -ForegroundColor Yellow
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $registerJson -ContentType "application/json"
    
    Write-Host "Registration successful!" -ForegroundColor Green
    $accessToken = $registerResponse.data.tokens.accessToken
    
    # Step 2: Test /me endpoint
    Write-Host "2. Testing /me endpoint..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    
    $meResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET -Headers $headers
    
    Write-Host "Success! User profile:" -ForegroundColor Green
    Write-Host "ID: $($meResponse.data.id)" -ForegroundColor Cyan
    Write-Host "Username: $($meResponse.data.username)" -ForegroundColor Cyan
    Write-Host "Email: $($meResponse.data.email)" -ForegroundColor Cyan
    Write-Host "Avatar: $($meResponse.data.avatarUrl)" -ForegroundColor Cyan
    Write-Host "Active: $($meResponse.data.isActive)" -ForegroundColor Cyan
    Write-Host "Online: $($meResponse.data.isOnline)" -ForegroundColor Cyan
    Write-Host "Created: $($meResponse.data.createdAt)" -ForegroundColor Cyan
    
} catch {
    if ($_.Exception.Message -like "*Conflict*") {
        Write-Host "User already exists, trying login..." -ForegroundColor Yellow
        
        $loginData = @{
            email = "simpletest@example.com"
            password = "SimpleTest123"
        }
        
        $loginJson = $loginData | ConvertTo-Json
        
        try {
            $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginJson -ContentType "application/json"
            $accessToken = $loginResponse.data.tokens.accessToken
            
            $headers = @{
                "Authorization" = "Bearer $accessToken"
            }
            
            $meResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET -Headers $headers
            
            Write-Host "Success! User profile:" -ForegroundColor Green
            Write-Host "ID: $($meResponse.data.id)" -ForegroundColor Cyan
            Write-Host "Username: $($meResponse.data.username)" -ForegroundColor Cyan
            Write-Host "Email: $($meResponse.data.email)" -ForegroundColor Cyan
            Write-Host "Avatar: $($meResponse.data.avatarUrl)" -ForegroundColor Cyan
            Write-Host "Active: $($meResponse.data.isActive)" -ForegroundColor Cyan
            Write-Host "Online: $($meResponse.data.isOnline)" -ForegroundColor Cyan
            Write-Host "Created: $($meResponse.data.createdAt)" -ForegroundColor Cyan
            
        } catch {
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Test completed!" -ForegroundColor Green
