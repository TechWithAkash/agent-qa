#!/usr/bin/env bash
# =============================================================================
# DRISHTI AI — Quick Run Script
# =============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}        DRISHTI AI — Autonomous QA Agent            ${NC}"
echo -e "${BLUE}====================================================${NC}"

# Check if Docker is running
if docker info >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Docker daemon detected.${NC}"
    echo -e "${YELLOW}Starting full stack via Docker Compose...${NC}"
    echo -e "Services: MongoDB, Backend API, Runner Agent, Frontend, ShopLite"
    echo ""
    docker compose up --build
    exit 0
fi

# Fallback: Run natively on machine without Docker
echo -e "${YELLOW}! Docker is not running. Starting local development servers...${NC}"
echo ""

# Cleanup background processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping all services...${NC}"
    if [ -n "$SHOPLITE_PID" ]; then
        kill "$SHOPLITE_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    echo -e "${GREEN}All services stopped.${NC}"
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 1. Start ShopLite
echo -e "${GREEN}1. Launching ShopLite (Target App)...${NC}"
cd "$DIR/apps/shoplite"
if [ ! -d "node_modules" ]; then
    echo "Installing ShopLite dependencies..."
    npm install --silent
fi
PORT=3001 BUG_SET=all node src/index.js > /tmp/drishti-shoplite.log 2>&1 &
SHOPLITE_PID=$!
echo -e "   → ShopLite running at: ${BLUE}http://localhost:3001${NC} (PID: $SHOPLITE_PID)"

# 2. Start Frontend Dashboard
echo -e "${GREEN}2. Launching DRISHTI Dashboard...${NC}"
cd "$DIR/apps/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing Frontend dependencies..."
    npm install --silent
fi

echo ""
echo -e "${GREEN}====================================================${NC}"
echo -e "${GREEN}🚀 Application is now live!                         ${NC}"
echo -e "${GREEN}====================================================${NC}"
echo -e "📊 ${BLUE}DRISHTI Dashboard:${NC}  http://localhost:3000"
echo -e "🛍️  ${BLUE}ShopLite Store:${NC}     http://localhost:3001"
echo -e "${YELLOW}(Press Ctrl+C at any time to stop all servers)${NC}"
echo ""

npm run dev
