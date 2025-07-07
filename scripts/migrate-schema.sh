#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔄 Starting Schema Migration..."

# Check if required environment variables are set
if [ -z "$SUPABASE_PROJECT_ID" ] || [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo -e "${RED}Error: SUPABASE_PROJECT_ID and SUPABASE_ACCESS_TOKEN must be set${NC}"
    exit 1
fi

# Ensure we're in the project root
if [ ! -d "supabase" ]; then
    echo -e "${RED}Error: Must be run from project root${NC}"
    exit 1
fi

# Apply migrations
echo "Applying migrations..."
supabase db push --db-url "$SUPABASE_DB_URL"

# Verify schema migration
echo "Verifying schema migration..."
supabase db diff --db-url "$SUPABASE_DB_URL" > verification/schema-diff.sql

if [ -s verification/schema-diff.sql ]; then
    echo -e "${RED}❌ Schema differences detected. Check verification/schema-diff.sql${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Schema migration successful${NC}"
    rm verification/schema-diff.sql
fi

# Apply RLS policies
echo "Applying RLS policies..."
for policy in migrations/policies/*.sql; do
    if [ -f "$policy" ]; then
        echo "Applying policy: $policy"
        supabase db push "$policy" --db-url "$SUPABASE_DB_URL"
    fi
done

echo -e "${GREEN}✅ Schema migration completed successfully${NC}" 