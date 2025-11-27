import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { Schemas } from "shared";
import { MovieCreditsView } from "@/components/movies/movie-credits";
import { useMovieResource } from "@/hooks/useMovies";

export const Route = createFileRoute("/movies/$movieId_/credits")({
	component: MovieCreditsContainer,
});

function MovieCreditsContainer() {
	const { movieId } = Route.useParams();
	const router = useRouter();

	const {
		data: credits,
		isLoading,
		isError,
	} = useMovieResource<Schemas.MovieCredits>(Number(movieId), "credits");

	return (
		<MovieCreditsView
			credits={credits}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
