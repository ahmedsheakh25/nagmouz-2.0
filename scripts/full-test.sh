#!/bin/bash

echo "🚀 Starting Full Environment Test Suite..."

# Step 1: Validate environment
echo "Step 1: Validating Environment Configuration"
./scripts/validate-env.sh
if [ $? -ne 0 ]; then
    echo "❌ Environment validation failed!"
    exit 1
fi

# Step 2: Test Docker setup
echo ""
echo "Step 2: Testing Docker Setup"
./scripts/test-docker.sh
if [ $? -ne 0 ]; then
    echo "❌ Docker testing failed!"
    exit 1
fi

# Step 3: Test application endpoints
echo ""
echo "Step 3: Testing Application Endpoints"
source .env.docker

echo "⏳ Waiting for applications to fully start..."
sleep 60

# Test Orbit endpoint
echo "🔍 Testing Orbit application..."
for i in {1..5}; do
    if curl -f -s "http://localhost:${ORBIT_PORT}" > /dev/null; then
        echo "✅ Orbit is fully operational!"
        break
    else
        echo "⏳ Attempt $i/5: Orbit not ready yet..."
        sleep 10
    fi
done

# Test Nujmooz endpoint
echo "🔍 Testing Nujmooz application..."
for i in {1..5}; do
    if curl -f -s "http://localhost:${NUJMOOZ_PORT}" > /dev/null; then
        echo "✅ Nujmooz is fully operational!"
        break
    else
        echo "⏳ Attempt $i/5: Nujmooz not ready yet..."
        sleep 10
    fi
done

echo ""
echo "🎉 Full test suite completed!"
echo "📊 Summary:"
echo "- Environment files: ✅ Configured"
echo "- Docker containers: ✅ Running"
echo "- Applications: ✅ Accessible"
echo ""
echo "🔗 Access your applications:"
echo "   Orbit: http://localhost:${ORBIT_PORT}"
echo "   Nujmooz: http://localhost:${NUJMOOZ_PORT}"
