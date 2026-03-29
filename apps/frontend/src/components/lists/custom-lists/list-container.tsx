import { Link, useNavigate } from "@tanstack/react-router";
import { ListMediaCard } from "@/components/lists/custom-lists/unranked-list/list-media-card";
import { ListPagination } from "@/components/lists/list-pagination";
import { m } from "@/paraglide/messages";
import { DeleteListButton } from "./delete-list-button";
import { EditListButton } from "./edit-list-button";
import { ListDescription } from "./list-description";
import { ListName } from "./list-name";

type ListContainerProps = {
	username: string;
	list: {
		id: string;
		name: string;
		slug: string;
		description: string | null;
		type: "unranked" | "ranked";
		visibility: "public" | "limited" | "private";
		items: Array<{
			id: number;
			title: string;
			originalTitle: string;
			releaseDate: string;
			posterPath: string | null;
			mediaType: "movie" | "tv";
			addedAt: Date;
			note: string | null;
			position?: number;
		}>;
	};
	page?: number;
	totalPages?: number;
	onPageChange?: (page: number) => void;
	isOwnList: boolean;
};

export function ListContainer({
	username,
	list,
	page,
	totalPages,
	onPageChange,
	isOwnList,
}: ListContainerProps) {
	const navigate = useNavigate();
	const sortedItems =
		list.type === "ranked"
			? [...list.items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
			: list.items;

	const hasItem = list.items.length > 0;

	return (
		<div className="container flex flex-col gap-6">
			<div className="flex flex-col gap-2 justify-center">
				<ListName listName={list.name} />

				<div className="flex flex-col justify-between gap-1">
					<ListDescription description={list.description} />

					<div className="flex flex-row justify-between">
						{hasItem ? (
							<Link
								to="/@{$username}/lists/$slug/details"
								params={{ username: username, slug: list.slug }}
								className="text-primary underline hover:text-primary/80 self-end"
							>
								{m.list_container_see_notes()}
							</Link>
						) : (
							<span>&nbsp;</span>
						)}

						{isOwnList ? (
							<div className="flex gap-2" onClick={(e) => e.preventDefault()}>
								<EditListButton
									listSlug={list.slug}
									username={username}
									size="lg"
									showText={true}
								/>
								<DeleteListButton
									listId={list.id}
									listName={list.name}
									size="icon-lg"
									onRedirect={() =>
										navigate({
											to: "/@{$username}/lists",
											params: { username },
										})
									}
								/>
							</div>
						) : null}
					</div>
				</div>
			</div>

			{!hasItem ? (
				<p className="text-center py-12 text-muted-foreground">
					{isOwnList ? (
						<>
							{m.list_container_empty_own()}{" "}
							<Link
								to="/@{$username}/lists/$listslug/edit"
								params={{ username, listslug: list.slug }}
								className="text-primary underline hover:text-primary/80"
							>
								{m.list_container_empty_own_cta()}
							</Link>
						</>
					) : (
						m.list_container_empty()
					)}
				</p>
			) : (
				<>
					<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-2 sm:gap-4">
						{sortedItems.map((item) => (
							<ListMediaCard
								key={`${item.mediaType}-${item.id}`}
								item={item}
								showPosition={list.type === "ranked"}
							/>
						))}
					</div>

					{page && totalPages && onPageChange && totalPages > 1 && (
						<ListPagination
							page={page}
							totalPages={totalPages}
							onPageChange={onPageChange}
						/>
					)}
				</>
			)}
		</div>
	);
}
