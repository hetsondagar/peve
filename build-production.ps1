# Production Build Script for Peve (PowerShell)
Write-Host "🚀 Starting production build process..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json") -and -not (Test-Path "backend") -and -not (Test-Path "frontend")) {
    Write-Host "[ERROR] Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Clean previous builds
Write-Host "[INFO] Cleaning previous builds..." -ForegroundColor Green
if (Test-Path "backend/dist") { Remove-Item -Recurse -Force "backend/dist" }
if (Test-Path "frontend/dist") { Remove-Item -Recurse -Force "frontend/dist" }
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "backend/node_modules") { Remove-Item -Recurse -Force "backend/node_modules" }
if (Test-Path "frontend/node_modules") { Remove-Item -Recurse -Force "frontend/node_modules" }

# Install dependencies
Write-Host "[INFO] Installing backend dependencies..." -ForegroundColor Green
Set-Location backend
npm ci --only=production
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Building backend..." -ForegroundColor Green
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to build backend" -ForegroundColor Red
    exit 1
}

Set-Location ../frontend

Write-Host "[INFO] Installing frontend dependencies..." -ForegroundColor Green
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Building frontend..." -ForegroundColor Green
npm run build:prod
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to build frontend" -ForegroundColor Red
    exit 1
}

Set-Location ..

# Create production package
Write-Host "[INFO] Creating production package..." -ForegroundColor Green
if (Test-Path "production-build") { Remove-Item -Recurse -Force "production-build" }
New-Item -ItemType Directory -Path "production-build" | Out-Null

Copy-Item -Recurse "backend/dist" "production-build/backend"
Copy-Item -Recurse "frontend/dist" "production-build/frontend"
Copy-Item "backend/package.json" "production-build/backend/"
Copy-Item "backend/production.env.template" "production-build/backend/.env.template"
Copy-Item "frontend/production.env.template" "production-build/frontend/.env.template"
Copy-Item "docker-compose.production.yml" "production-build/"
Copy-Item "DEPLOYMENT_GUIDE.md" "production-build/"

# Create deployment archive
Write-Host "[INFO] Creating deployment archive..." -ForegroundColor Green
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
Compress-Archive -Path "production-build" -DestinationPath "peve-production-$timestamp.zip" -Force

Write-Host "[INFO] Production build completed successfully!" -ForegroundColor Green
Write-Host "[INFO] Files created:" -ForegroundColor Green
Write-Host "  - production-build/ (directory)" -ForegroundColor White
Write-Host "  - peve-production-$timestamp.zip (archive)" -ForegroundColor White
Write-Host ""
Write-Host "[WARNING] Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review and update environment variables in production-build/" -ForegroundColor White
Write-Host "  2. Follow the DEPLOYMENT_GUIDE.md for deployment instructions" -ForegroundColor White
Write-Host "  3. Test the build locally using docker-compose.production.yml" -ForegroundColor White
