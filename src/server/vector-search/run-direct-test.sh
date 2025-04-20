#!/bin/bash

# Set the NODE_ENV for testing
export NODE_ENV=development

echo "Loading test environment variables..."
# Load environment variables from .env.test
set -a
source "$(dirname "$0")/.env.test"
set +a

echo "Running direct test..."
npx tsx src/server/vector-search/direct-test.ts 