import { toast } from "sonner";
import { useTopRatedMovies } from "@/hooks/useMovies";
import { LoadingSection } from "../loading/loading-section";
import { MovieCarousel } from "./movie-carousel";

export const TopRatedMovies = () => {
	const { data, isLoading, error } = useTopRatedMovies({ region: "US" });

	if (isLoading) {
		return <LoadingSection title="In Theaters Now" />;
	}

	if (error) {
		toast.error("error while fetching now playing movies");
		return null;
	}

	return <MovieCarousel title="Top Rated" movies={data?.results ?? []} />;
};
