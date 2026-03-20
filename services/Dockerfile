# Multi-stage Dockerfile for Adiyogi Cloud Run services
# Usage: docker build --build-arg SERVICE=interviewer -t adiyogi-interviewer .

ARG SERVICE=interviewer

FROM node:20-slim

ARG SERVICE
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV SERVICE_NAME=${SERVICE}

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy root package.json for shared dependencies
COPY package.json ./
RUN npm install --production --ignore-scripts

# Copy shared source (services import from ../../src/)
COPY src/ ./src/

# Copy service package.json and install service deps
COPY services/${SERVICE}/package.json ./services/${SERVICE}/
RUN cd services/${SERVICE} && npm install --production --ignore-scripts

# Install tsx for running TypeScript directly
RUN npm install -g tsx

# Copy service source
COPY services/${SERVICE}/ ./services/${SERVICE}/

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD curl -f http://localhost:8080/health || exit 1

# Shell form so SERVICE_NAME env var expands
CMD tsx services/${SERVICE_NAME}/index.ts
