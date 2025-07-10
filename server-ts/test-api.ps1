# Test API endpoints

Write-Host "Testing API endpoints..." -ForegroundColor Green

# Test health endpoint
Write-Host "`n1. Testing health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET
    Write-Host "✅ Health check successful" -ForegroundColor Green
    Write-Host "Status: $($health.data.status)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test API info
Write-Host "`n2. Testing API info..." -ForegroundColor Yellow
try {
    $apiInfo = Invoke-RestMethod -Uri "http://localhost:5000/api" -Method GET
    Write-Host "✅ API info successful" -ForegroundColor Green
    Write-Host "Name: $($apiInfo.data.name)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ API info failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test user registration
Write-Host "`n3. Testing user registration..." -ForegroundColor Yellow
$registerData = @{
    username = "testuser"
    email = "test@example.com"
    password = "Password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "✅ User registration successful" -ForegroundColor Green
    Write-Host "User ID: $($registerResponse.data.user.id)" -ForegroundColor Cyan
    Write-Host "Access Token: $($registerResponse.data.tokens.accessToken.Substring(0, 20))..." -ForegroundColor Cyan
    
    # Save token for further tests
    $global:accessToken = $registerResponse.data.tokens.accessToken
    
} catch {
    Write-Host "❌ User registration failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error details: $errorBody" -ForegroundColor Red
    }
}

# Test protected endpoint (todos)
if ($global:accessToken) {
    Write-Host "`n4. Testing protected endpoint (todos)..." -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $($global:accessToken)"
        }
        $todosResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/todos" -Method GET -Headers $headers
        Write-Host "✅ Todos endpoint successful" -ForegroundColor Green
        Write-Host "Total todos: $($todosResponse.data.total)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Todos endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 API testing completed!" -ForegroundColor Green
