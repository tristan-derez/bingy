import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { MovieDetailView } from "@/components/movies/movie-details";
import { useMovie } from "@/hooks/useMovies";
import { localeRegionAtom } from "@/lib/atoms/region";
import { getRole } from "@/utils/excluded-jobs";
import { getSocialUrls } from "@/utils/social-urls";

export const Route = createFileRoute("/movies/$movieId")({
	component: MovieDetailsPage,
});

function MovieDetailsPage() {
	const router = useRouter();
	const { movieId } = Route.useParams();
	const localeRegion = useAtomValue(localeRegionAtom);

	const {
		data: movie,
		isLoading,
		isError,
	} = useMovie(Number(movieId), {
		append_to_response: "credits,external_ids,watch/providers",
		language: localeRegion,
	});

	const crewWithRoles =
		movie?.credits?.crew.reduce<
			Map<number, { name: string; roles: Set<string> }>
		>((map, person) => {
			const role = getRole(person);
			if (!role) return map;

			const existing = map.get(person.id);
			if (existing) {
				existing.roles.add(role);
			} else {
				map.set(person.id, { name: person.name, roles: new Set([role]) });
			}
			return map;
		}, new Map()) ?? new Map();

	const crew = Array.from(crewWithRoles.values());
	const cast = movie?.credits?.cast?.slice(0, 10) || [];
	const socialUrls = movie?.external_ids
		? getSocialUrls(movie.external_ids)
		: {};
	const collection = movie ? movie.belongs_to_collection : undefined;
	const watchProviders = movie?.["watch/providers"];

	return (
		<MovieDetailView
			movie={movie}
			socials={socialUrls}
			crew={crew}
			cast={cast}
			watchProviders={watchProviders}
			collection={collection}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
