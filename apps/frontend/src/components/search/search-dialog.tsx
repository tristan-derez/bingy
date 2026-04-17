import { IconBulb, IconSearch } from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Schemas } from "shared";
import { SearchDialogCard } from "@/components/search/search-dialog-card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoaderFive } from "@/components/ui/loader";
import {
	useSearchMovieQuery,
	useSearchQuery,
	useSearchTvQuery,
} from "@/hooks/useSearch";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";

type SearchFilter = "all" | "movie" | "tv";

interface SearchDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSelectMedia?: (media: Schemas.MediaMulti) => void;
}

export function SearchDialog({
	open,
	onOpenChange,
	onSelectMedia,
}: SearchDialogProps) {
	const [query, setQuery] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isTyping, setIsTyping] = useState(false);
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
	const localeRegion = useAtomValue(localeRegionAtom);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Parse filter from query (!movie, !tv, or default to "all")
	const { filter, cleanQuery } = useMemo(() => {
		const trimmed = query.trim().toLowerCase();
		if (trimmed.startsWith("!movie")) {
			return {
				filter: "movie" as SearchFilter,
				cleanQuery: trimmed.slice(6).trim(),
			};
		}
		if (trimmed.startsWith("!tv")) {
			return {
				filter: "tv" as SearchFilter,
				cleanQuery: trimmed.slice(3).trim(),
			};
		}
		return { filter: "all" as SearchFilter, cleanQuery: trimmed };
	}, [query]);

	// Use different hooks based on filter (they handle debouncing internally)
	const multiSearch = useSearchQuery<
		Schemas.PaginatedResponse<Schemas.MediaMulti>
	>(cleanQuery, { language: localeRegion }, { enabled: filter === "all" });

	const movieSearch = useSearchMovieQuery<
		Schemas.PaginatedResponse<Schemas.MovieMedia>
	>(cleanQuery, { language: localeRegion }, { enabled: filter === "movie" });

	const tvSearch = useSearchTvQuery<Schemas.PaginatedResponse<Schemas.TvMedia>>(
		cleanQuery,
		{ language: localeRegion },
		{ enabled: filter === "tv" },
	);

	// Get results based on filter
	const results = useMemo(() => {
		if (filter === "movie" && movieSearch.data) {
			return movieSearch.data.results.map((item) => ({
				...item,
				media_type: "movie" as const,
			}));
		}
		if (filter === "tv" && tvSearch.data) {
			return tvSearch.data.results.map((item) => ({
				...item,
				media_type: "tv" as const,
			}));
		}
		if (filter === "all" && multiSearch.data) {
			// Filter out person results, only keep movies and TV shows
			return multiSearch.data.results.filter(
				(item) => item.media_type === "movie" || item.media_type === "tv",
			);
		}
		return [];
	}, [filter, movieSearch.data, tvSearch.data, multiSearch.data]);

	// Auto-select first item when results change
	useEffect(() => {
		setSelectedIndex(0);
	}, [results]);

	// Cleanup typing timeout on unmount
	useEffect(() => {
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, []);

	// Scroll selected item into view
	useEffect(() => {
		const selectedElement = itemRefs.current[selectedIndex];
		if (selectedElement) {
			selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
		}
	}, [selectedIndex]);

	const loading =
		(filter === "all" && (multiSearch.isLoading || multiSearch.isFetching)) ||
		(filter === "movie" && (movieSearch.isLoading || movieSearch.isFetching)) ||
		(filter === "tv" && (tvSearch.isLoading || tvSearch.isFetching));

	const handleSelect = (item: Schemas.MediaMulti) => {
		onSelectMedia?.(item);
		onOpenChange(false);
		setQuery("");
		setIsTyping(false);
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}
	};

	const filterLabel = useMemo(() => {
		if (filter === "movie") return m.search_dialog_filter_movies();
		if (filter === "tv") return m.search_dialog_filter_tv();
		return m.search_dialog_filter_all();
	}, [filter]);

	// Keyboard navigation handler
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (results.length === 0) return;

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setSelectedIndex((prev) => (prev + 1) % results.length);
					break;
				case "ArrowUp":
					e.preventDefault();
					setSelectedIndex(
						(prev) => (prev - 1 + results.length) % results.length,
					);
					break;
				case "Enter":
					e.preventDefault();
					handleSelect(results[selectedIndex] as Schemas.MediaMulti);
					break;
			}
		},
		[results, selectedIndex, handleSelect],
	);

	const content = (
		<div className="flex flex-col gap-2 overflow-hidden">
			{/* Search Input */}
			<div className="relative">
				<IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					type="text"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setIsTyping(true);
						if (typingTimeoutRef.current) {
							clearTimeout(typingTimeoutRef.current);
						}
						typingTimeoutRef.current = setTimeout(() => {
							setIsTyping(false);
						}, 300);
					}}
					onKeyDown={handleKeyDown}
					placeholder={m.search_dialog_input_placeholder()}
					className="px-10 py-5"
					autoFocus
				/>
				{filter !== "all" ? (
					<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
						{filterLabel}
					</span>
				) : null}
			</div>
			{/* Filter hint */}
			{!query ? (
				<div className="flex gap-2 items-center">
					<IconBulb size={16} />
					<p className="text-xs text-muted-foreground">
						{m.search_dialog_hint_filter()}
					</p>
				</div>
			) : null}
			{/* Results */}
			<div className="max-h-[60vh] overflow-y-auto no-scrollbar">
				{loading ? (
					<div className="flex justify-center py-8">
						<LoaderFive text={m.loader_text_searching()} />
					</div>
				) : null}

				{!loading && !isTyping && cleanQuery && results.length === 0 ? (
					<p className="text-center text-muted-foreground py-8">
						{m.search_dialog_no_results()}
					</p>
				) : null}

				{!loading && results.length > 0 ? (
					<div className="flex flex-col gap-2">
						{results.map((item, index) => (
							<SearchDialogCard
								key={`${item.id}-${item.media_type}`}
								ref={(el) => {
									itemRefs.current[index] = el;
								}}
								item={item as Schemas.MediaMulti}
								onSelect={() => handleSelect(item as Schemas.MediaMulti)}
								isSelected={index === selectedIndex}
							/>
						))}
					</div>
				) : null}
			</div>
		</div>
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-full max-w-sm md:max-w-md lg:max-w-lg overflow-hidden z-150">
				<DialogHeader>
					<DialogTitle>{m.search_dialog_title()}</DialogTitle>
				</DialogHeader>
				{content}
			</DialogContent>
		</Dialog>
	);
}
