#!/bin/bash

echo "🔧 Docker Environment Troubleshooting..."

echo "📋 System Information:"
echo "Docker version: $(docker --version)"
echo "Docker Compose version: $(docker-compose --version)"
echo "Available disk space: $(df -h . | tail -1 | awk '{print $4}')"

echo ""
echo "📋 Container Status:"
docker-compose ps

echo ""
echo "📋 Container Logs (last 50 lines):"
echo "=== ORBIT LOGS ==="
docker-compose logs --tail=50 orbit

echo ""
echo "=== NUJMOOZ LOGS ==="
docker-compose logs --tail=50 nujmooz

echo ""
echo "📋 Port Usage:"
echo "Checking if ports are in use..."
netstat -tulpn | grep -E ":${ORBIT_PORT}|:${NUJMOOZ_PORT}" || echo "Ports are available"

echo ""
echo "📋 Environment Variables in Containers:"
echo "=== ORBIT ENV ==="
docker-compose exec -T orbit env | grep -E "(SUPABASE|PORT|APP_URL)" | sort || echo "Orbit container not running"

echo ""
echo "=== NUJMOOZ ENV ==="
docker-compose exec -T nujmooz env | grep -E "(SUPABASE|PORT|APP_URL)" | sort || echo "Nujmooz container not running"

echo ""
echo "🔧 Troubleshooting complete!"
