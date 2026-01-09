# BeforeWedding Frontend Deployment Script
Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Build the project
Write-Host "`n📦 Building project..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Deploy to Firebase
Write-Host "`n🔥 Deploying to Firebase..." -ForegroundColor Cyan
firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your site is live at: https://beforewedding-courtship.web.app" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
