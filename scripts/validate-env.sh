#!/bin/bash

echo "🔍 Validating Environment Configuration..."

# Check if .env.docker exists
if [ ! -f ".env.docker" ]; then
    echo "❌ .env.docker file not found!"
    exit 1
fi

# Check required variables in .env.docker
required_vars=("ORBIT_PORT" "NUJMOOZ_PORT" "SUPABASE_API_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY")

echo "�� Checking required variables in .env.docker:"
for var in "${required_vars[@]}"; do
    if grep -q "^${var}=" .env.docker; then
        echo "✅ $var: Found"
    else
        echo "❌ $var: Missing"
    fi
done

# Check if .env.local files exist
echo ""
echo "📋 Checking .env.local files:"
if [ -f "apps/orbit/.env.local" ]; then
    echo "✅ apps/orbit/.env.local: Found"
else
    echo "❌ apps/orbit/.env.local: Missing"
fi

if [ -f "apps/nujmooz/.env.local" ]; then
    echo "✅ apps/nujmooz/.env.local: Found"
else
    echo "❌ apps/nujmooz/.env.local: Missing"
fi

# Check if example files exist
echo ""
echo "📋 Checking .env.local.example files:"
if [ -f "apps/orbit/.env.local.example" ]; then
    echo "✅ apps/orbit/.env.local.example: Found"
else
    echo "❌ apps/orbit/.env.local.example: Missing"
fi

if [ -f "apps/nujmooz/.env.local.example" ]; then
    echo "✅ apps/nujmooz/.env.local.example: Found"
else
    echo "❌ apps/nujmooz/.env.local.example: Missing"
fi

echo ""
echo "🔧 Environment validation complete!"
