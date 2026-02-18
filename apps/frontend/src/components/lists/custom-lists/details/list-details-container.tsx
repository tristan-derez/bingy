import { IconPencil } from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ListMediaDetailsCard } from "@/components/lists/custom-lists/details/list-media-details-card";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";
import { ListPagination } from "../../list-pagination";
import { DeleteListButton } from "../delete-list-button";

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

	return (
		<div className="container px-4 flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<h1
						className="text-3xl font-bold truncate max-w-[5ch] sm:max-w-[12ch] md:max-w-[20ch] lg:max-w-[30ch]"
						title={list.name}
					>
						{list.name}
					</h1>

					{isOwnList ? (
						<div className="flex gap-2">
							<Button
								size="lg"
								onClick={() =>
									navigate({
										to: "/user/$username/lists/$listslug/edit",
										params: { username, listslug: list.slug },
									})
								}
							>
								<IconPencil />
								<span className="hidden xs:inline">{m.btn_edit_list()}</span>
							</Button>
							<div onClick={(e) => e.preventDefault()}>
								<DeleteListButton
									listId={list.id}
									listName={list.name}
									size="icon-lg"
								/>
							</div>
						</div>
					) : null}
				</div>
				<div className="flex flex-col justify-between gap-4">
					{list.description ? (
						<p className="text-muted-foreground whitespace-pre-wrap max-w-3/4">
							{list.description}
						</p>
					) : (
						<span></span>
					)}

					{list.items.length > 0 ? (
						<Link
							to="/user/$username/lists/$slug"
							params={{ username: username, slug: list.slug }}
							className="text-primary underline hover:text-primary/80 self-end"
						>
							{m.list_details_container_hide_notes()}
						</Link>
					) : null}
				</div>
			</div>

			{list.items.length === 0 ? (
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
