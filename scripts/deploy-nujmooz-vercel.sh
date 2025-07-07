#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Deploying Nujmooz to Vercel..."

# Check required environment variables
if [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${RED}Error: VERCEL_TOKEN must be set${NC}"
    exit 1
fi

# Navigate to Nujmooz directory
cd apps/nujmooz

# Ensure production environment file exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}Error: .env.production file not found${NC}"
    exit 1
fi

# Build the application
echo "Building application..."
pnpm build || {
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
}

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel deploy --prod --token "$VERCEL_TOKEN" || {
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
}

echo -e "${GREEN}✅ Nujmooz deployed successfully to Vercel${NC}"

# Return to root directory
cd ../.. 