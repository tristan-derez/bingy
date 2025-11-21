import { createFileRoute } from "@tanstack/react-router";
import { TopRatedTv } from "@/components/tv/top-rated";
import { TrendingTodayTv } from "@/components/tv/trending-today";
import { TrendingWeekTv } from "@/components/tv/trending-week";

export const Route = createFileRoute("/tv/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col w-full p-4 space-y-4 gap-4">
			<TopRatedTv />
			<TrendingTodayTv />
			<TrendingWeekTv />
		</div>
	);
}
