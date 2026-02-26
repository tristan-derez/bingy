import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/user/$username")({
	component: UserProfileLayout,
});

function UserProfileLayout() {
	// @todo: create the user profile layout
	// column with a profile picture on the left
	// banner on top then outlet below
	return <Outlet />;
}
