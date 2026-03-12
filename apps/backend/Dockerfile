FROM oven/bun:latest
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
WORKDIR /app/apps/backend
RUN bun build src/index.ts --outdir dist --target bun
CMD ["bun", "dist/index.js"]