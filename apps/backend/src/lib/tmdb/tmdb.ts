import type { Fetcher, GetEndpoints, MaybeOptionalArg } from "#types/tmdb";

export class ApiClient {
	readonly baseUrl: string;

	constructor(
		public fetcher: Fetcher,
		baseUrl = "https://api.themoviedb.org/3",
	) {
		this.baseUrl = baseUrl;
	}

	get<Path extends keyof GetEndpoints, TEndpoint extends GetEndpoints[Path]>(
		path: Path,
		...params: MaybeOptionalArg<TEndpoint["parameters"]>
	): Promise<TEndpoint["response"]> {
		return this.fetcher("get", this.baseUrl, path, params[0]);
	}
}

export function createApiClient(fetcher: Fetcher, _baseUrl?: string) {
	return new ApiClient(fetcher);
}
