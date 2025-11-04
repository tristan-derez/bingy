import type {
	EndpointParameters,
	EndpointPath,
	Fetcher,
	Method,
} from "#types/tmdb";
import { createApiClient } from "./tmdb";

export const tmdbFetch: Fetcher = async <TResponse>(
	method: Method,
	baseUrl: string,
	path: EndpointPath,
	apiKey: string,
	parameters: EndpointParameters = {},
) => {
	let finalUrl = `${baseUrl}${path}`;
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${apiKey}`,
	};

	if (parameters.path) {
		for (const [key, value] of Object.entries(parameters.path)) {
			finalUrl = finalUrl.replace(
				`{${key}}`,
				encodeURIComponent(String(value)),
			);
		}
	}

	if (parameters.query) {
		const queryString = new URLSearchParams(
			Object.entries(parameters.query)
				.filter(([, v]) => v != null)
				.map(([k, v]) => [k, String(v)]),
		).toString();
		if (queryString) finalUrl += `?${queryString}`;
	}

	const body =
		method === "post" ||
		method === "put" ||
		method === "patch" ||
		method === "delete"
			? JSON.stringify(parameters.body ?? {})
			: undefined;

	const res = await fetch(finalUrl, { method, headers, body });
	if (!res.ok)
		throw new Error(`Request failed: ${res.status} ${res.statusText}`);
	return res.json() as Promise<TResponse>;
};

export const tmdbClient = createApiClient(tmdbFetch);
