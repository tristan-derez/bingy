import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/$username/")({
	component: ProfilePage,
});

function ProfilePage() {
	const { username } = Route.useParams();
	// @todo: make api call to actually fetch users etc

	return <div>You are on {username}'s profile!</div>;
}
