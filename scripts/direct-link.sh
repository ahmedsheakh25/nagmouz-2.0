#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔗 Direct Supabase Link Utility"

# Check required environment variables
if [ -z "$SUPABASE_PROJECT_ID" ] || [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo -e "${RED}Error: SUPABASE_PROJECT_ID and SUPABASE_ACCESS_TOKEN must be set${NC}"
    exit 1
fi

# Function to retry API calls
retry_api_call() {
    local url="$1"
    local method="$2"
    local max_attempts=3
    local attempt=1
    local delay=5

    while [ $attempt -le $max_attempts ]; do
        echo "API call attempt $attempt of $max_attempts..."
        if curl -s -X "$method" \
            -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            "$url" | grep -q "project_ref"; then
            return 0
        fi
        
        attempt=$((attempt + 1))
        if [ $attempt -le $max_attempts ]; then
            echo "API call failed, retrying in $delay seconds..."
            sleep $delay
            delay=$((delay * 2))
        fi
    done

    return 1
}

# Verify project access via API
echo "Verifying project access..."
if retry_api_call "https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_ID" "GET"; then
    echo -e "${GREEN}✅ Project access verified${NC}"
else
    echo -e "${RED}❌ Could not verify project access${NC}"
    exit 1
fi

# Test database connection
echo "Testing database connection..."
if psql "$SUPABASE_DB_URL" -c '\q' 2>/dev/null; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
fi

# Create local config
echo "Creating local configuration..."
cat > "supabase/config.toml" << EOF
project_id = "$SUPABASE_PROJECT_ID"

[api]
port = 54321
schemas = ["public", "storage", "graphql_public"]
extra_search_path = ["public", "extensions"]
max_rows = 1000

[db]
port = 54322
shadow_port = 54320
major_version = 15

[studio]
port = 54323
api_url = "http://localhost:54321"
EOF

echo -e "${GREEN}✅ Local configuration created${NC}"

# Create project link file
echo "Creating project link..."
mkdir -p ".supabase"
cat > ".supabase/config.json" << EOF
{
  "project_id": "$SUPABASE_PROJECT_ID",
  "project_ref": "$SUPABASE_PROJECT_ID",
  "access_token": "$SUPABASE_ACCESS_TOKEN",
  "db_url": "$SUPABASE_DB_URL",
  "api_url": "https://$SUPABASE_PROJECT_ID.supabase.co"
}
EOF

echo -e "${GREEN}✅ Project link created${NC}"

# Final verification
echo "Performing final verification..."
if [ -f ".supabase/config.json" ] && [ -f "supabase/config.toml" ]; then
    echo -e "${GREEN}✅ Direct link setup completed successfully${NC}"
    echo "You can now use Supabase CLI commands directly"
else
    echo -e "${RED}❌ Configuration files not created properly${NC}"
    exit 1
fi 