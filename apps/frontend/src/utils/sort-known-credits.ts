import type { Schemas } from "shared";

type Credit = Schemas.MediaWithCastCredits | Schemas.MediaWithCrewCredits;

const WEIGHTS = {
	BASE_RATING: 7.0,
	MIN_VOTES: 500,
	LEAD_BOOST: 800,
	ORDER_DECAY: 0.7,
	POPULARITY_FACTOR: 0.5,
	TV_EPISODE: {
		MIN_SIGNIFICANT: 5,
		RECURRING_THRESHOLD: 8,
		GUEST_SCORE: 1,
	},
} as const;

export function sortKnownForCredits(person: {
	name?: string;
	known_for_department?: string;
	combined_credits?: {
		cast: Schemas.MediaWithCastCredits[];
		crew: Schemas.MediaWithCrewCredits[];
	};
}): Credit[] | null {
	const combined = person.combined_credits;
	if (!combined) return null;

	const isActor = person.known_for_department === "Acting";
	const credits = deduplicateById(
		(isActor ? combined.cast : combined.crew) as Credit[],
	);
	const filtered = filterCredits(credits, isActor, person.name);
	const scored = filtered.map((credit) => ({
		credit,
		score: calculateScore(credit, isActor),
	}));

	scored.sort((a, b) => b.score - a.score);

	return scored.slice(0, 10).map((item) => item.credit);
}

function deduplicateById<T extends { id: number }>(items: T[]): T[] {
	const seen = new Map<number, T>();
	for (const item of items) {
		if (!seen.has(item.id)) seen.set(item.id, item);
	}
	return [...seen.values()];
}

function filterCredits(
	credits: Credit[],
	isActor: boolean,
	personName?: string,
): Credit[] {
	return credits.filter((credit) => {
		if (isActor && "character" in credit) {
			return isValidActorCredit(credit.character, personName);
		}
		if ("job" in credit) {
			return Boolean(credit.job?.trim());
		}
		return true;
	});
}

function isValidActorCredit(
	character: string | undefined,
	personName?: string,
): boolean {
	const char = character?.trim().toLowerCase();
	if (!char) return false;

	const name = personName?.trim().toLowerCase();
	const invalidPatterns = [
		"self",
		"(uncredited)",
		"archive footage",
		name && `${name} (voice)`,
	].filter(Boolean);

	return !invalidPatterns.some((pattern) => char.includes(pattern as string));
}

function calculateScore(credit: Credit, isActor: boolean): number {
	const voteCount = credit.vote_count || 0;
	const voteAverage = credit.vote_average || 5;
	const popularity = credit.popularity || 0;

	const adjustedRating = calculateAdjustedRating(voteCount, voteAverage);
	const baseScore = voteCount * adjustedRating;

	if (isActor) {
		return applyActorModifiers(baseScore, credit, voteCount, popularity);
	}

	return baseScore + popularity * WEIGHTS.POPULARITY_FACTOR;
}

function calculateAdjustedRating(
	voteCount: number,
	voteAverage: number,
): number {
	return (
		(voteCount * voteAverage + WEIGHTS.MIN_VOTES * WEIGHTS.BASE_RATING) /
		(voteCount + WEIGHTS.MIN_VOTES)
	);
}

function applyActorModifiers(
	baseScore: number,
	credit: Credit,
	voteCount: number,
	popularity: number,
): number {
	if (credit.media_type === "movie" && "order" in credit) {
		return applyMovieModifiers(baseScore, credit.order, voteCount);
	}

	if (credit.media_type === "tv" && "episode_count" in credit) {
		return applyTVModifiers(
			baseScore,
			credit.episode_count as number,
			popularity,
		);
	}

	return baseScore;
}

function applyMovieModifiers(
	score: number,
	order: number | undefined,
	voteCount: number,
): number {
	const billingOrder = order || 0;

	if (billingOrder <= 1 && voteCount < WEIGHTS.MIN_VOTES) {
		score += WEIGHTS.LEAD_BOOST;
	}

	const decay = 1 + billingOrder * WEIGHTS.ORDER_DECAY;
	return score / decay;
}

function applyTVModifiers(
	baseScore: number,
	episodeCount: number,
	popularity: number,
): number {
	if (episodeCount < WEIGHTS.TV_EPISODE.MIN_SIGNIFICANT) {
		return WEIGHTS.TV_EPISODE.GUEST_SCORE;
	}

	if (episodeCount >= WEIGHTS.TV_EPISODE.RECURRING_THRESHOLD) {
		return baseScore + popularity * WEIGHTS.POPULARITY_FACTOR;
	}

	const ratio =
		(episodeCount - WEIGHTS.TV_EPISODE.MIN_SIGNIFICANT) /
		(WEIGHTS.TV_EPISODE.RECURRING_THRESHOLD -
			WEIGHTS.TV_EPISODE.MIN_SIGNIFICANT);

	return baseScore * ratio + popularity * (ratio * WEIGHTS.POPULARITY_FACTOR);
}
