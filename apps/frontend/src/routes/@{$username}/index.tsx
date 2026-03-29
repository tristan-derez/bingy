import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/@{$username}/")({
	component: ProfilePage,
});

function ProfilePage() {
	const { username } = Route.useParams();

	return (
		<div className="flex flex-col gap-4 flex-1">
			You are on {username}'s profile!
		</div>
	);
}
