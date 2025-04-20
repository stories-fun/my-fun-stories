#!/bin/bash

echo "===== Loading Sample Stories into Vector Search ====="
echo ""

# Load environment variables
echo "Loading environment variables..."
if [ -f .env.test ]; then
  export $(grep -v '^#' .env.test | xargs)
else
  echo "Warning: .env.test not found"
fi

# Set debug mode for vector search
export VECTOR_SEARCH_DEBUG=true

echo "Starting story loading process..."
npx tsx src/server/vector-search/load-sample-stories.ts

# Check exit status
if [ $? -eq 0 ]; then
  echo "✅ Sample stories successfully loaded!"
  exit 0
else
  echo "❌ Failed to load sample stories"
  exit 1
fi 