import { useQueries } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { fetchMovie } from "@/api/movies";
import { CollectionDetailsView } from "@/components/collections/collection-details";
import { useCollection } from "@/hooks/useCollection";
import { localeRegionAtom, regionAtom } from "@/lib/atoms/region";

export const Route = createFileRoute("/collections/$collectionId")({
	component: CollectionDetailsPage,
});

function CollectionDetailsPage() {
	const { collectionId } = Route.useParams();
	const router = useRouter();
	const localeRegion = useAtomValue(localeRegionAtom);
	const region = useAtomValue(regionAtom);

	const {
		data: collectionData,
		isLoading,
		isError,
	} = useCollection(Number(collectionId), { language: localeRegion });

	const movieQueries = useQueries({
		queries:
			collectionData?.parts?.map((movie: Schemas.MovieDetails) => ({
				queryKey: ["movie", movie.id, localeRegion],
				queryFn: () => fetchMovie(movie.id, { language: localeRegion, region }),
				enabled: !!collectionData,
				staleTime: 1000 * 60 * 60,
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
