import { DialogTitle } from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { SearchIcon } from "lucide-react";
import { VisuallyHidden } from "radix-ui";
import { useEffect, useState } from "react";
import type { Schemas } from "shared";
import { Button } from "@/components/ui/button";
import { useSearchQuery } from "@/hooks/useSearch";
import { localeWithRegionAtom } from "@/lib/atoms/locale";
import { m } from "@/paraglide/messages";
import { getRelevanceScore } from "@/utils/search-relevance-score";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "../ui/command";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import { LoaderFive } from "../ui/loader";
import { SearchItemCombobox } from "./search-item-combobox";

interface SearchComboboxProps {
	title?: string;
}

export function SearchCombobox({ title }: SearchComboboxProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const navigate = useNavigate();
	const localeWithRegion = useAtomValue(localeWithRegionAtom);

	const { data, isLoading, isFetching } = useSearchQuery<
		Schemas.PaginatedResponse<Schemas.MediaMulti>
	>(query, { language: localeWithRegion });

	const results = data?.results ?? [];

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((o) => !o);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	useEffect(() => {
		if (!query) {
			setIsTyping(false);
			return;
		}

		setIsTyping(true);
		const timeout = setTimeout(() => setIsTyping(false), 500);
		return () => clearTimeout(timeout);
	}, [query]);

	const loading = isTyping || isLoading || isFetching;

	const maxPerType = 3;

	const groupedResults = { movie: [], tv: [], person: [] } as Record<
		"movie" | "tv" | "person",
		Schemas.MediaMulti[]
	>;

	for (const item of results) {
		if (
			item.media_type in groupedResults &&
			groupedResults[item.media_type as keyof typeof groupedResults].length <
				maxPerType
		) {
			groupedResults[item.media_type as keyof typeof groupedResults].push(item);
		}
	}

	const filteredResults = [
		...groupedResults.movie,
		...groupedResults.tv,
		...groupedResults.person,
	].sort((a, b) => getRelevanceScore(b, query) - getRelevanceScore(a, query));

	const hasResults = filteredResults.length > 0;

	const totalResultsCount = results.length;
	const displayedResultsCount = filteredResults.length;
	const showViewAll = totalResultsCount > displayedResultsCount;

	const handleSelect = () => {
		setOpen(false);
		setQuery("");
	};

	return (
		<>
			<Button
				variant="ghost"
				onClick={() => setOpen(true)}
				className="items-center align-center hover:cursor-pointer gap-2"
			>
				<SearchIcon className="h-4 w-4" />
				{title ? <span>{title}</span> : null}
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<VisuallyHidden.Root>
					<DialogTitle>Search command</DialogTitle>
				</VisuallyHidden.Root>
				<DialogContent className="p-0 max-w-[400px] rounded-lg">
					<VisuallyHidden.Root>
						<DialogDescription>Search results</DialogDescription>
					</VisuallyHidden.Root>
					<Command shouldFilter={false}>
						<CommandInput
							placeholder={m.search_combobox_input_placeholder()}
							value={query}
							onValueChange={setQuery}
							className="placeholder:text-ellipsis"
						/>

						<CommandList className="flex flex-col max-h-[400px]">
							{!query && (
								<CommandEmpty>{m.search_combobox_empty()}</CommandEmpty>
							)}

							{query && loading && (
								<CommandEmpty>
									<div className="flex w-full py-4 justify-center">
										<LoaderFive text={m.loader_text_searching()} />
									</div>
								</CommandEmpty>
							)}

							{query && !loading && !hasResults && (
								<CommandEmpty>{m.search_combobox_no_results()}</CommandEmpty>
							)}

							{query && !loading && hasResults && (
								<>
									<div className="p-1 flex-1">
										{filteredResults.map((item) => (
											<SearchItemCombobox
												key={`${item.id}-${item.media_type}`}
												item={item}
												onSelect={handleSelect}
											/>
										))}
									</div>

									{showViewAll && (
										<div className="sticky bottom-0 bg-background rounded-md m-1 hover:cursor-pointer">
											<CommandSeparator />
											<CommandGroup>
												<CommandItem
													value="view-all"
													onSelect={() => {
														navigate({
															to: "/search",
															search: {
																q: query,
																language: localeWithRegion,
																page: 1,
															},
														});
														handleSelect();
													}}
													className="hover:cursor-pointer"
												>
													<span className="w-full text-center font-medium">
														{m.btn_view_all()} →
													</span>
												</CommandItem>
											</CommandGroup>
										</div>
									)}
								</>
							)}
						</CommandList>
					</Command>
				</DialogContent>
			</Dialog>
		</>
	);
}
