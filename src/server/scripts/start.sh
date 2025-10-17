#!/bin/bash

# procell API Server - Startup Script

echo "🚀 Starting procell API Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Please update the .env file with your configuration."
    else
        echo "❌ .env.example file not found."
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if Supabase configuration is set
if grep -q "your_supabase_url_here" .env; then
    echo "⚠️  Please configure your Supabase settings in .env file"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

# Start the server
echo "🌟 Starting server..."
if [ "$1" = "dev" ]; then
    echo "🔧 Running in development mode..."
    npm run dev
else
    echo "🚀 Running in production mode..."
    npm start
fi