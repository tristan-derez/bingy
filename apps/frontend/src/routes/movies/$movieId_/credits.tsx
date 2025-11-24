import { createFileRoute, useRouter } from "@tanstack/react-router";
import { MovieCreditsView } from "@/components/movies/movie-credits";
import { useMovieResource } from "@/hooks/useMovies";
import type { MovieCredits } from "@/types/movie";

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
	} = useMovieResource<MovieCredits>(Number(movieId), "credits");

	return (
		<MovieCreditsView
			credits={credits}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
