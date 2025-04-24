#!/bin/bash

echo "===== Vector Search Setup ====="
echo ""

# Check for sample stories file
if [ ! -f "src/server/vector-search/sample-stories.json" ]; then
  echo "❌ Error: sample-stories.json file not found in src/server/vector-search/"
  echo "Please ensure this file exists to proceed."
  exit 1
fi

# Create a direct test script runner
echo "#!/bin/bash
cd src/server/vector-search
export NODE_ENV=development
export VECTOR_SEARCH_DEBUG=true
npx tsx direct-test-local.ts" > run-vector-search.sh

# Make it executable
chmod +x run-vector-search.sh

echo ""
echo "✅ Setup completed successfully!"
echo "To run the vector search test, use: ./run-vector-search.sh"
echo ""
echo "This bypasses environment validation and uses a local implementation." 