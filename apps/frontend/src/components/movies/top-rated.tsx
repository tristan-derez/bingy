import type { Schemas } from "shared";
import { LoadingSection } from "@/components/loading/loading-section";
import { MovieCarousel } from "@/components/movies/movie-carousel";
import { toast } from "@/components/toast/toast";
import { m } from "@/paraglide/messages";

interface TopRatedMoviesProps {
	title: string;
	movies: Schemas.PaginatedResponse<Schemas.Movie>;
	isLoading: boolean;
	isError: boolean;
}

export const TopRatedMovies = ({
	title,
	movies,
	isLoading,
	isError,
}: TopRatedMoviesProps) => {
	if (isLoading) {
		return <LoadingSection title={title} />;
	}

	if (isError) {
		toast.error({ title: m.error_failed_to_load({ title }) });
		return null;
	}

	const seenIds = new Set<number>();

	const filteredMovies =
		movies?.results.filter((movie: Schemas.Movie) => {
			if (seenIds.has(movie.id)) {
				return false;
			}
			seenIds.add(movie.id);
			return true;
		}) ?? [];

	return <MovieCarousel movies={filteredMovies} title={title} />;
};
