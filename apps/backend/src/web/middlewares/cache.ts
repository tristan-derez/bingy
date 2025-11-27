import { redis } from "bun";
import type { Context, Next } from "hono";
import { logger } from "#lib/logger";

const cache = {
	get: async (key: string) => {
		return await redis.get(key);
	},
	set: async (key: string, value: string, ttl?: number) => {
		await redis.set(key, value);
		if (ttl) {
			await redis.expire(key, ttl);
		}
	},
	delete: async (key: string) => {
		await redis.del(key);
	},
};

export const cacheMiddleware = async (c: Context, next: Next) => {
	if (c.req.method !== "GET") {
		return next();
	}

	const queryString = new URLSearchParams(c.req.query()).toString();
	const key = `cache:${c.req.path}${queryString ? `:${queryString}` : ""}`;

	const cached = await cache.get(key);
	if (cached) {
		logger.info(`Cache hit: ${key}`);
		return c.json(JSON.parse(cached as string));
	}

	await next();

	const res = c.res.clone();
	if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
		const body = await res.json();
		await cache.set(key, JSON.stringify(body), 28800);
		logger.info(`Cache set: ${key}`);
	}
};
