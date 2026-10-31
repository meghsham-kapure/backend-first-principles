#!/usr/bin/env bash
# Generates a mix of successful, 4xx, and 5xx requests.
BASE=${BASE:-http://localhost:4000}
AUTH="Authorization: Bearer dev-token"
JSON="Content-Type: application/json"

echo "401 (no token)";   curl -s -o /dev/null -w "%{http_code}\n" $BASE/todos
echo "create";           curl -s -X POST $BASE/todos -H "$AUTH" -H "$JSON" -d '{"title":"Write logs","priority":"high"}'; echo
echo "400 (no title)";   curl -s -o /dev/null -w "%{http_code}\n" -X POST $BASE/todos -H "$AUTH" -H "$JSON" -d '{}'
echo "list";             curl -s -o /dev/null -w "%{http_code}\n" $BASE/todos -H "$AUTH"
echo "404";              curl -s -o /dev/null -w "%{http_code}\n" $BASE/todos/64b7f0f0f0f0f0f0f0f0f0f0 -H "$AUTH"
echo "500";              curl -s -o /dev/null -w "%{http_code}\n" $BASE/debug/error -H "$AUTH"
