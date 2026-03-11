# Stage 1 — Build
FROM oven/bun:latest AS builder

WORKDIR /app

COPY . .

WORKDIR /app/apps/frontend

RUN bun install --frozen-lockfile

ARG VITE_API_URL
ARG VITE_APP_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_URL=${VITE_APP_URL}

RUN bun run build

# Stage 2 — Runtime
FROM caddy:alpine

# Copy built assets
COPY --from=builder /app/apps/frontend/dist /usr/share/caddy

COPY apps/frontend/Caddyfile /etc/caddy/Caddyfile