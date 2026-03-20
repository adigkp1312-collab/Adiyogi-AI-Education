#!/bin/bash
set -e

echo "Deploying course-generator Lambda..."
cd lambda/course-generator
npm install --production
zip -r function.zip .
aws lambda update-function-code \
  --function-name adiyogi-course-generator \
  --zip-file fileb://function.zip
rm function.zip
cd ../..

echo "Deploying content-aggregator Lambda..."
cd lambda/content-aggregator
npm install --production
zip -r function.zip .
aws lambda update-function-code \
  --function-name adiyogi-content-aggregator \
  --zip-file fileb://function.zip
rm function.zip
cd ../..

echo "Lambda deployment complete!"
