#!/bin/bash
set -e

# ============================================================
# Adiyogi Cloud Run Deployment Script
#
# Usage:
#   ./infrastructure/cloudrun-deploy.sh                  # Deploy all services
#   ./infrastructure/cloudrun-deploy.sh interviewer      # Deploy one service
#
# Prerequisites:
#   - gcloud CLI installed and authenticated
#   - GCP project: adiyogi-ai-education (override with GCP_PROJECT_ID env var)
#   - Artifact Registry repo created (see setup below)
#
# First-time setup:
#   gcloud services enable run.googleapis.com artifactregistry.googleapis.com
#   gcloud artifacts repositories create adiyogi \
#     --repository-format=docker \
#     --location=asia-south1 \
#     --description="Adiyogi service images"
# ============================================================

PROJECT_ID="${GCP_PROJECT_ID:-adiyogi-ai-education}"
REGION="${GCP_REGION:-asia-south1}"
REGISTRY="${REGION}-docker.pkg.dev/${PROJECT_ID}/adiyogi"

SERVICES=("interviewer" "question-bank" "curator" "evaluation")

# If a specific service is provided, deploy only that
if [ -n "$1" ]; then
  SERVICES=("$1")
fi

echo "============================================"
echo "Deploying to project: ${PROJECT_ID}"
echo "Region: ${REGION}"
echo "Services: ${SERVICES[*]}"
echo "============================================"

for SERVICE in "${SERVICES[@]}"; do
  echo ""
  echo "--- Deploying ${SERVICE} ---"

  IMAGE="${REGISTRY}/adiyogi-${SERVICE}:latest"

  # Build the container
  echo "Building image: ${IMAGE}"
  docker build \
    --build-arg SERVICE="${SERVICE}" \
    -t "${IMAGE}" \
    -f services/Dockerfile \
    .

  # Push to Artifact Registry
  echo "Pushing image..."
  docker push "${IMAGE}"

  # Deploy to Cloud Run
  echo "Deploying to Cloud Run..."
  gcloud run deploy "adiyogi-${SERVICE}" \
    --image "${IMAGE}" \
    --region "${REGION}" \
    --platform managed \
    --port 8080 \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --timeout 300 \
    --allow-unauthenticated \
    --set-env-vars "NODE_ENV=production" \
    --set-env-vars "GOOGLE_CLOUD_PROJECT=${PROJECT_ID}" \
    --quiet

  # Get the service URL
  URL=$(gcloud run services describe "adiyogi-${SERVICE}" \
    --region "${REGION}" \
    --format "value(status.url)" 2>/dev/null)

  echo "✓ ${SERVICE} deployed at: ${URL}"
  echo ""
done

echo "============================================"
echo "All services deployed successfully!"
echo ""
echo "Service URLs:"
for SERVICE in "${SERVICES[@]}"; do
  URL=$(gcloud run services describe "adiyogi-${SERVICE}" \
    --region "${REGION}" \
    --format "value(status.url)" 2>/dev/null || echo "N/A")
  echo "  ${SERVICE}: ${URL}"
done
echo "============================================"
