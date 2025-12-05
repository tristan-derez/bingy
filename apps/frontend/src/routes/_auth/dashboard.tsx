import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard")({
	head: () => ({
		meta: [
			{
				title: "Bingy - Dashboard",
			},
		],
	}),
	component: DashboardPage,
});

function DashboardPage() {
	return (
		<div className="flex flex-col w-full p-4 space-y-4">
			<p>Hello /dashboard !</p>
		</div>
	);
}
