#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "📦 Starting Data Migration..."

# Check required environment variables
if [ -z "$SUPABASE_DB_URL" ] || [ -z "$LOCAL_DB_URL" ]; then
    echo -e "${RED}Error: SUPABASE_DB_URL and LOCAL_DB_URL must be set${NC}"
    exit 1
fi

# Create backup directory
BACKUP_DIR="migrations/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Tables to migrate (add all your tables here)
TABLES=(
    "briefs"
    "projects"
    "clients"
    "feedback"
    "users"
)

# Backup and migrate each table
for table in "${TABLES[@]}"; do
    echo "Migrating table: $table"
    
    # Backup current cloud data
    echo "Creating backup of cloud data..."
    pg_dump "$SUPABASE_DB_URL" -t "$table" -F c -f "$BACKUP_DIR/${table}_cloud.backup"
    
    # Export data from local
    echo "Exporting data from local database..."
    pg_dump "$LOCAL_DB_URL" -t "$table" --data-only -F c -f "$BACKUP_DIR/${table}_local.dump"
    
    # Import to cloud
    echo "Importing data to cloud..."
    pg_restore -d "$SUPABASE_DB_URL" --clean --if-exists --no-owner --no-privileges "$BACKUP_DIR/${table}_local.dump"
    
    # Verify row count
    LOCAL_COUNT=$(psql "$LOCAL_DB_URL" -t -c "SELECT COUNT(*) FROM $table")
    CLOUD_COUNT=$(psql "$SUPABASE_DB_URL" -t -c "SELECT COUNT(*) FROM $table")
    
    if [ "$LOCAL_COUNT" = "$CLOUD_COUNT" ]; then
        echo -e "${GREEN}✅ Table $table migrated successfully${NC}"
    else
        echo -e "${RED}❌ Migration verification failed for $table${NC}"
        echo "Local count: $LOCAL_COUNT"
        echo "Cloud count: $CLOUD_COUNT"
        exit 1
    fi
done

echo "Creating migration report..."
{
    echo "Migration Report - $(date)"
    echo "======================="
    for table in "${TABLES[@]}"; do
        COUNT=$(psql "$SUPABASE_DB_URL" -t -c "SELECT COUNT(*) FROM $table")
        echo "$table: $COUNT records"
    done
} > "$BACKUP_DIR/migration_report.txt"

echo -e "${GREEN}✅ Data migration completed successfully${NC}"
echo "Migration report available at: $BACKUP_DIR/migration_report.txt" 