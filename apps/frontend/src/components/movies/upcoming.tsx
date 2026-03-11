import type { Schemas } from "shared";
import { toast } from "sonner";
import { LoadingSection } from "@/components/loading/loading-section";
import { MovieCarousel } from "@/components/movies/movie-carousel";
import { m } from "@/paraglide/messages";

interface UpcomingMoviesProps {
	title: string;
	movies: Schemas.PaginatedResponse<Schemas.Movie>;
	isLoading: boolean;
	isError: boolean;
}

export const UpcomingMovies = ({
	title,
	movies,
	isLoading,
	isError,
}: UpcomingMoviesProps) => {
	if (isLoading) {
		return <LoadingSection title={title} />;
	}

	if (isError) {
		toast.error(m.error_failed_to_load({ title }));
		return null;
	}

	const today = new Date().toISOString().split("T")[0];
	const seenIds = new Set<number>();

	const filteredMovies =
		movies?.results
			.filter((movie: Schemas.Movie) => {
				if (seenIds.has(movie.id) || movie.release_date <= today) {
					return false;
				}
				seenIds.add(movie.id);
				return true;
			})
			.sort(
				(a, b) =>
					new Date(a.release_date).getTime() -
					new Date(b.release_date).getTime(),
			) ?? [];

	return <MovieCarousel movies={filteredMovies} title={title} />;
};
