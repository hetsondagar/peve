# PowerShell script to start Peve Backend with MongoDB Atlas
param(
    [Parameter(Mandatory=$true)]
    [string]$MongoUri
)

Write-Host "🚀 Starting Peve Backend with MongoDB Atlas" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

Write-Host "✅ MongoDB Atlas URI provided" -ForegroundColor Green
Write-Host "🔧 Setting environment variables..." -ForegroundColor Yellow

# Set environment variables
$env:MONGO_URI = $MongoUri
$env:PORT = "5000"
$env:JWT_SECRET = "dev-secret"
$env:JWT_REFRESH_SECRET = "dev-refresh-secret"
$env:FRONTEND_URL = "http://localhost:5173"
$env:NODE_ENV = "development"

Write-Host "✅ Environment variables set" -ForegroundColor Green
Write-Host "🚀 Starting backend server..." -ForegroundColor Yellow
Write-Host ""

# Start the backend server
npm run dev
