import type { Pretty } from "./generic";
import type { CastMember, CrewMember } from "./person";

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
