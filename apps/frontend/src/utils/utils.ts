import type { Schemas } from "shared";

export type ImageSize = "w200" | "w500" | "original";

export const getTmdbImageUrl = (
	path: string | null,
	size: ImageSize = "original",
): string | null => {
	if (!path) return null;
	return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);

/**
 * @param sessionUsername
 * @param urlUsername
 * @returns a boolean
 */
export function isOwnProfile(
	sessionUsername: string | null | undefined,
	urlUsername: string | null | undefined,
): boolean {
	if (!sessionUsername || !urlUsername) {
		return false;
	}
	return sessionUsername.toLowerCase() === urlUsername.toLowerCase();
}

export const isMacOS = () => {
	return navigator.userAgent.indexOf("Mac") > -1;
};

export const getMediaProps = (
	mediaType: "movie" | "tv",
	id: number,
	title: string,
	posterPath: string | null,
	releaseDate: string,
) => {
	return mediaType === "movie"
		? {
				movie: {
					mediaType,
					id,
					title,
					posterPath,
					releaseDate,
				},
			}
		: {
				tvShow: {
					mediaType,
					id,
					name: title,
					posterPath,
					releaseDate,
				},
			};
};

export function mergeCastMemberCharacters(
	cast: Array<Schemas.CastMember & { characters?: string[] }>,
	member: Schemas.CastMember,
): void {
	const existing = cast.find((c) => c.id === member.id);

	if (existing) {
		if (member.character && !existing.characters?.includes(member.character)) {
			existing.characters = [...(existing.characters || []), member.character];
		}
	} else {
		cast.push({
			...member,
			characters: member.character ? [member.character] : [],
		});
	}
}

export function mergeCrewMemberJobs(
	crew: Array<Schemas.CrewMember & { jobs?: string[] }>,
	member: Schemas.CrewMember,
): void {
	const existing = crew.find((c) => c.id === member.id);

	if (existing) {
		if (member.job && !existing.jobs?.includes(member.job)) {
			existing.jobs = [...(existing.jobs || []), member.job];
		}
	} else {
		crew.push({
			...member,
			jobs: member.job ? [member.job] : [],
		});
	}
}

// temporary solution until we call the real justwatch api
// @todo: rework that
export function getProviderName(name: string): string {
	switch (name) {
		case "Amazon Prime Video":
			return "Prime Video";
		case "Crunchyroll Amazon Channel":
			return "Crunchyroll";
		default:
			return name;
	}
}
