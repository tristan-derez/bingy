import { atomWithStorage } from "jotai/utils";

export type ListDraftItem = {
	tmdbId: number;
	mediaType: "movie" | "tv";
	position?: number;
	title: string;
	posterPath: string | null;
	releaseDate?: string;
	note?: string;
};

export const createListDraftItemsAtom = atomWithStorage<ListDraftItem[]>(
	"create-list-draft-items",
	[],
);

export const editListDraftItemsAtom = atomWithStorage<ListDraftItem[]>(
	"edit-list-draft-items",
	[],
);
