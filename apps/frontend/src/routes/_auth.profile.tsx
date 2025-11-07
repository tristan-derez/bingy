import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/profile")({
	head: () => ({
		meta: [
			{
				title: "Bingy - Profile",
			},
		],
	}),
	component: ProfilePage,
});

function ProfilePage() {
	return (
		<div>
			<p>Hello "/_auth/profile"!</p>
		</div>
	);
}
