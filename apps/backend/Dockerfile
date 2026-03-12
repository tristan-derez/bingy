FROM oven/bun:latest

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy monorepo
COPY . .

# Install production dependencies
RUN bun install --production --frozen-lockfile

# Set working directory to backend
WORKDIR /app/apps/backend

# Run source directly instead of building
CMD ["bun", "src/index.ts"]