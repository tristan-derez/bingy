import { createFileRoute } from "@tanstack/react-router";
import { NowPlayingMovies } from "@/components/movies/now-playing";
import { PopularMovies } from "@/components/movies/popular";
import { TopRatedMovies } from "@/components/movies/top-rated";
import { UpcomingMovies } from "@/components/movies/upcoming";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/movies/")({
	component: MoviesPage,
});

function MoviesPage() {
	return (
		<div className="flex flex-col w-full p-4 gap-4">
			<NowPlayingMovies title={m.movies_now_playing_title()} />
			<TopRatedMovies title={m.movies_toprated_title()} />
			<UpcomingMovies title={m.movies_upcoming_title()} />
			<PopularMovies title={m.movies_popular_title()} />
		</div>
	);
}
