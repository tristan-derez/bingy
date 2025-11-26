import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/person/$personId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { personId } = Route.useParams();

	return <div>Hello "/person/{personId}"!</div>;
}
