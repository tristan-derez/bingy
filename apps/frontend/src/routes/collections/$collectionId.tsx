import { useQueries } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { Schemas } from "shared";
import { fetchMovie } from "@/api/movies";
import { CollectionDetailsView } from "@/components/collections/collection-details";
import { useCollection } from "@/hooks/useCollections";

export const Route = createFileRoute("/collections/$collectionId")({
	component: CollectionDetailsContainer,
});

function CollectionDetailsContainer() {
	const { collectionId } = Route.useParams();
	const router = useRouter();

	const {
		data: collectionData,
		isLoading,
		isError,
	} = useCollection(Number(collectionId));

	const movieQueries = useQueries({
		queries:
			collectionData?.parts?.map((movie: Schemas.MovieDetails) => ({
				queryKey: ["movies", movie.id],
				queryFn: () => fetchMovie(movie.id),
				enabled: !!collectionData,
				staleTime: 1000 * 60 * 10,
			})) || [],
	});

	const moviesData = movieQueries.map(
		(query) => query.data as Schemas.MovieDetails,
	);

	return (
		<CollectionDetailsView
			collectionData={collectionData}
			moviesData={moviesData}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
