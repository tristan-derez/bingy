import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { MovieCreditsView } from "@/components/movies/movie-credits";
import { useMovieResource } from "@/hooks/useMovies";
import { localeRegionAtom } from "@/lib/atoms/region";

export const Route = createFileRoute("/movies/$movieId_/credits")({
	component: MovieCreditsPage,
});

function MovieCreditsPage() {
	const { movieId } = Route.useParams();
	const router = useRouter();
	const localeRegion = useAtomValue(localeRegionAtom);

	const {
		data: credits,
		isLoading,
		isError,
	} = useMovieResource<Schemas.MovieCredits>(Number(movieId), "credits", {
		language: localeRegion,
	});

	return (
		<MovieCreditsView
			credits={credits}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
