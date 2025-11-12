import { createFileRoute } from "@tanstack/react-router";
import { NowPlayingMovies } from "@/components/movies/now-playing";

export const Route = createFileRoute("/_auth/dashboard")({
	head: () => ({
		meta: [
			{
				title: "Bingy - Dashboard",
			},
		],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col w-full p-4 space-y-4">
			<NowPlayingMovies />
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}
