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

export type PersonFromCast = Pretty<
	Omit<Person, "media_type"> & {
		cast_id: number;
		credit_id: string;
		character: string;
		order: number;
	}
>;

export type PersonFromCrew = Pretty<
	Omit<Person, "media_type"> & {
		credit_id: string;
		department: string;
		job: string;
	}
>;

export type CastPersonInAggregatedTvCredits = Pretty<
	Omit<Person, "media_type"> & {
		roles: Role[];
		total_episode_count: number;
		order: number;
	}
>;

export type CrewPersonInAggregatedTvCredits = Pretty<
	Omit<Person, "media_type"> & {
		jobs: Job[];
		total_episode_count: number;
		department: string;
	}
>;

type Role = Pretty<{
	credit_id: string;
	character: string;
	episode_count: number;
}>;

type Job = Pretty<{
	credit_id: string;
	job: string;
	episode_count: number;
}>;

export type CrewMember = {
	adult: boolean;
	gender: number | null;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string | null;
	credit_id: string;
	department: string;
	job: string;
};

export type CastMember = {
	adult: boolean;
	gender: number | null;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: string | null;
	cast_id: number;
	character: string;
	credit_id: string;
	order: number;
};
