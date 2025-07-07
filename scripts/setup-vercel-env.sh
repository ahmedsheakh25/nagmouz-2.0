#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔧 Setting up Vercel Environment..."

# Check required environment variables
if [ -z "$VERCEL_TOKEN" ] || [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo -e "${RED}Error: VERCEL_TOKEN and SUPABASE_PROJECT_ID must be set${NC}"
    exit 1
fi

# Function to setup environment for a project
setup_project_env() {
    local PROJECT_NAME=$1
    local PROJECT_DIR=$2
    
    echo "Setting up environment for $PROJECT_NAME..."
    
    # Ensure we're in the project directory
    cd "$PROJECT_DIR"
    
    # Link to Vercel project
    vercel link --token "$VERCEL_TOKEN"
    
    # Pull environment variables from Supabase
    echo "Fetching Supabase configuration..."
    SUPABASE_URL=$(supabase config get --project-ref "$SUPABASE_PROJECT_ID" api.url)
    SUPABASE_ANON_KEY=$(supabase config get --project-ref "$SUPABASE_PROJECT_ID" api.anon_key)
    
    # Set environment variables in Vercel
    echo "Setting Vercel environment variables..."
    vercel env add NEXT_PUBLIC_SUPABASE_URL "$SUPABASE_URL" --token "$VERCEL_TOKEN"
    vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY "$SUPABASE_ANON_KEY" --token "$VERCEL_TOKEN"
    
    # Add any additional environment variables from .env.production
    if [ -f ".env.production" ]; then
        echo "Adding production environment variables..."
        while IFS= read -r line || [[ -n "$line" ]]; do
            if [[ ! "$line" =~ ^# && ! -z "$line" ]]; then
                KEY=$(echo "$line" | cut -d'=' -f1)
                VALUE=$(echo "$line" | cut -d'=' -f2-)
                vercel env add "$KEY" "$VALUE" --token "$VERCEL_TOKEN"
            fi
        done < .env.production
    fi
    
    echo -e "${GREEN}✅ Environment setup completed for $PROJECT_NAME${NC}"
    cd ..
}

# Setup environment for both projects
setup_project_env "Orbit" "apps/orbit"
setup_project_env "Nujmooz" "apps/nujmooz"

echo -e "${GREEN}✅ Vercel environment setup completed for all projects${NC}" 