import { toast } from "sonner";
import { useTopRatedMovies } from "@/hooks/useMovies";
import type { Movie } from "@/types/movie";
import { LoadingSection } from "../loading/loading-section";
import { MovieCarousel } from "./movie-carousel";

export const TopRatedMovies = () => {
	const { data, isLoading, error } = useTopRatedMovies({ region: "US" });

	if (isLoading) {
		return <LoadingSection title="Top Rated Movies" />;
	}

	if (error) {
		toast.error("Failed to load top rated movies");
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

	return <MovieCarousel movies={filteredMovies} title="Top Rated Movies" />;
};
