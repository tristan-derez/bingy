import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/home")({
	head: () => ({
		meta: [
			{
				title: "Bingy - Home",
			},
		],
	}),
	component: HomePage,
});

function HomePage() {
	return (
		<div className="flex flex-col w-full p-4 space-y-4">
			<p>Hello /home !</p>
		</div>
	);
}
