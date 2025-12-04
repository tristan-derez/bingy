import type { Schemas } from "shared";
import { toast } from "sonner";
import { useNowPlayingMovies } from "@/hooks/useMovies";
import { m } from "@/paraglide/messages";
import { LoadingSection } from "../loading/loading-section";
import { MovieCarousel } from "./movie-carousel";

interface NowPlayingMovieProps {
	title: string;
}

export const NowPlayingMovies = ({ title }: NowPlayingMovieProps) => {
	const { data, isLoading, error } = useNowPlayingMovies({ region: "US" });

	if (isLoading) {
		return <LoadingSection title={title} />;
	}

	if (error) {
		toast.error(m.error_failed_to_load({ title: title }));
		return null;
	}

	const today = new Date().toISOString().split("T")[0];
	const seenIds = new Set<number>();

	const filteredMovies =
		data?.results.filter((movie: Schemas.Movie) => {
			if (seenIds.has(movie.id) || movie.release_date > today) {
				return false;
			}
			seenIds.add(movie.id);
			return true;
		}) ?? [];

	return <MovieCarousel movies={filteredMovies} title={title} />;
};
