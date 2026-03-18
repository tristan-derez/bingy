import { Link, useNavigate } from "@tanstack/react-router";
import { DeleteListButton } from "@/components/lists/custom-lists/delete-list-button";
import { ListMediaDetailsCard } from "@/components/lists/custom-lists/details/list-media-details-card";
import { ListDescription } from "@/components/lists/custom-lists/list-description";
import { ListName } from "@/components/lists/custom-lists/list-name";
import { ListPagination } from "@/components/lists/list-pagination";
import { m } from "@/paraglide/messages";
import { EditListButton } from "../edit-list-button";

type ListDetailsContainerProps = {
	username: string;
	list: {
		id: string;
		name: string;
		slug: string;
		description: string | null;
		visibility: "public" | "limited" | "private";
		type: "unranked" | "ranked";
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

export function ListDetailsContainer({
	username,
	list,
	page,
	totalPages,
	onPageChange,
	isOwnList,
}: ListDetailsContainerProps) {
	const navigate = useNavigate();
	const sortedItems =
		list.type === "ranked"
			? [...list.items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
			: list.items;

	const hasItem = list.items.length > 0;

	return (
		<div className="container flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<ListName listName={list.name} />

				<div className="flex flex-col justify-between gap-1">
					<ListDescription description={list.description} />

					<div className="flex flex-row justify-between">
						{hasItem ? (
							<Link
								to="/user/$username/lists/$slug"
								params={{ username: username, slug: list.slug }}
								className="text-primary underline hover:text-primary/80 self-end"
							>
								{m.list_details_container_hide_notes()}
							</Link>
						) : null}

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
											to: "/user/$username/lists",
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
								to="/user/$username/lists/$listslug/edit"
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
					<div className="flex flex-col divide-y">
						{sortedItems.map((item) => (
							<div
								key={`${item.mediaType}-${item.id}`}
								className="py-3 first:pt-0 last:pb-0"
							>
								<ListMediaDetailsCard
									item={item}
									showPosition={list.type === "ranked"}
								/>
							</div>
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
