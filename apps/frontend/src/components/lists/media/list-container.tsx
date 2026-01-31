import { Link } from "@tanstack/react-router";
import { ListMediaCard } from "@/components/lists/media/list-media-card";
import { m } from "@/paraglide/messages";
import { ListPagination } from "../list-pagination";

type ListContainerProps = {
	username: string;
	list: {
		name: string;
		slug: string;
		description: string | null;
		items: Array<{
			id: number;
			title: string;
			originalTitle: string;
			releaseDate: string;
			posterPath: string | null;
			mediaType: "movie" | "tv";
			addedAt: Date;
			note: string | null;
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
	return (
		<div className="container px-4 flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">{list.name}</h1>
					{list.items.length > 0 ? (
						<Link
							to="/user/$username/lists/$slug/details"
							params={{ username: username, slug: list.slug }}
							className="text-primary underline hover:text-primary/80"
						>
							{m.list_container_see_notes()}
						</Link>
					) : null}
				</div>
				{list.description ? (
					<p className="text-muted-foreground">{list.description}</p>
				) : null}
			</div>

			{list.items.length === 0 ? (
				<p className="text-center py-12 text-muted-foreground">
					{isOwnList ? (
						<>
							{m.list_container_empty_own()}{" "}
							<Link
								to="/"
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
					<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-8 gap-2 sm:gap-4">
						{list.items.map((item) => (
							<ListMediaCard key={`${item.mediaType}-${item.id}`} item={item} />
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
