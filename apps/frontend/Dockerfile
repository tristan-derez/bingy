# Stage 1 — Build
FROM oven/bun:latest AS builder

WORKDIR /app

# copy workspace config
COPY package.json bun.lock ./

# copy package.json files for needed workspaces
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/shared/package.json ./apps/shared/

# install from root
RUN bun install --frozen-lockfile --filter=./apps/frontend

# copy source code for frontend and shared
COPY apps/frontend ./apps/frontend
COPY apps/shared ./apps/shared

WORKDIR /app/apps/frontend

ARG VITE_API_URL
ARG VITE_APP_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_URL=${VITE_APP_URL}

RUN bun run build

# Stage 2 — Runtime
FROM caddy:alpine

COPY --from=builder /app/apps/frontend/dist /usr/share/caddy
COPY apps/frontend/Caddyfile /etc/caddy/Caddyfile