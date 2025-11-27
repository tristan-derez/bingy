import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { Schemas } from "shared";
import { MovieDetailView } from "@/components/movies/movie-details";
import { useMovie, useMovieResource } from "@/hooks/useMovies";
import { getRole } from "@/utils/excluded-jobs";
import { getSocialUrls } from "@/utils/social-urls";

export const Route = createFileRoute("/movies/$movieId")({
	component: MovieDetailsContainer,
});

function MovieDetailsContainer() {
	const router = useRouter();
	const { movieId } = Route.useParams();

	const { data: movie, isLoading, isError } = useMovie(Number(movieId));
	const { data: credits } = useMovieResource<Schemas.MovieCredits>(
		Number(movieId),
		"credits",
	);

	const { data: socials } = useMovieResource<Schemas.MovieExternalIds>(
		Number(movieId),
		"external_ids",
	);

	const { data: watchProviders } = useMovieResource<Schemas.WatchProviders>(
		Number(movieId),
		"watch/providers",
	);

	const crewWithRoles =
		credits?.crew.reduce<Map<number, { name: string; roles: Set<string> }>>(
			(map, person) => {
				const role = getRole(person);
				if (!role) return map;

				const existing = map.get(person.id);
				if (existing) {
					existing.roles.add(role);
				} else {
					map.set(person.id, { name: person.name, roles: new Set([role]) });
				}
				return map;
			},
			new Map(),
		) ?? new Map();

	const crew = Array.from(crewWithRoles.values());
	const cast = credits?.cast?.slice(0, 10) || [];

	const socialUrls = socials ? getSocialUrls(socials) : {};
	const collection = movie ? movie.belongs_to_collection : undefined;

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
