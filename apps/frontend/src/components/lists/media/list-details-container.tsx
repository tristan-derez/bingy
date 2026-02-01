import { Link } from "@tanstack/react-router";
import { ListMediaDetailsCard } from "@/components/lists/media/list-media-details-card";
import { m } from "@/paraglide/messages";
import { ListPagination } from "../list-pagination";

type ListDetailsContainerProps = {
	username: string;
	list: {
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
	const sortedItems =
		list.type === "ranked"
			? [...list.items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
			: list.items;

	return (
		<div className="container px-4 flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">{list.name}</h1>
					<Link
						to="/user/$username/lists/$slug"
						params={{ username: username, slug: list.slug }}
						className="text-primary underline hover:text-primary/80"
					>
						{m.list_details_container_hide_notes()}
					</Link>
				</div>

				{list.description ? (
					<p className="text-muted-foreground">{list.description}</p>
				) : null}
			</div>

			{list.items.length === 0 ? (
				<p className="text-center py-12 text-muted-foreground">
					{isOwnList ? m.list_container_empty_own() : m.list_container_empty()}{" "}
					<Link to="/" className="text-primary underline hover:text-primary/80">
						{m.list_container_empty_own_cta()}
					</Link>
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
