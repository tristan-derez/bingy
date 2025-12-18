import { FetchError, ofetch } from "ofetch";
import { EndpointParameters, EndpointPath, Fetcher, Method } from "shared";
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

export const tmdbFetch: Fetcher = async <TResponse>(
	method: Method,
	baseUrl: string,
	path: EndpointPath,
	apiKey: string,
	parameters: EndpointParameters = {},
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

	try {
		return await ofetch<TResponse>(`${baseUrl}${finalPath}`, {
			method: method.toUpperCase(),
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
			query: parameters.query as Record<string, string | number | boolean>,
			body: parameters.body as Record<string, unknown>,
			retry: 1,
			retryDelay: 1000,
		});
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
