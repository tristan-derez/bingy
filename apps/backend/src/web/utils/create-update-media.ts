import { and, eq } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { media } from "../../db/schemas/list";

export async function getOrCreateMedia(
	tx: PgTransaction<any, any, any>,
	tmdbId: number,
	mediaType: "movie" | "tv",
): Promise<string> {
	const [mediaEntry] = await tx
		.insert(media)
		.values({ tmdbId, mediaType })
		.onConflictDoNothing()
		.returning();

	if (mediaEntry?.id) {
		return mediaEntry.id;
	}

	const existingMedia = await tx
		.select({ id: media.id })
		.from(media)
		.where(and(eq(media.tmdbId, tmdbId), eq(media.mediaType, mediaType)))
		.limit(1);

	if (!existingMedia[0]?.id) {
		throw new Error("Failed to create or find media entry");
	}

	return existingMedia[0].id;
}
