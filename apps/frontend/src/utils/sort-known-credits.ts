import type { Schemas } from "shared";

const BASE_RATING = 7.0;
const MIN_VOTES_FOR_RELIABILITY = 500;
const LEAD_ROLE_BOOST = 800;
const MOVIE_ORDER_DECAY_FACTOR = 0.7;

export function sortKnownForCredits(person: {
	name?: string;
	known_for_department?: string;
	combined_credits?: {
		cast: Schemas.MediaWithCastCredits[];
		crew: Schemas.MediaWithCrewCredits[];
	};
}): (Schemas.MediaWithCastCredits | Schemas.MediaWithCrewCredits)[] | null {
	const combined = person.combined_credits;
	if (!combined) return null;

	const isActor = person.known_for_department === "Acting";
	const rawCredits: (
		| Schemas.MediaWithCastCredits
		| Schemas.MediaWithCrewCredits
	)[] = isActor ? combined.cast : combined.crew;

	const dedupeById = <T extends { id: number }>(items: T[]): T[] => {
		const seen = new Map<number, T>();
		for (const item of items) {
			if (!seen.has(item.id)) seen.set(item.id, item);
		}
		return [...seen.values()];
	};

	let credits = dedupeById(rawCredits);

	credits = credits.filter((item) => {
		if (isActor && "character" in item) {
			const character = item.character?.trim() || "";
			const name = person.name?.trim() || "";
			if (!character) return false;

			const lowerChar = character.toLowerCase();
			if (
				(name && lowerChar === `${name.toLowerCase()} (voice)`) ||
				lowerChar.includes("self") ||
				lowerChar.includes("(uncredited)") ||
				lowerChar.includes("archive footage")
			) {
				return false;
			}
		}
		if ("job" in item) {
			return item.job && item.job.trim().length > 0;
		}
		return true;
	});

	const getScore = (
		item: Schemas.MediaWithCastCredits | Schemas.MediaWithCrewCredits,
	) => {
		const voteCount = item.vote_count || 0;
		const voteAverage = item.vote_average || 5;
		const popularity = item.popularity || 0;

		const adjustedRating =
			(voteCount * voteAverage + MIN_VOTES_FOR_RELIABILITY * BASE_RATING) /
			(voteCount + MIN_VOTES_FOR_RELIABILITY);

		let score = voteCount * adjustedRating;

		if (isActor) {
			if (item.media_type === "movie" && "order" in item) {
				const order = item.order || 0;

				if (order <= 1 && voteCount < MIN_VOTES_FOR_RELIABILITY) {
					score = score + LEAD_ROLE_BOOST;
				}

				const decay = 1 + order * MOVIE_ORDER_DECAY_FACTOR;
				score = score / decay;
			} else if (item.media_type === "tv" && "episode_count" in item) {
				// @todo: fetch total episode count for each tv show
				const epCount = item.episode_count as number;

				if (epCount >= 8) {
					score = score + popularity * 2;
				} else {
					score = score * 0.15 + popularity * 5;
				}
			}
		} else {
			score = score + popularity * 1;
		}

		return score;
	};

	credits.sort((a, b) => {
		return getScore(b) - getScore(a);
	});

	return credits.slice(0, 10);
}
