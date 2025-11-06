import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/profile")({
	component: ProfilePage,
});

function ProfilePage() {
	return (
		<div>
			<p>Hello "/_auth/profile"!</p>
		</div>
	);
}
