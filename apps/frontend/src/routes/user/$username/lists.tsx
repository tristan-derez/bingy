import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/$username/lists")({
	component: ListsPage,
});

function ListsPage() {
	return <div>Hello "/user/$username/lists"!</div>;
}
