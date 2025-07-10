# PowerShell script to update all packages to latest versions using Bun
# Usage: .\update-packages.ps1

Write-Host "Starting package updates with Bun..." -ForegroundColor Green
Write-Host "========================================"

# Function to update packages in a directory
function Update-Packages {
    param(
        [string]$Directory,
        [string]$Name
    )

    Write-Host ""
    Write-Host "Updating packages in $Name ($Directory)..." -ForegroundColor Cyan
    Write-Host "----------------------------------------"

    if (Test-Path $Directory) {
        Set-Location $Directory

        # Check if package.json exists
        if (Test-Path "package.json") {
            Write-Host "Found package.json in $Directory" -ForegroundColor Green

            # Remove existing lock file to ensure fresh install
            if (Test-Path "bun.lock") {
                Write-Host "Removing old bun.lock..." -ForegroundColor Yellow
                Remove-Item "bun.lock" -Force
            }

            # Remove node_modules to ensure clean install
            if (Test-Path "node_modules") {
                Write-Host "Removing old node_modules..." -ForegroundColor Yellow
                Remove-Item "node_modules" -Recurse -Force
            }

            # Update all packages to latest
            Write-Host "Updating all packages to latest versions..." -ForegroundColor Blue
            bun update

            # Install any missing dependencies
            Write-Host "Installing dependencies..." -ForegroundColor Blue
            bun install

            Write-Host "$Name packages updated successfully!" -ForegroundColor Green
        }
        else {
            Write-Host "No package.json found in $Directory" -ForegroundColor Red
        }

        Set-Location ..
    }
    else {
        Write-Host "Directory $Directory not found" -ForegroundColor Red
    }
}

# Save current directory
$OriginalDir = Get-Location

try {
    # Update client packages
    Update-Packages -Directory "client" -Name "Client (Frontend)"

    # Update server packages
    Update-Packages -Directory "server" -Name "Server (Backend)"

    Write-Host ""
    Write-Host "All packages updated successfully!" -ForegroundColor Green
    Write-Host "========================================"
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Test the client: cd client; bun run dev"
    Write-Host "2. Test the server: cd server; bun run dev"
    Write-Host "3. Check for any breaking changes in updated packages"
    Write-Host ""
    Write-Host "Note: Some packages might have breaking changes." -ForegroundColor Yellow
    Write-Host "Please review the changelog of major version updates."
}
catch {
    Write-Host "Error occurred: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    # Return to original directory
    Set-Location $OriginalDir
}
