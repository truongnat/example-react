# Test Swagger Documentation

Write-Host "🚀 Testing Swagger API Documentation..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Test if server is running
Write-Host "`n1. Checking if server is running..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET
    Write-Host "✅ Server is running" -ForegroundColor Green
    Write-Host "Documentation URL: $($health.data.documentation)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Server is not running. Please start the server first:" -ForegroundColor Red
    Write-Host "   cd server-ts && npm run dev" -ForegroundColor Yellow
    exit 1
}

# Test Swagger endpoints
Write-Host "`n2. Testing Swagger endpoints..." -ForegroundColor Yellow

# Test Swagger UI
Write-Host "   Testing Swagger UI..." -ForegroundColor Gray
try {
    $swaggerResponse = Invoke-WebRequest -Uri "http://localhost:5000/api-docs" -Method GET
    if ($swaggerResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Swagger UI is accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Swagger UI failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test OpenAPI spec
Write-Host "   Testing OpenAPI specification..." -ForegroundColor Gray
try {
    $specResponse = Invoke-RestMethod -Uri "http://localhost:5000/api-docs/swagger.json" -Method GET
    Write-Host "   ✅ OpenAPI spec is available" -ForegroundColor Green
    Write-Host "   API Title: $($specResponse.info.title)" -ForegroundColor Cyan
    Write-Host "   API Version: $($specResponse.info.version)" -ForegroundColor Cyan
    Write-Host "   Endpoints documented: $($specResponse.paths.PSObject.Properties.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ OpenAPI spec failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test documentation health
Write-Host "   Testing documentation health..." -ForegroundColor Gray
try {
    $docsHealth = Invoke-RestMethod -Uri "http://localhost:5000/api-docs/health" -Method GET
    Write-Host "   ✅ Documentation health check passed" -ForegroundColor Green
    Write-Host "   Available endpoints:" -ForegroundColor Cyan
    $docsHealth.data.endpoints.PSObject.Properties | ForEach-Object {
        Write-Host "     - $($_.Name): $($_.Value)" -ForegroundColor White
    }
} catch {
    Write-Host "   ❌ Documentation health failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test redirect
Write-Host "   Testing documentation redirect..." -ForegroundColor Gray
try {
    $redirectResponse = Invoke-WebRequest -Uri "http://localhost:5000/docs" -Method GET -MaximumRedirection 0 -ErrorAction SilentlyContinue
    if ($redirectResponse.StatusCode -eq 302) {
        Write-Host "   ✅ Documentation redirect works" -ForegroundColor Green
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 302) {
        Write-Host "   ✅ Documentation redirect works" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Documentation redirect failed" -ForegroundColor Red
    }
}

# Demo authentication flow
Write-Host "`n3. Demo: Testing authentication flow via API..." -ForegroundColor Yellow

# Register a test user
$registerData = @{
    username = "swaggertest"
    email = "swagger@example.com"
    password = "SwaggerTest123"
} | ConvertTo-Json

Write-Host "   Registering test user..." -ForegroundColor Gray
try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "   ✅ User registration successful" -ForegroundColor Green
    Write-Host "   User ID: $($registerResponse.data.user.id)" -ForegroundColor Cyan
    
    $accessToken = $registerResponse.data.tokens.accessToken
    Write-Host "   Access Token: $($accessToken.Substring(0, 20))..." -ForegroundColor Cyan
    
    # Test protected endpoint
    Write-Host "   Testing protected endpoint with token..." -ForegroundColor Gray
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    
    $todosResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/todos" -Method GET -Headers $headers
    Write-Host "   ✅ Protected endpoint accessible with token" -ForegroundColor Green
    Write-Host "   Total todos: $($todosResponse.data.total)" -ForegroundColor Cyan
    
} catch {
    if ($_.Exception.Message -like "*409*" -or $_.Exception.Message -like "*Conflict*") {
        Write-Host "   ℹ️  Test user already exists (this is normal)" -ForegroundColor Blue
        
        # Try to login instead
        $loginData = @{
            email = "swagger@example.com"
            password = "SwaggerTest123"
        } | ConvertTo-Json
        
        try {
            $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
            Write-Host "   ✅ User login successful" -ForegroundColor Green
            $accessToken = $loginResponse.data.tokens.accessToken
            Write-Host "   Access Token: $($accessToken.Substring(0, 20))..." -ForegroundColor Cyan
        } catch {
            Write-Host "   ❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "   ❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Instructions for manual testing
Write-Host "`n4. Manual Testing Instructions:" -ForegroundColor Yellow
Write-Host "   📚 Open Swagger UI: http://localhost:5000/api-docs" -ForegroundColor Cyan
Write-Host "   🔐 To test protected endpoints:" -ForegroundColor Cyan
Write-Host "      1. Use POST /auth/register or /auth/login" -ForegroundColor White
Write-Host "      2. Copy the 'accessToken' from the response" -ForegroundColor White
Write-Host "      3. Click the 'Authorize' button (🔒) at the top" -ForegroundColor White
Write-Host "      4. Enter: Bearer <your-access-token>" -ForegroundColor White
Write-Host "      5. Click 'Authorize'" -ForegroundColor White
Write-Host "      6. Now you can test any protected endpoint!" -ForegroundColor White

Write-Host "`n🎉 Swagger documentation testing completed!" -ForegroundColor Green
Write-Host "📖 For more details, see: docs/SWAGGER.md" -ForegroundColor Cyan
