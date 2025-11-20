import { createFileRoute, useRouter } from "@tanstack/react-router";
import { MovieDetailView } from "@/components/movies/movie-details";
import { useMovie, useMovieResource } from "@/hooks/useMovies";
import type { MovieCredits } from "@/types/movie";

export const Route = createFileRoute("/movies/$movieId")({
	component: MovieDetailsContainer,
});

function MovieDetailsContainer() {
	const router = useRouter();
	const { movieId } = Route.useParams();

	const { data, isLoading, isError } = useMovie(Number(movieId));
	const { data: credits } = useMovieResource<MovieCredits>(
		Number(movieId),
		"credits",
	);

	return (
		<MovieDetailView
			movie={data}
			credits={credits}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
