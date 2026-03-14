import { IconSearch } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import type { Schemas } from "shared";
import { SearchCommandItem } from "@/components/search/search-command-item";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { LoaderFive } from "@/components/ui/loader";
import { useSearchQuery } from "@/hooks/useSearch";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { getRelevanceScore } from "@/utils/search-relevance-score";

interface SearchCommandProps {
	title?: string;
	open?: boolean;
	setOpen?: (v: boolean) => void;
	showButton?: boolean;
}

export function SearchCommand({
	title,
	showButton = true,
	open: openProp,
	setOpen: setOpenProp,
}: SearchCommandProps) {
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

			<CommandDialog
				open={open}
				onOpenChange={setOpen}
				title={m.search_command_input_placeholder()}
				description={m.search_command_description()}
				className="w-xs md:w-md"
			>
				<Command shouldFilter={false} className="p-0">
					<CommandInput
						placeholder={m.search_command_input_placeholder()}
						value={query}
						onValueChange={setQuery}
						className="text-base lg:text-sm"
					/>
					<CommandList>
						{!query && <CommandEmpty>{m.search_command_empty()}</CommandEmpty>}

						{query && loading && (
							<CommandEmpty>
								<div className="flex w-full py-4 justify-center">
									<LoaderFive text={m.loader_text_searching()} />
								</div>
							</CommandEmpty>
						)}

						{query && !loading && !hasResults && (
							<CommandEmpty>{m.search_command_no_results()}</CommandEmpty>
						)}

						{query && !loading && hasResults && (
							<CommandGroup className="space-y-1">
								{filteredResults.map((item) => (
									<SearchCommandItem
										key={`${item.id}-${item.media_type}`}
										item={item}
										onSelect={handleSelect}
									/>
								))}

								{showViewAll && (
									<CommandItem
										value="view-all"
										className="justify-center [&>svg:last-child]:hidden"
										onSelect={() => {
											navigate({
												to: "/search",
												search: { q: query, language: localeRegion, page: 1 },
											});
											handleSelect();
										}}
									>
										<span className="font-medium">{m.btn_view_all()} →</span>
									</CommandItem>
								)}
							</CommandGroup>
						)}
					</CommandList>
					<div className="hidden lg:flex bg-accent px-3 py-2 text-xs text-muted-foreground">
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center gap-4">
								<span className="flex items-center gap-1.5">
									<Kbd className="bg-card">↲</Kbd>
									<span>{m.search_command_helper_go_to_page()}</span>
								</span>
								<span className="flex items-center gap-1.5">
									<Kbd className="bg-card">↑↓</Kbd>
									<span>{m.search_command_helper_navigate()}</span>
								</span>
							</div>
							<span className="flex items-center gap-1.5">
								<Kbd className="bg-card">
									{m.search_command_helper_kbd_esc()}
								</Kbd>
								<span>{m.search_command_helper_close()}</span>
							</span>
						</div>
					</div>
				</Command>
			</CommandDialog>
		</>
	);
}
