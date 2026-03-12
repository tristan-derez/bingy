import { eq } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { media, movieWatchHistory, tvShowWatchHistory } from "../../db/schemas/list";

export async function updateMediaRating(
	tx: PgTransaction<any, any, any>,
	mediaId: string,
) {
	const [movieRatings, tvRatings] = await Promise.all([
		tx
			.select({ rating: movieWatchHistory.rating })
			.from(movieWatchHistory)
			.where(eq(movieWatchHistory.mediaId, mediaId)),
		tx
			.select({ rating: tvShowWatchHistory.rating })
			.from(tvShowWatchHistory)
			.where(eq(tvShowWatchHistory.mediaId, mediaId)),
	]);

	const ratings = [...movieRatings, ...tvRatings]
		.map((r) => (r.rating ? parseFloat(r.rating) : null))
		.filter((r): r is number => r !== null);

	await tx
		.update(media)
		.set({
			averageRating: ratings.length
				? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
				: null,
			ratingCount: ratings.length,
		})
		.where(eq(media.id, mediaId));
}
