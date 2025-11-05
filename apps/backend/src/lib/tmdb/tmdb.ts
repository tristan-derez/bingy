import env from "#lib/env";
import type { Fetcher, GetEndpoints, MaybeOptionalArg } from "#types/tmdb";

export class ApiClient {
	readonly baseUrl: string;
	readonly apiKey: string;

	constructor(
		public fetcher: Fetcher,
		baseUrl = "https://api.themoviedb.org/3",
		apiKey = env.TMDB_API_KEY,
	) {
		this.baseUrl = baseUrl;
		this.apiKey = apiKey;
	}

	get<Path extends keyof GetEndpoints, TEndpoint extends GetEndpoints[Path]>(
		path: Path,
		...params: MaybeOptionalArg<TEndpoint["parameters"]>
	): Promise<TEndpoint["response"]> {
		return this.fetcher("get", this.baseUrl, path, this.apiKey, params[0]);
	}
}

export function createApiClient(fetcher: Fetcher, _baseUrl?: string) {
	return new ApiClient(fetcher);
}
