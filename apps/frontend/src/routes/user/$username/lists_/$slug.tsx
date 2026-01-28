import { createFileRoute } from "@tanstack/react-router";
import { useListBySlug } from "@/hooks/useLists";

export const Route = createFileRoute("/user/$username/lists_/$slug")({
	component: ListPage,
});

function ListPage() {
	const { username, slug } = Route.useParams();
	const { data: list, isLoading, error } = useListBySlug(username, slug);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error loading list</div>;
	if (!list) return <div>List not found</div>;

	return (
		<div>
			<h1>{list.name}</h1>
			<p>{list.description}</p>
			<div>
				{list.items.map((item) => (
					<div key={item.id}>
						{item.media.tmdbId} - {item.media.mediaType}
						{item.note && <p>{item.note}</p>}
					</div>
				))}
			</div>
		</div>
	);
}
