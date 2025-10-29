# Production Environment Setup for Peve Backend
Write-Host "Starting Peve Backend in Production Mode..." -ForegroundColor Green

# Set production environment variables
$env:NODE_ENV="production"
$env:PORT="4000"
$env:MONGO_URI="mongodb+srv://db_admin:meadk16@peve.tfhekgz.mongodb.net/peve?retryWrites=true&w=majority&appName=peve"
$env:JWT_SECRET="3a9f6e47f2e5b8c6a8a1e1e9a04fcb923b7b17a3c0f98fce1a8e2f82c94b6b01"
$env:JWT_REFRESH_SECRET="ddc8e6bff54a92e2f0e76dc1837da98f98c9baf20a00b437adcc64b91ebf3e27"
$env:JWT_EXPIRES_IN="15m"
$env:REFRESH_TOKEN_EXPIRES_IN="30d"
$env:CLOUDINARY_CLOUD_NAME="dy8xiblaw"
$env:CLOUDINARY_API_KEY="414969592434346"
$env:CLOUDINARY_API_SECRET="G_iNWVJO9MxzJ3CtPYNIS1tHYeA"
$env:FRONTEND_URL="http://localhost:8080"
$env:CORS_ORIGINS="https://your-app-name.vercel.app,https://your-custom-domain.com"

Write-Host "Environment variables set" -ForegroundColor Green
Write-Host "Building TypeScript..." -ForegroundColor Yellow

# Build the project
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build completed successfully" -ForegroundColor Green
Write-Host "Starting production server..." -ForegroundColor Yellow

# Start the production server
node dist/index.js
