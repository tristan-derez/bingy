FROM oven/bun:latest

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy monorepo
COPY . .

# Install production dependencies
RUN bun install --production --frozen-lockfile

# Build backend
WORKDIR /app/apps/backend
RUN bun build src/index.ts --outdir dist --target bun

CMD ["bun", "dist/index.js"]