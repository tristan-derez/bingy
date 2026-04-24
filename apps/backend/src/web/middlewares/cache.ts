import type { Context, Next } from "hono";
import { cacheClient } from "../../lib/cache-client";
import { logger } from "../../lib/logger";

const MAX_CACHE_SIZE = 5 * 1024 * 1024;
const DEFAULT_TTL = 28800;

const parseCacheControlMaxAge = (
	cacheControl: string | undefined | null,
): number | null => {
	if (!cacheControl) return null;

	const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
	if (maxAgeMatch) {
		return Number.parseInt(maxAgeMatch[1], 10);
	}

	return null;
};

export const cacheMiddleware = async (c: Context, next: Next) => {
	if (c.req.method !== "GET") {
		return next();
	}

	const cacheControl = c.req.header("Cache-Control");
	if (
		cacheControl?.includes("no-cache") ||
		cacheControl?.includes("no-store")
	) {
		return next();
	}

	const queryString = new URLSearchParams(c.req.query()).toString();
	const key = `cache:${c.req.path}${queryString ? `:${queryString}` : ""}`;

	const cached = await cacheClient.get(key);
	if (cached) {
		logger.info(`Cache hit: ${key}`);
		return c.json(JSON.parse(cached));
	}

	await next();

	if (!c.res) {
		return;
	}

	const res = c.res.clone();
	if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
		try {
			const body = await res.json();
			const bodyString = JSON.stringify(body);

			const size = new Blob([bodyString]).size;
			if (size > MAX_CACHE_SIZE) {
				logger.info(
					`Response too large to cache: ${key} (${(size / 1024 / 1024).toFixed(2)}MB)`,
				);
				return;
			}

			const responseCacheControl = res.headers.get("Cache-Control");
			const maxAge = parseCacheControlMaxAge(responseCacheControl);
			const ttl = maxAge ?? DEFAULT_TTL;

			await cacheClient.set(key, bodyString, ttl);
			const ttlDisplay =
				ttl >= 3600 ? `${Math.round(ttl / 3600)}h` : `${Math.round(ttl / 60)}m`;
			logger.info(`Cache set: ${key} (TTL: ${ttlDisplay})`);
		} catch (error) {
			logger.error(error, `Failed to cache response for ${key}`);
		}
	}
};
