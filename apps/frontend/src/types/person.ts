import type { Pretty } from "./generic";
import type { Media } from "./media";

export type Person = Pretty<{
	adult: boolean;
	id: number;
	name: string;
	original_name: string;
	media_type: string;
	popularity: number;
	gender: number;
	known_for_department: string;
	profile_path: string | null;
}>;

export type PersonShort = Pretty<{
	id: number;
	credit_id: string;
	name: string;
	original_name?: string;
	gender: number;
	profile_path: string | null;
}>;

export type PersonExtended = Pretty<
	Person & {
		known_for: Media[];
	}
>;

export type PersonDetails = Pretty<
	Person & {
		also_known_as: string[];
		biography: string;
		birthday: string;
		deathday: string | null;
		homepage: string | null;
		imdb_id: string;
		place_of_birth: string;
	}
>;
