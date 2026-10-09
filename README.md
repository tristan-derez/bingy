# Bingy

Bingy is a web app for tracking the movies and TV shows you watch and finding your next favorite. Explore titles and their details, log what you've watched, rate and review them, and build lists to share with others.

## Features

- **Discover**: browse movies and TV shows, with details like cast, crew, and release information.
- **Track**: keep a watch history, follow TV show progress, and save favorites.
- **Rate and review**: score titles and write reviews.
- **Lists**: create custom lists and share them with others.

## Tech stack

Bingy is a TypeScript monorepo managed with [Bun](https://bun.sh/).

- **Frontend**: React, TanStack Router and Query, Vite, Tailwind CSS
- **Backend**: Hono, Better Auth, Drizzle ORM, Zod
- **Database and cache**: PostgreSQL and Redis, run locally with Docker Compose
- **Image storage**: Cloudflare R2 (S3-compatible)

Movie and TV metadata comes from the [TMDB API](https://www.themoviedb.org/).

### Repository layout

```
apps/
  backend/   Hono API, Drizzle schemas and migrations, auth, email templates
  frontend/  React single-page app
  shared/    Types and utilities shared between apps (TMDB types, generic helpers)
docker-compose.yml   Local PostgreSQL and Redis
```

## Prerequisites

- [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/) with Docker Compose
- A [TMDB API key](https://www.themoviedb.org/settings/api)

## Getting started

1. Install dependencies:

   ```bash
   bun install
   ```

2. Create the environment files from their templates and fill in the values:

   ```bash
   cp .env.template .env
   cp apps/backend/.env.template apps/backend/.env
   cp apps/frontend/.env.template apps/frontend/.env
   ```

   - **Root `.env`**: only used by Docker Compose to set up the PostgreSQL database (`DB_*`) and Redis (`REDIS_*`).
   - **`apps/backend/.env`**: database access, Redis access, API URL, API version, port, frontend URL, Google OAuth client ID and secret, Cloudflare account ID, R2 bucket URL and public URL, S3 access keys, and the TMDB API key. See `apps/backend/src/lib/env.ts` for the full schema.
   - **`apps/frontend/.env`**: the backend URL (`VITE_API_URL`), the app URL (`VITE_APP_URL`), the app environment (`VITE_APP_ENV`), and any additional allowed dev server hosts (`VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`).

3. Start the development environment:

   ```bash
   bun dev
   ```

   This starts PostgreSQL and Redis with Docker Compose, then runs the API, the frontend, and Drizzle Studio in parallel.

## Scripts

Run from the repository root:

| Command          | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `bun dev`        | Start the database services, API, frontend, and Drizzle Studio |
| `bun db:start`   | Start only the PostgreSQL and Redis containers              |
| `bun typecheck`  | Type-check all packages with `tsc --build`                  |

## Project status

Bingy is in early development (version 0.1.0) and is not yet published.
