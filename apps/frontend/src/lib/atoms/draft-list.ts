import { atomWithStorage } from "jotai/utils";

export type CreateListDraftItem = {
	tmdbId: number;
	mediaType: "movie" | "tv";
	title: string;
	posterPath: string | null;
	releaseDate?: string;
	note?: string;
};

export const createListDraftItemsAtom = atomWithStorage<CreateListDraftItem[]>(
	"create-list-draft-items",
	[],
);
