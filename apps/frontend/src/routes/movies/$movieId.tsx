// MovieDetailsContainer.tsx
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { MovieDetailView } from "@/components/movies/movie-details";
import { useMovie, useMovieResource } from "@/hooks/useMovies";
import type { MovieCredits, MovieExternalIds } from "@/types/movie";
import { getRole } from "@/utils/excluded-jobs";
import { getSocialUrls } from "@/utils/social-urls";

export const Route = createFileRoute("/movies/$movieId")({
	component: MovieDetailsContainer,
});

function MovieDetailsContainer() {
	const router = useRouter();
	const { movieId } = Route.useParams();

	const { data: movie, isLoading, isError } = useMovie(Number(movieId));
	const { data: credits } = useMovieResource<MovieCredits>(
		Number(movieId),
		"credits",
	);

	const { data: socials } = useMovieResource<MovieExternalIds>(
		Number(movieId),
		"external_ids",
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

	const result = Array.from(crewWithRoles.values());

	const cast =
		credits?.cast?.slice(0, 10).map((person) => ({
			id: person.id,
			name: person.name,
			character: person.character,
			profile_path: person.profile_path,
		})) || [];

	const socialUrls = socials ? getSocialUrls(socials) : {};

	return (
		<MovieDetailView
			movie={movie}
			socials={socialUrls}
			crew={result}
			cast={cast}
			isLoading={isLoading}
			isError={isError}
			onBack={() => router.history.back()}
		/>
	);
}
