#!/bin/bash

echo "===== Vector Search Testing Suite ====="
echo ""

echo "1. Running mock direct test..."
./src/server/vector-search/run-direct-test.sh
DIRECT_TEST_EXIT_CODE=$?

echo ""
echo "2. Running advanced test..."
NODE_ENV=development node -r dotenv/config ./node_modules/.bin/tsx src/server/vector-search/run-advanced-test.ts dotenv_config_path=src/server/vector-search/.env.test
ADVANCED_TEST_EXIT_CODE=$?

echo ""
echo "===== Test Results ====="
echo "Direct test: $([ $DIRECT_TEST_EXIT_CODE -eq 0 ] && echo 'SUCCESS' || echo 'FAILED')"
echo "Advanced test: $([ $ADVANCED_TEST_EXIT_CODE -eq 0 ] && echo 'SUCCESS' || echo 'FAILED')"

# Return overall success only if all tests passed
if [ $DIRECT_TEST_EXIT_CODE -eq 0 ] && [ $ADVANCED_TEST_EXIT_CODE -eq 0 ]; then
  echo "All tests completed successfully!"
  exit 0
else
  echo "One or more tests failed"
  exit 1
fi 