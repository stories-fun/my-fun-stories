#!/bin/bash

# Create a temporary .env file to inject environment variables
echo "Creating temporary environment configuration..."
TMP_ENV_FILE=".env.vector-search"
echo "VECTOR_SEARCH_DEBUG=true" > $TMP_ENV_FILE

# Ensure sample stories are loaded first
echo "Ensuring stories are loaded into vector search..."
VECTOR_SEARCH_DEBUG=true ./load-stories.sh

# Start the Next.js development server with environment variables
echo "Starting the development server..."
cd ../..
VECTOR_SEARCH_DEBUG=true npm run dev &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# Provide instructions without localhost URL
echo "Search UI is now available at the /search path"
echo "Press Ctrl+C to stop the server"

# Wait for user to press Ctrl+C
wait $SERVER_PID 