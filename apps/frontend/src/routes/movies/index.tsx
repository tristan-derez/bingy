import { createFileRoute } from "@tanstack/react-router";
import { NowPlayingMovies } from "@/components/movies/now-playing";
import { PopularMovies } from "@/components/movies/popular";
import { TopRatedMovies } from "@/components/movies/top-rated";
import { UpcomingMovies } from "@/components/movies/upcoming";

export const Route = createFileRoute("/movies/")({
	component: MoviesPage,
});

function MoviesPage() {
	return (
		<div className="flex flex-col w-full p-4 space-y-4 gap-4">
			<NowPlayingMovies />
			<PopularMovies />
			<UpcomingMovies />
			<TopRatedMovies />
		</div>
	);
}
