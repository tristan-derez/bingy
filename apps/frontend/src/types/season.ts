import type { ProductionCompany } from "./company";
import type { EpisodeWithCrewAndGuestStars } from "./episode";
import type { Pretty } from "./generic";

export type TvSeasonDetails = Pretty<{
	_id: string;
	air_date: string | null;
	episodes: EpisodeWithCrewAndGuestStars[];
	name: string;
	networks: ProductionCompany[];
	overview: string;
	id: number;
	poster_path: string | null;
	season_number: number;
	vote_average: number;
}>;
