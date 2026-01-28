import { IconDeviceTv, IconMovie } from "@tabler/icons-react";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import type { Schemas } from "shared";
import { MovieBadge } from "@/components/badges/movie-badge";
import { TvShowBadge } from "@/components/badges/tv-badge";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { LoaderFive } from "@/components/ui/loader";
import { useSearchQuery } from "@/hooks/useSearch";
import {
	type CreateListDraftItem,
	createListDraftItemsAtom,
} from "@/lib/atoms/draft-list";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { formatDate } from "@/utils/format-date";

type SearchResult = Schemas.MovieMedia | Schemas.TvMedia;

interface ListSearchAddInputProps {
	placeholder?: string;
}

export function ListSearchAddInput({
	placeholder = m.list_search_add_placeholder_all(),
}: ListSearchAddInputProps) {
	const [query, setQuery] = useState("");
	const localeRegion = useAtomValue(localeRegionAtom);
	const [selectedItems, setSelectedItems] = useAtom(createListDraftItemsAtom);

	const { data, isLoading, isFetching } = useSearchQuery<
		Schemas.PaginatedResponse<Schemas.MediaMulti>
	>(query, { language: localeRegion });

	const results = (data?.results ?? []).filter(
		(item): item is SearchResult =>
			item.media_type === "movie" || item.media_type === "tv",
	);

	const loading = isLoading || isFetching;

	const handleSelect = (result: SearchResult) => {
		const item: CreateListDraftItem = {
			tmdbId: result.id,
			mediaType: result.media_type,
			title: result.media_type === "movie" ? result.title : result.name,
			posterPath: result.poster_path,
			releaseDate:
				result.media_type === "movie"
					? result.release_date
					: result.first_air_date,
		};

		if (
			!selectedItems.some(
				(i) => i.tmdbId === item.tmdbId && i.mediaType === item.mediaType,
			)
		) {
			setSelectedItems([...selectedItems, item]);
		}

		setQuery("");
	};

	return (
		<Combobox items={results}>
			<ComboboxInput
				placeholder={placeholder}
				value={query}
				onChange={(e) => setQuery(e.target.value)}
			/>
			<ComboboxContent>
				{loading ? (
					<div className="flex w-full py-4 justify-center">
						<LoaderFive text={m.list_search_add_searching()} />
					</div>
				) : (
					<>
						<ComboboxEmpty>
							{query
								? m.list_search_add_no_results()
								: m.list_search_add_placeholder_all_combobox()}
						</ComboboxEmpty>
						<ComboboxList>
							{(item: SearchResult) => {
								const key = `${item.id}-${item.media_type}`;
								return (
									<ComboboxItem
										key={key}
										value={key}
										onClick={() => handleSelect(item)}
									>
										<SearchResultContent item={item} />
									</ComboboxItem>
								);
							}}
						</ComboboxList>
					</>
				)}
			</ComboboxContent>
		</Combobox>
	);
}

interface SearchResultContentProps {
	item: SearchResult;
}

function SearchResultContent({ item }: SearchResultContentProps) {
	const localeRegion = useAtomValue(localeRegionAtom);

	if (item.media_type === "movie") {
		const movie = item as Schemas.MovieMedia;

		return (
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-2 ml-4">
					<IconMovie className="h-4 w-4 shrink-0" />
					<span className="flex-1 line-clamp-1">{movie.title}</span>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					{movie.release_date && (
						<span className="text-xs text-muted-foreground">
							{formatDate(movie.release_date, localeRegion, {
								year: "numeric",
							})}
						</span>
					)}
					<MovieBadge />
				</div>
			</div>
		);
	}

	if (item.media_type === "tv") {
		const tv = item as Schemas.TvMedia;

		return (
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-2 ml-4">
					<IconDeviceTv className="h-4 w-4 shrink-0" />
					<span className="flex-1 line-clamp-1">{tv.name}</span>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					{tv.first_air_date && (
						<span className="text-xs text-muted-foreground">
							{formatDate(tv.first_air_date, localeRegion, { year: "numeric" })}
						</span>
					)}
					<TvShowBadge />
				</div>
			</div>
		);
	}

	return null;
}
