import { toast } from "sonner";
import { useUpcomingMovies } from "@/hooks/useMovies";
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

	return <MovieCarousel title="Upcoming" movies={data?.results ?? []} />;
};
