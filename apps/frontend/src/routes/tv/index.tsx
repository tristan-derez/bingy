import { createFileRoute } from "@tanstack/react-router";
import { PopularTv } from "@/components/tv/popular";
import { TopRatedTv } from "@/components/tv/top-rated";
import { TrendingTodayTv } from "@/components/tv/trending-today";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/tv/")({
	component: TvIndexPage,
});

function TvIndexPage() {
	return (
		<div className="flex flex-col w-full p-4 gap-4">
			<TopRatedTv title={m.tv_series_top_rated_title()} />
			<TrendingTodayTv title={m.tv_series_trending_today_title()} />
			<PopularTv title={m.tv_series_popular_title()} />
		</div>
	);
}
