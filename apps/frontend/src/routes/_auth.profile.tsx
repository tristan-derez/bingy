import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/profile")({
	component: ProfilePage,
});

function ProfilePage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center">
			<p>Hello "/_auth/profile"!</p>
		</div>
	);
}
