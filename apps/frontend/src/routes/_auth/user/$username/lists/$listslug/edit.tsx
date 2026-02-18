import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_auth/user/$username/lists/$listslug/edit",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_auth/user/$username/lists/$slug/edit"!</div>;
}
