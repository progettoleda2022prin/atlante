#!/bin/bash

# Check Node.js
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed."
    exit 1
fi

echo "Node.js version: $(node -v)"

# Copy env files if they don't exist
if [ ! -f ".env.development" ]; then
    echo "Creating .env.development from template..."
    cp .env.development.example .env.development
fi

if [ ! -f ".env.production" ]; then
    echo "Creating .env.production from template..."
    cp .env.production.example .env.production
    echo "IMPORTANT: Edit .env.production and set your BASE_PATH!"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "Setup complete!"
    echo "NEXT STEP: Edit .env.production and configure your deployment path"
    echo "To start development:"
    echo "  npm run dev"
else
    echo "Installation failed."
    exit 1
fi