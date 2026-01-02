import { DialogTitle } from "@radix-ui/react-dialog";
import { IconSearch } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { VisuallyHidden } from "radix-ui";
import { useEffect, useState } from "react";
import type { Schemas } from "shared";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
} from "@/components/ui/dialog";
import { LoaderFive } from "@/components/ui/loader";
import { useSearchQuery } from "@/hooks/useSearch";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { getRelevanceScore } from "@/utils/search-relevance-score";
import { SearchItemCombobox } from "./search-item-combobox";

interface SearchComboboxProps {
	title?: string;
	open?: boolean;
	setOpen?: (v: boolean) => void;
	showButton?: boolean;
}

export function SearchCombobox({
	title,
	showButton = true,
	open: openProp,
	setOpen: setOpenProp,
}: SearchComboboxProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const open = openProp ?? internalOpen;
	const setOpen = setOpenProp ?? setInternalOpen;
	const [query, setQuery] = useState("");
	const [isTyping, setIsTyping] = useState(false);

	const navigate = useNavigate();
	const localeRegion = useAtomValue(localeRegionAtom);

	const { data, isLoading, isFetching } = useSearchQuery<
		Schemas.PaginatedResponse<Schemas.MediaMulti>
	>(query, { language: localeRegion });

	const results = data?.results ?? [];

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen(!open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [open, setOpen]);

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

	const groupedResults = {
		movie: [],
		tv: [],
		person: [],
	} as Record<"movie" | "tv" | "person", Schemas.MediaMulti[]>;

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
			{showButton ? (
				<Button
					variant="ghost"
					onClick={() => setOpen(true)}
					className="items-center gap-2"
				>
					<IconSearch className="h-4 w-4" />
					{title ? <span>{title}</span> : null}
				</Button>
			) : null}

			<Dialog open={open} onOpenChange={setOpen}>
				<VisuallyHidden.Root>
					<DialogTitle>Search</DialogTitle>
				</VisuallyHidden.Root>
				<DialogContent className="p-0 w-xs md:w-md lg:w-lg rounded-lg">
					<VisuallyHidden.Root>
						<DialogDescription>Search results</DialogDescription>
					</VisuallyHidden.Root>

					<Command shouldFilter={false}>
						<CommandInput
							placeholder={m.search_combobox_input_placeholder()}
							value={query}
							onValueChange={setQuery}
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
										<div className="sticky bottom-0 bg-background rounded-md m-1">
											<CommandSeparator />
											<CommandGroup>
												<CommandItem
													value="view-all"
													onSelect={() => {
														navigate({
															to: "/search",
															search: {
																q: query,
																language: localeRegion,
																page: 1,
															},
														});
														handleSelect();
													}}
													className="cursor-pointer"
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
