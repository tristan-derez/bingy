import { RedisClient } from "bun";
import env from "./env";
import { logger } from "./logger";

const cacheRedis = new RedisClient(`${env.REDIS_URL}/1`);

export const cacheClient = {
	get: async (key: string): Promise<string | null> => {
		try {
			const value = await cacheRedis.get(key);
			return value as string | null;
		} catch (error) {
			logger.error(error, `Cache get error for key ${key}`);
			return null;
		}
	},
	set: async (key: string, value: string, ttl?: number): Promise<void> => {
		try {
			await cacheRedis.set(key, value);
			if (ttl) {
				await cacheRedis.expire(key, ttl);
			}
		} catch (error) {
			logger.error(error, `Cache set error for key ${key}`);
		}
	},
	delete: async (key: string): Promise<void> => {
		try {
			await cacheRedis.del(key);
		} catch (error) {
			logger.error(error, `Cache delete error for key ${key}`);
		}
	},
	flush: async (): Promise<void> => {
		try {
			await cacheRedis.send("FLUSHDB", []);
		} catch (error) {
			logger.error(error, "Cache flush error");
		}
	},
};
