import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/$username/in-progress")({
	component: InProgressPage,
});

function InProgressPage() {
	return <div>Hello "/user/$username/in-progress"!</div>;
}
