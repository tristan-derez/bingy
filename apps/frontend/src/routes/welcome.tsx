import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/welcome")({
	component: WelcomePage,
});

function WelcomePage() {
	return <div>Hello "/welcome"!</div>;
}
