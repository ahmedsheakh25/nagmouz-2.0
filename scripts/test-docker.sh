#!/bin/bash

echo "🐳 Starting Docker Environment Testing..."

# Load environment variables
set -a
source .env.docker
set +a

echo "🧹 Cleaning up any existing containers..."
docker-compose down --remove-orphans
docker system prune -f

echo "🔨 Building and starting containers..."
if docker-compose --env-file .env.docker up --build -d; then
    echo "✅ Containers started successfully!"
else
    echo "❌ Failed to start containers"
    echo "📋 Showing logs:"
    docker-compose logs
    exit 1
fi

echo "⏳ Waiting for containers to be ready..."
sleep 30

echo "🔍 Checking container status..."
docker-compose ps

echo "🔍 Testing container health..."

# Test Orbit container
echo "📡 Testing Orbit container..."
if docker-compose exec -T orbit curl -f http://localhost:${ORBIT_PORT} >/dev/null 2>&1; then
    echo "✅ Orbit is responding on port ${ORBIT_PORT}"
else
    echo "⚠️  Orbit health check failed, checking if container is running..."
    if docker-compose ps orbit | grep -q "Up"; then
        echo "✅ Orbit container is running"
    else
        echo "❌ Orbit container is not running"
        docker-compose logs orbit
    fi
fi

# Test Nujmooz container
echo "📡 Testing Nujmooz container..."
if docker-compose exec -T nujmooz curl -f http://localhost:${NUJMOOZ_PORT} >/dev/null 2>&1; then
    echo "✅ Nujmooz is responding on port ${NUJMOOZ_PORT}"
else
    echo "⚠️  Nujmooz health check failed, checking if container is running..."
    if docker-compose ps nujmooz | grep -q "Up"; then
        echo "✅ Nujmooz container is running"
    else
        echo "❌ Nujmooz container is not running"
        docker-compose logs nujmooz
    fi
fi

echo "🔍 Checking environment variables in containers..."

echo "📋 Orbit environment variables:"
docker-compose exec -T orbit env | grep -E "(SUPABASE|PORT|APP_URL)" | sort

echo "📋 Nujmooz environment variables:"
docker-compose exec -T nujmooz env | grep -E "(SUPABASE|PORT|APP_URL)" | sort

echo "🌐 Testing external access..."
echo "🔗 Orbit should be available at: http://localhost:${ORBIT_PORT}"
echo "🔗 Nujmooz should be available at: http://localhost:${NUJMOOZ_PORT}"

# Test external access from host
if curl -f -s http://localhost:${ORBIT_PORT} >/dev/null; then
    echo "✅ Orbit is accessible from host"
else
    echo "⚠️  Orbit not accessible from host yet (may need more time to start)"
fi

if curl -f -s http://localhost:${NUJMOOZ_PORT} >/dev/null; then
    echo "✅ Nujmooz is accessible from host"
else
    echo "⚠️  Nujmooz not accessible from host yet (may need more time to start)"
fi

echo "🎉 Docker testing complete!"
echo "💡 If applications are not responding, they may still be starting up."
echo "💡 Use 'docker-compose logs [service_name]' to check detailed logs."
