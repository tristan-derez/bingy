import { createFileRoute } from "@tanstack/react-router";
import { PopularTv } from "@/components/tv/popular";
import { TopRatedTv } from "@/components/tv/top-rated";
import { TrendingTodayTv } from "@/components/tv/trending-today";
import { TrendingWeekTv } from "@/components/tv/trending-week";

export const Route = createFileRoute("/tv/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col w-full p-4 space-y-4 gap-4">
			<TopRatedTv title="Top Rated TV Shows" />
			<TrendingTodayTv title="TV Shows Trending Today" />
			<PopularTv title="Popular TV Shows" />
			<TrendingWeekTv title="Tv Shows Trending This Week" />
		</div>
	);
}
