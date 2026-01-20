import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/lists/create")({
	component: CreateListPage,
});

function CreateListPage() {
	return <div>Hello "/_auth/lists/create"!</div>;
}
