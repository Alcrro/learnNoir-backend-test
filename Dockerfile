# syntax=docker/dockerfile:1

# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install all deps (including devDependencies for esbuild)
COPY package*.json ./
RUN npm ci

# Copy source and tsconfig (esbuild reads tsconfig for path aliases)
COPY src ./src
COPY tsconfig.json ./

# Bundle to a single ESM file — esbuild strips type-only imports, no dist/ needed in image
RUN node_modules/.bin/esbuild src/server.ts \
    --bundle \
    --platform=node \
    --target=node20 \
    --format=esm \
    --outfile=dist/server.js \
    --packages=external

# ─── Stage 2: Runtime ────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled bundle from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Run as non-root for reduced attack surface
USER node

CMD ["node", "dist/server.js"]
