import type { Pretty } from "./generic";
import type { MovieInCollection } from "./movie";

export type CollectionParams = Pretty<{
	language: string;
}>;

export type Collection = Pretty<{
	id: number;
	name: string;
	poster_path: string | null;
	backdrop_path: string | null;
}>;

export type CollectionDetails = Pretty<{
	id: number;
	name: string;
	original_language: string;
	original_name: string;
	overview: string;
	poster_path: string | null;
	backdrop_path: string | null;
	parts: MovieInCollection[];
}>;
