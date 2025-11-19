import { toast } from "sonner";
import { useNowPlayingMovies } from "@/hooks/useMovies";
import { LoadingSection } from "../loading/loading-section";
import { MovieCarousel } from "./movie-carousel";

export const NowPlayingMovies = () => {
	const { data, isLoading, error } = useNowPlayingMovies();

	if (isLoading) {
		return <LoadingSection title="In Theaters Now" />;
	}

	if (error) {
		toast.error("error while fetching now playing movies");
		return null;
	}

	return <MovieCarousel title="In Theaters Now" movies={data?.results ?? []} />;
};
