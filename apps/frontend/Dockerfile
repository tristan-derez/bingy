FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json bun.lock ./

COPY apps/frontend/package.json ./apps/frontend/
COPY apps/shared/package.json ./apps/shared/
COPY apps/backend/package.json ./apps/backend/

RUN bun install --frozen-lockfile --filter=./apps/frontend --filter=./apps/backend

# frontend needs shared for runtime code and backend for TypeScript type resolution
COPY apps/frontend ./apps/frontend
COPY apps/shared ./apps/shared
COPY apps/backend ./apps/backend

WORKDIR /app/apps/frontend

ARG VITE_API_URL
ARG VITE_APP_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_URL=${VITE_APP_URL}

RUN bun run build

FROM caddy:alpine

COPY --from=builder /app/apps/frontend/dist /usr/share/caddy
COPY apps/frontend/Caddyfile /etc/caddy/Caddyfile