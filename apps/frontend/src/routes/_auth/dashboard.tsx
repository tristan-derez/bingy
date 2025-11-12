import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { CenteredLayout } from "@/components/layout/centered-layout";
import { LoaderOne } from "@/components/ui/loader";
import { useNowPlayingMovies } from "@/hooks/useMovies";

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
	const { data, isLoading, error } = useNowPlayingMovies();
	console.log(data.dates);

	if (isLoading) {
		return (
			<CenteredLayout>
				<LoaderOne />
			</CenteredLayout>
		);
	}

	if (error) {
		toast.error("oops");
		return;
	}

	return <div></div>;
}
