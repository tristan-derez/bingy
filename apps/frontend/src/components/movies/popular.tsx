import { toast } from "sonner";
import { usePopularMovies } from "@/hooks/useMovies";
import { LoadingSection } from "../loading/loading-section";
import { MovieCarousel } from "./movie-carousel";

export const PopularMovies = () => {
	const { data, isLoading, error } = usePopularMovies({ region: "US" });

	if (isLoading) {
		return <LoadingSection title="In Theaters Now" />;
	}

	if (error) {
		toast.error("error while fetching now playing movies");
		return null;
	}

	return <MovieCarousel title="Popular" movies={data?.results ?? []} />;
};
