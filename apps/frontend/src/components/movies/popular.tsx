import { toast } from "sonner";
import { usePopularMovies } from "@/hooks/useMovies";
import type { Movie } from "@/types/movie";
import { LoadingSection } from "../loading/loading-section";
import { MovieCarousel } from "./movie-carousel";

export const PopularMovies = () => {
	const { data, isLoading, error } = usePopularMovies({ region: "US" });

	if (isLoading) {
		return <LoadingSection title="Popular Movies" />;
	}

	if (error) {
		toast.error("Failed to load popular movies");
		return null;
	}

	const seenIds = new Set<number>();

	const filteredMovies =
		data?.results.filter((movie: Movie) => {
			if (seenIds.has(movie.id)) {
				return false;
			}
			seenIds.add(movie.id);
			return true;
		}) ?? [];

	return <MovieCarousel movies={filteredMovies} title="Popular Movies" />;
};
