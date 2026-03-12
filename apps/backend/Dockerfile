FROM oven/bun:latest
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
# Need all deps for build (devDependencies include React types)
RUN bun install --frozen-lockfile
WORKDIR /app/apps/backend
# External React deps to prevent bundling JSX runtime
RUN bun build src/index.ts --outdir dist --target bun --external react --external react-dom --external @react-email/components
# Clean install of production deps only
RUN rm -rf node_modules && bun install --production --frozen-lockfile
CMD ["bun", "dist/index.js"]