import { toast } from "sonner";
import { useUpcomingMovies } from "@/hooks/useMovies";
import type { Movie } from "@/types/movie";
import { LoadingSection } from "../loading/loading-section";
import { MovieCarousel } from "./movie-carousel";

export const UpcomingMovies = () => {
	const { data, isLoading, error } = useUpcomingMovies({ region: "US" });

	if (isLoading) {
		return <LoadingSection title="In Theaters Now" />;
	}

	if (error) {
		toast.error("error while fetching now playing movies");
		return null;
	}

	const today = new Date().toISOString().split("T")[0];
	const seenIds = new Set<number>();

	const filteredMovies =
		data?.results.filter((movie: Movie) => {
			if (seenIds.has(movie.id) || movie.release_date < today) {
				return false;
			}
			seenIds.add(movie.id);
			return true;
		}) ?? [];

	return <MovieCarousel title="Upcoming" movies={filteredMovies} />;
};
