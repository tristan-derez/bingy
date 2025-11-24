import type { Pretty } from "./generic";
import type { CastMember, CastMemberForEpisode, CrewMember } from "./person";

export type EpisodeWithCrewAndGuestStars = Pretty<
	Omit<Episode, "media_type"> & {
		crew: CrewMember[];
		guest_stars: CastMember[];
	}
>;

type Episode = Pretty<{
	id: number;
	name: string;
	overview: string;
	media_type: "tv_episode";
	vote_average: number;
	vote_count: string;
	air_date: string | null;
	episode_number: number;
	episode_type: string;
	production_code: string;
	runtime: number | null;
	season_number: number;
	show_id: number;
	still_path: string | null;
}>;

export type TvEpisodeDetails = Pretty<{
	air_date: string | null;
	crew: CrewMember[];
	episode_number: number;
	guest_stars: CastMemberForEpisode[];
	name: string;
	overview: string;
	id: number;
	production_code: string;
	runtime: number | null;
	season_number: number;
	still_path: string | null;
	vote_average: number;
	vote_count: number;
}>;

export type TvEpisodeCredits = Pretty<{
	cast: CastMemberForEpisode[];
	crew: CrewMember[];
	guest_stars: CastMemberForEpisode[];
	id: number;
}>;
