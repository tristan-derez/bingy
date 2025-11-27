import type { Schemas } from "shared";
import { toast } from "sonner";
import { useTopRatedMovies } from "@/hooks/useMovies";
import { LoadingSection } from "../loading/loading-section";
import { MovieCarousel } from "./movie-carousel";

interface TopRatedMoviesProps {
	title: string;
}

export const TopRatedMovies = ({ title }: TopRatedMoviesProps) => {
	const { data, isLoading, error } = useTopRatedMovies({ region: "US" });

	if (isLoading) {
		return <LoadingSection title={title} />;
	}

	if (error) {
		toast.error(`Failed to load ${title}`);
		return null;
	}

	const seenIds = new Set<number>();

	const filteredMovies =
		data?.results.filter((movie: Schemas.Movie) => {
			if (seenIds.has(movie.id)) {
				return false;
			}
			seenIds.add(movie.id);
			return true;
		}) ?? [];

	return <MovieCarousel movies={filteredMovies} title={title} />;
};
