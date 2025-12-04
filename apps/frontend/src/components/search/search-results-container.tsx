import { FilmIcon, LayoutGridIcon, TvIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import type { Schemas } from "shared";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getRelevanceScore } from "@/utils/search-relevance-score";
import { SearchCard } from "./search-card";

interface SearchResultsContainerProps {
	results: Schemas.MediaMulti[];
	query: string;
}

type MediaType = "all" | "movie" | "tv" | "person";

export const SearchResultsContainer = ({
	results,
	query,
}: SearchResultsContainerProps) => {
	const [filter, setFilter] = useState<MediaType>("all");

	const filteredResults = (
		filter === "all"
			? results
			: results.filter((item) => item.media_type === filter)
	).sort((a, b) => getRelevanceScore(b, query) - getRelevanceScore(a, query));

	const handleFilterChange = (value: string) => {
		if (value) setFilter(value as MediaType);
	};

	return (
		<div className="container flex flex-col gap-4">
			<h1>
				Search results for:{" "}
				<span className="font-bold text-muted-foreground">"{query}"</span>
			</h1>
			<ToggleGroup
				type="single"
				value={filter}
				onValueChange={handleFilterChange}
				className="justify-start"
			>
				<ToggleGroupItem
					value="all"
					aria-label="All results"
					className="hover:cursor-pointer"
				>
					<LayoutGridIcon className="h-4 w-4" />
					All
				</ToggleGroupItem>
				<ToggleGroupItem
					value="movie"
					aria-label="Movies"
					className="hover:cursor-pointer"
				>
					<FilmIcon className="h-4 w-4" />
					Movies
				</ToggleGroupItem>
				<ToggleGroupItem
					value="tv"
					aria-label="TV Shows"
					className="hover:cursor-pointer"
				>
					<TvIcon className="h-4 w-4" />
					TV Shows
				</ToggleGroupItem>
				<ToggleGroupItem
					value="person"
					aria-label="People"
					className="hover:cursor-pointer"
				>
					<UserIcon className="h-4 w-4" />
					People
				</ToggleGroupItem>
			</ToggleGroup>

			<div className="flex flex-col gap-2">
				{filteredResults.map((item) => (
					<SearchCard key={`${item.media_type}-${item.id}`} item={item} />
				))}
			</div>

			{filteredResults.length === 0 ? (
				<div className="text-center text-muted-foreground py-8">
					No results found
				</div>
			) : null}
		</div>
	);
};
