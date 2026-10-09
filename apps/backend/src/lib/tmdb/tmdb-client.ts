import { FetchError, ofetch } from "ofetch";
import { EndpointParameters, EndpointPath, Fetcher, Method } from "shared";
import { logger } from "#lib/logger";
import { cacheClient } from "../cache-client";
import { createApiClient } from "./tmdb";

export class TmdbError extends Error {
	constructor(
		public status: number,
		public statusText: string,
	) {
		super(`Request failed: ${status} ${statusText}`);
		this.name = "TmdbError";
	}
}

const DEFAULT_CACHE_TTL = 4 * 60 * 60;

function generateCacheKey(
	method: Method,
	path: string,
	query?: Record<string, string | number | boolean>,
): string {
	const queryString = query
		? Object.entries(query)
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([k, v]) => `${k}=${v}`)
				.join("&")
		: "";
	return `tmdb:${method}:${path}${queryString ? `:${queryString}` : ""}`;
}

export const tmdbFetch: Fetcher = async <TResponse>(
	method: Method,
	baseUrl: string,
	path: EndpointPath,
	apiKey: string,
	parameters: EndpointParameters = {},
	cacheTtl: number = DEFAULT_CACHE_TTL,
) => {
	let finalPath = path as string;

	if (parameters.path) {
		for (const [key, value] of Object.entries(parameters.path)) {
			finalPath = finalPath.replace(
				`{${key}}`,
				encodeURIComponent(String(value)),
			);
		}
	}

	const query = parameters.query as
		| Record<string, string | number | boolean>
		| undefined;

	// Check cache for GET requests (skip if cacheTtl is 0)
	if (method.toLowerCase() === "get" && cacheTtl > 0) {
		const cacheKey = generateCacheKey(method, finalPath, query);
		const cached = await cacheClient.get(cacheKey);

		if (cached !== null) {
			logger.info(`Cache hit: ${cacheKey}`);
			return JSON.parse(cached) as TResponse;
		}
	}

	try {
		const response = await ofetch<TResponse>(`${baseUrl}${finalPath}`, {
			method: method.toUpperCase(),
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
			query,
			body: parameters.body as Record<string, unknown>,
			retry: 1,
			retryDelay: 1000,
		});

		// Cache GET responses (skip if cacheTtl is 0)
		if (method.toLowerCase() === "get" && cacheTtl > 0) {
			const cacheKey = generateCacheKey(method, finalPath, query);
			logger.info(`Cache set: ${cacheKey}`);
			await cacheClient.set(cacheKey, JSON.stringify(response), cacheTtl);
		}

		return response;
	} catch (error) {
		if (error instanceof FetchError) {
			throw new TmdbError(
				error.status || 500,
				error.statusText || error.message,
			);
		}
		throw error;
	}
};

export const tmdbClient = createApiClient(tmdbFetch);
