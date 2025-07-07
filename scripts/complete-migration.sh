#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 Starting Complete Migration Process..."

# Function to run a step and check its result
run_step() {
    local step_name=$1
    local script_path=$2
    
    echo -e "\n${YELLOW}Running step: $step_name${NC}"
    if bash "$script_path"; then
        echo -e "${GREEN}✅ $step_name completed successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ $step_name failed${NC}"
        return 1
    fi
}

# Check if all required scripts exist
REQUIRED_SCRIPTS=(
    "scripts/prepare-cloud-supabase.sh"
    "scripts/migrate-schema.sh"
    "scripts/migrate-data.sh"
    "scripts/setup-vercel-env.sh"
    "scripts/verify-migration.sh"
)

for script in "${REQUIRED_SCRIPTS[@]}"; do
    if [ ! -f "$script" ]; then
        echo -e "${RED}Error: Required script not found: $script${NC}"
        exit 1
    fi
done

# Make all scripts executable
chmod +x scripts/*.sh

# Create migration log directory
LOG_DIR="migrations/logs/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$LOG_DIR"

# Start migration process
{
    echo "Migration Log - $(date)"
    echo "===================="
    echo ""
    
    # Step 1: Prepare Cloud Supabase
    run_step "Prepare Cloud Supabase" "scripts/prepare-cloud-supabase.sh" || exit 1
    
    # Step 2: Migrate Schema
    run_step "Migrate Schema" "scripts/migrate-schema.sh" || exit 1
    
    # Step 3: Migrate Data
    run_step "Migrate Data" "scripts/migrate-data.sh" || exit 1
    
    # Step 4: Setup Vercel Environment
    run_step "Setup Vercel Environment" "scripts/setup-vercel-env.sh" || exit 1
    
    # Step 5: Verify Migration
    run_step "Verify Migration" "scripts/verify-migration.sh" || exit 1
    
} 2>&1 | tee "$LOG_DIR/migration.log"

# Check if any step failed
if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo -e "\n${GREEN}✅ Migration completed successfully${NC}"
    echo "Migration log available at: $LOG_DIR/migration.log"
    
    # Copy verification reports
    if [ -d "verification" ]; then
        cp -r verification/* "$LOG_DIR/"
    fi
    
    exit 0
else
    echo -e "\n${RED}❌ Migration failed. Check the logs for details: $LOG_DIR/migration.log${NC}"
    exit 1
fi 