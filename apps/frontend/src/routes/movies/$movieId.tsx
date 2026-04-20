import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { MovieDetailView } from "@/components/movies/movie-details";
import { useMovie, useMovieResource } from "@/hooks/useMovies";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";
import { getReleaseDate } from "@/utils/release-dates";
import { getSocialUrls } from "@/utils/social-urls";

export const Route = createFileRoute("/movies/$movieId")({
	component: MovieDetailsPage,
});

type ReleaseDates = {
	results: Array<{
		iso_3166_1: string;
		release_dates: Array<{ type: number; release_date: string }>;
	}>;
};

function MovieDetailsPage() {
	const { movieId } = Route.useParams();
	const localeRegion = useAtomValue(localeRegionAtom);
	const region = useAtomValue(regionAtom);

	const {
		data: movie,
		isLoading,
		isError,
	} = useMovie(Number(movieId), {
		append_to_response: "credits,external_ids,watch/providers",
		language: localeRegion,
	});

	const { data: releaseDates } = useMovieResource<ReleaseDates>(
		Number(movieId),
		"release_dates",
		{},
	);

	const { date: releaseDate, region: releaseRegion } = getReleaseDate(
		releaseDates,
		region,
		movie?.release_date,
	);

	const directors =
		movie?.credits?.crew
			.filter((person) => person.job === "Director")
			.map((person) => ({
				id: person.id,
				name: person.name,
				gender: person.gender,
			})) ?? [];
	const cast = movie?.credits?.cast?.slice(0, 10) || [];
	const socialUrls = movie?.external_ids
		? getSocialUrls(movie.external_ids)
		: {};
	const collection = movie ? movie.belongs_to_collection : undefined;
	const watchProviders = movie?.["watch/providers"];

	return (
		<MovieDetailView
			movie={movie}
			socials={socialUrls}
			directors={directors}
			cast={cast}
			watchProviders={watchProviders}
			collection={collection}
			isLoading={isLoading}
			isError={isError}
			releaseDate={releaseDate}
			releaseRegion={releaseRegion}
		/>
	);
}
