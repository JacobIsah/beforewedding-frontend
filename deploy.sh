#!/bin/bash
# BeforeWedding Frontend Deployment Script

echo "🚀 Starting deployment process..."

# Build the project
echo ""
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Firebase
echo ""
echo "🔥 Deploying to Firebase..."
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌐 Your site is live at: https://beforewedding-courtship.web.app"
else
    echo ""
    echo "❌ Deployment failed!"
    exit 1
fi
