import type { MediaWithCastCredits, MediaWithCrewCredits } from "@/types/media";

export function sortKnownForCredits(person: {
	known_for_department?: string;
	combined_credits?: {
		cast: MediaWithCastCredits[];
		crew: MediaWithCrewCredits[];
	};
}): (MediaWithCastCredits | MediaWithCrewCredits)[] | null {
	const combined = person.combined_credits;
	if (!combined) return null;

	const rawCredits: (MediaWithCastCredits | MediaWithCrewCredits)[] =
		person.known_for_department === "Acting" ? combined.cast : combined.crew;

	const dedupeById = <T extends { id: number }>(items: T[]): T[] => {
		const seen = new Map<number, T>();
		for (const item of items) {
			if (!seen.has(item.id)) seen.set(item.id, item);
		}
		return [...seen.values()];
	};

	let credits = dedupeById(rawCredits);

	credits = credits.filter((item) => {
		if ("character" in item && person.known_for_department === "Acting") {
			return item.character?.trim().length > 0;
		}

		if ("job" in item) {
			return item.job?.trim().length > 0;
		}

		return true;
	});

	credits = credits.filter((item) => {
		if (
			person.known_for_department === "Acting" &&
			item.media_type === "movie" &&
			"order" in item
		) {
			return item.order <= 8;
		}

		return true;
	});

	credits.sort((a, b) => b.vote_count - a.vote_count);

	return credits.slice(0, 10);
}
