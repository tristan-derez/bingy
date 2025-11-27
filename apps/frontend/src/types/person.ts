import type { Pretty } from "./generic";
import type {
	Media,
	MediaWithCastCredits,
	MediaWithCrewCredits,
	MovieMediaWithCastCredits,
	MovieMediaWithCrewCredits,
	TvMediaWithCastCredits,
	TvMediaWithCrewCredits,
} from "./media";

export type PersonEndpoint = Pretty<"">;

export type PersonParams = Pretty<{
	append_to_response: AllowedAppends | `${AllowedAppends},${string}`;
	language: string;
}>;
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
		external_ids?: PersonExternalIds;
		combined_credits?: PersonCombinedCredits;
		translations?: PersonTranslations;
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

export type CastMemberForEpisode = Pretty<Omit<CastMember, "cast_id">>;

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

type AppendToResponseMap = {
	combined_credits: { combined_credits: PersonCombinedCredits };
	external_ids: { external_ids: PersonExternalIds };
	translations: { translations: PersonTranslations };
};

export type AllowedAppends = keyof AppendToResponseMap;

export type PersonCombinedCredits = Pretty<{
	cast: MediaWithCastCredits[];
	crew: MediaWithCrewCredits[];
	id: number;
}>;

export type PersonMovieCredits = Pretty<{
	cast: MovieMediaWithCastCredits[];
	crew: MovieMediaWithCrewCredits[];
	id: number;
}>;

export type PersonTvCredits = Pretty<{
	cast: TvMediaWithCastCredits[];
	crew: TvMediaWithCrewCredits[];
	id: number;
}>;

export type PersonImages = Pretty<{
	id: number;
	profiles: Image[];
}>;

export type PersonExternalIds = Pretty<{
	id: number;
	freebase_mid: string;
	freebase_id: string;
	imdb_id: string;
	tvrage_id: number;
	wikidata_id: string;
	facebook_id: string;
	instagram_id: string;
	tiktok_id: string;
	twitter_id: string;
	youtube_id: string;
}>;

export type PersonTranslations = Pretty<{
	id: number;
	translations: Translation<PersonTranslationsData>[];
}>;

type PersonTranslationsData = Pretty<{
	biography: string;
	name: string;
}>;

export type Translation<T> = {
	iso_3166_1: string;
	iso_639_1: string;
	name: string;
	english_name: string;
	data: T[];
};

export type Image = Pretty<{
	aspect_ratio: number;
	height: number;
	iso_3166_1?: string | null;
	iso_639_1?: string | null;
	file_path: string | null;
	vote_average: number;
	vote_count: number;
	width: number;
}>;
