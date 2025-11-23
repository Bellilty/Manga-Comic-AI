#!/bin/bash
echo "Testing OLD API endpoint..."
curl -X POST https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2 \
  -H "Authorization: Bearer $HF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"inputs":"Hello"}' 2>&1 | head -5

echo -e "\n\nTesting NEW ROUTER endpoint..."
curl -X POST https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2 \
  -H "Authorization: Bearer $HF_TOKEN" \
  -H "Content-Type: application/json" \
  -H "x-use-cache: false" \
  -d '{"inputs":"Hello"}' 2>&1 | head -5
