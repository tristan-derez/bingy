import { useQueries } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { fetchTvSeasonResources } from "@/api/tv";
import { ResourceNotFound } from "@/components/errors/resource-not-found";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { CreditEpisodesList } from "./credit-episodes-list";

interface CreditEpisodesContainerProps {
	creditDetails: Schemas.CreditDetails;
}

export const CreditEpisodesContainer = ({
	creditDetails,
}: CreditEpisodesContainerProps) => {
	const localeRegion = useAtomValue(localeRegionAtom);

	// movies should not be accessible from there
	if (creditDetails.media.media_type !== "tv") {
		return (
			<ResourceNotFound
				title={m.credit_episodes_container_wrong_type_title()}
				description={m.credit_episodes_container_wrong_type_desc()}
			/>
		);
	}

	const { job } = creditDetails;
	const {
		episodes,
		seasons,
		character,
		id: tvId,
		name,
		poster_path,
	} = creditDetails.media;
	const { person } = creditDetails;

	// if seasons.season_number is equal to episodes.season_number -> we dont fetch seasons since we already have the data
	const episodeSeasonNumbers = new Set(
		(episodes ?? []).map((ep) => ep.season_number),
	);
	const seasonsToFetch =
		seasons?.filter(
			(season) => !episodeSeasonNumbers.has(season.season_number),
		) ?? [];

	const seasonQueries = useQueries({
		queries: seasonsToFetch.map((season) => ({
			queryKey: ["tv", tvId, "season", season.season_number],
			queryFn: async () => {
				const response = await fetchTvSeasonResources(
					tvId,
					season.season_number,
					{ params: { language: localeRegion } },
				);
				return response as Schemas.TvSeasonDetails;
			},
		})),
	});

	if (seasonQueries.some((query) => query.isLoading)) {
		return <LoadingCentered />;
	}

	const seasonEpisodes = seasonQueries.flatMap(
		(query) => query.data?.episodes ?? [],
	);

	const allEpisodes = [...(episodes ?? []), ...seasonEpisodes].sort((a, b) => {
		// season 0 is a special season (making-of etc...) so it goes last in the list
		if (a.season_number === 0 && b.season_number !== 0) return 1;
		if (b.season_number === 0 && a.season_number !== 0) return -1;

		if (a.season_number !== b.season_number) {
			return a.season_number - b.season_number;
		}
		return a.episode_number - b.episode_number;
	});

	if (allEpisodes.length === 0) {
		return (
			<ResourceNotFound
				title={m.credit_episodes_container_episodes_not_found_title()}
				description={m.credit_episodes_container_episodes_not_found_title()}
			/>
		);
	}

	const guestEpisodeIds = new Set(episodes?.map((ep) => ep.id) ?? []);

	return (
		<CreditEpisodesList
			tvId={tvId}
			personName={person.name}
			character={character}
			job={job}
			showName={name}
			posterPath={poster_path}
			episodes={allEpisodes}
			guestEpisodeIds={guestEpisodeIds}
		/>
	);
};
