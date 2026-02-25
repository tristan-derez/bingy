import { IconPlus } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { useRef } from "react";
import { LoadingCentered } from "@/components/loading/loading-centered";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useAddMediaToList, useInfiniteLists } from "@/hooks/useLists";
import {
	createListDraftItemsAtom,
	type ListDraftItem,
} from "@/lib/atoms/draft-list";
import { m } from "@/paraglide/messages";

interface AddToListDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	movie?: {
		mediaType?: string;
		id: number;
		title: string;
		posterPath: string | null;
		releaseDate: string;
	};
	tvShow?: {
		mediaType?: string;
		id: number;
		name: string;
		posterPath: string | null;
		releaseDate: string;
	};
	username: string;
}

export function AddToListDialog({
	open,
	onOpenChange,
	movie,
	tvShow,
	username,
}: AddToListDialogProps) {
	const navigate = useNavigate();
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useInfiniteLists(username, "all");

	const [_, setSelectedItems] = useAtom(createListDraftItemsAtom);

	const addMediaToList = useAddMediaToList();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const handleScroll = () => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const { scrollTop, scrollHeight, clientHeight } = container;
		const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

		if (isNearBottom && hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	const handleAddToList = (
		listId: string,
		listName: string,
		listSlug: string,
	) => {
		if (!movie && !tvShow) return;

		const payload = movie
			? {
					tmdbId: movie.id,
					mediaType: "movie" as const,
					username,
					listId,
					listName,
					listSlug,
					title: movie.title,
				}
			: {
					tmdbId: tvShow!.id,
					mediaType: "tv" as const,
					username,
					listId,
					listName,
					listSlug,
					name: tvShow!.name,
				};

		addMediaToList.mutate(payload);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{m.dialog_add_to_list_title()}</DialogTitle>
					<DialogDescription>
						{m.dialog_add_to_list_desc({
							media_name: (movie?.title ?? tvShow?.name)!,
						})}
					</DialogDescription>
				</DialogHeader>

				{status === "pending" && (
					<div className="flex items-center justify-center min-h-30">
						<LoadingCentered />
					</div>
				)}

				{status === "error" && <p>{m.dialog_add_to_list_generic_err()}</p>}

				{status === "success" ? (
					<>
						<div
							ref={scrollContainerRef}
							onScroll={handleScroll}
							className="max-h-[400px] overflow-x-hidden overflow-y-auto no-scrollbar space-y-2"
						>
							{data.pages.map((page) => (
								<div key={page.page} className="space-y-2">
									{page.data.map((list) => (
										<Button
											key={list.id}
											variant="ghost"
											className="w-full justify-start h-auto p-3"
											onClick={() =>
												handleAddToList(list.id, list.name, list.slug)
											}
											disabled={addMediaToList.isPending}
										>
											<div className="text-left">
												<div className="font-medium">{list.name}</div>

												<div className="text-sm text-muted-foreground leading-relaxed line-clamp-1">
													{list.description || m.dialog_add_to_list_no_desc()}
												</div>
											</div>
										</Button>
									))}
								</div>
							))}

							{isFetchingNextPage && (
								<div className="flex min-h-10 justify-center text-sm text-center text-muted-foreground py-2">
									<LoadingCentered />
								</div>
							)}
						</div>

						<DialogFooter>
							<Button
								className="w-full"
								onClick={() => {
									const draftItem: ListDraftItem = movie
										? {
												tmdbId: movie.id,
												mediaType: "movie",
												title: movie.title,
												posterPath: movie.posterPath,
												releaseDate: movie.releaseDate,
											}
										: {
												tmdbId: tvShow!.id,
												mediaType: "tv",
												title: tvShow!.name,
												posterPath: tvShow!.posterPath,
												releaseDate: tvShow!.releaseDate,
											};

									setSelectedItems([draftItem]);
									onOpenChange(false);
									navigate({ to: "/lists/create" });
								}}
							>
								<IconPlus />
								{m.dialog_add_to_list_btn_footer()}
							</Button>
						</DialogFooter>
					</>
				) : null}
			</DialogContent>
		</Dialog>
	);
}
