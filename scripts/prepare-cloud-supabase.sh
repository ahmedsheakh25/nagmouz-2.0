#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Preparing Cloud Supabase Environment..."

# Check if required environment variables are set
if [ -z "$SUPABASE_PROJECT_ID" ] || [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo -e "${RED}Error: SUPABASE_PROJECT_ID and SUPABASE_ACCESS_TOKEN must be set${NC}"
    exit 1
fi

# Verify Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    brew install supabase/tap/supabase
fi

# Link to the cloud project
echo "Linking to cloud project..."
supabase link --project-ref "$SUPABASE_PROJECT_ID" --access-token "$SUPABASE_ACCESS_TOKEN"

# Verify connection
if supabase status; then
    echo -e "${GREEN}✅ Successfully connected to cloud Supabase project${NC}"
else
    echo -e "${RED}❌ Failed to connect to cloud Supabase project${NC}"
    exit 1
fi

echo "🔍 Checking project configuration..."
# Add any additional project-specific checks here

echo -e "${GREEN}✅ Cloud Supabase environment is ready${NC}" 