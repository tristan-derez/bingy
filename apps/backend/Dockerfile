# Stage 1 — Build
FROM oven/bun:alpine AS builder


WORKDIR /app

# Copy entire monorepo
COPY . .

# Install all dependencies (workspaces included)
RUN bun install --frozen-lockfile

# Build backend
WORKDIR /app/apps/backend
RUN bun build src/index.ts --outdir dist --target bun

# Stage 2 — Runtime
FROM oven/bun:latest

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy monorepo dependency tree
COPY . .

# Install only production deps
RUN bun install --production --frozen-lockfile

# Copy compiled output
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

# Ensure runtime assets/migrations are available
COPY --from=builder /app/apps/backend/src/emails ./apps/backend/src/emails
COPY --from=builder /app/apps/backend/src/assets ./apps/backend/src/assets
COPY --from=builder /app/apps/backend/drizzle ./apps/backend/drizzle

WORKDIR /app/apps/backend

CMD ["bun", "dist/index.js"]
