#!/bin/bash

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Starting Migration Verification..."

# Check required environment variables
if [ -z "$SUPABASE_DB_URL" ] || [ -z "$LOCAL_DB_URL" ]; then
    echo -e "${RED}Error: SUPABASE_DB_URL and LOCAL_DB_URL must be set${NC}"
    exit 1
fi

# Create verification directory
VERIFY_DIR="verification/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$VERIFY_DIR"

# Function to verify table structure
verify_table_structure() {
    local table=$1
    echo "Verifying structure for table: $table"
    
    psql "$LOCAL_DB_URL" -c "\d $table" > "$VERIFY_DIR/${table}_local_structure.txt"
    psql "$SUPABASE_DB_URL" -c "\d $table" > "$VERIFY_DIR/${table}_cloud_structure.txt"
    
    if diff "$VERIFY_DIR/${table}_local_structure.txt" "$VERIFY_DIR/${table}_cloud_structure.txt" > "$VERIFY_DIR/${table}_structure_diff.txt"; then
        echo -e "${GREEN}✅ Table structure matches${NC}"
        rm "$VERIFY_DIR/${table}_structure_diff.txt"
        return 0
    else
        echo -e "${RED}❌ Table structure mismatch detected${NC}"
        return 1
    fi
}

# Function to verify data consistency
verify_data_consistency() {
    local table=$1
    echo "Verifying data for table: $table"
    
    # Compare row counts
    LOCAL_COUNT=$(psql "$LOCAL_DB_URL" -t -c "SELECT COUNT(*) FROM $table")
    CLOUD_COUNT=$(psql "$SUPABASE_DB_URL" -t -c "SELECT COUNT(*) FROM $table")
    
    if [ "$LOCAL_COUNT" != "$CLOUD_COUNT" ]; then
        echo -e "${RED}❌ Row count mismatch for $table${NC}"
        echo "Local: $LOCAL_COUNT, Cloud: $CLOUD_COUNT"
        return 1
    fi
    
    # Compare data checksums
    LOCAL_CHECKSUM=$(psql "$LOCAL_DB_URL" -t -c "SELECT MD5(CAST((array_agg(t.*)) AS text)) FROM $table t")
    CLOUD_CHECKSUM=$(psql "$SUPABASE_DB_URL" -t -c "SELECT MD5(CAST((array_agg(t.*)) AS text)) FROM $table t")
    
    if [ "$LOCAL_CHECKSUM" = "$CLOUD_CHECKSUM" ]; then
        echo -e "${GREEN}✅ Data consistency verified${NC}"
        return 0
    else
        echo -e "${RED}❌ Data inconsistency detected${NC}"
        return 1
    fi
}

# Verify RLS policies
verify_rls_policies() {
    local table=$1
    echo "Verifying RLS policies for table: $table"
    
    psql "$LOCAL_DB_URL" -c "SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = '$table'" > "$VERIFY_DIR/${table}_local_policies.txt"
    psql "$SUPABASE_DB_URL" -c "SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = '$table'" > "$VERIFY_DIR/${table}_cloud_policies.txt"
    
    if diff "$VERIFY_DIR/${table}_local_policies.txt" "$VERIFY_DIR/${table}_cloud_policies.txt" > "$VERIFY_DIR/${table}_policies_diff.txt"; then
        echo -e "${GREEN}✅ RLS policies match${NC}"
        rm "$VERIFY_DIR/${table}_policies_diff.txt"
        return 0
    else
        echo -e "${RED}❌ RLS policy mismatch detected${NC}"
        return 1
    fi
}

# Tables to verify
TABLES=(
    "briefs"
    "projects"
    "clients"
    "feedback"
    "users"
)

# Run verification for each table
FAILED=0
for table in "${TABLES[@]}"; do
    echo -e "\n${YELLOW}Verifying table: $table${NC}"
    
    verify_table_structure "$table" || FAILED=1
    verify_data_consistency "$table" || FAILED=1
    verify_rls_policies "$table" || FAILED=1
done

# Generate verification report
{
    echo "Migration Verification Report - $(date)"
    echo "================================="
    echo ""
    for table in "${TABLES[@]}"; do
        echo "Table: $table"
        echo "------------"
        echo "Row count: $(psql "$SUPABASE_DB_URL" -t -c "SELECT COUNT(*) FROM $table")"
        echo "RLS policies: $(psql "$SUPABASE_DB_URL" -t -c "SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = '$table'")"
        echo ""
    done
} > "$VERIFY_DIR/verification_report.txt"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}✅ All verifications passed successfully${NC}"
    echo "Verification report available at: $VERIFY_DIR/verification_report.txt"
    exit 0
else
    echo -e "\n${RED}❌ Some verifications failed. Check the verification directory for details: $VERIFY_DIR${NC}"
    exit 1
fi 