#!/bin/bash
set -e

echo "Building Next.js app..."
npm run build

echo "Syncing to S3..."
aws s3 sync out/ s3://adiyogi-ai-education --delete

echo "Invalidating CloudFront cache..."
# aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"

echo "Deployment complete!"
