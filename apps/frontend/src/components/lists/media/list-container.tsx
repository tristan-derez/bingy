import { Link } from "@tanstack/react-router";
import { ListMediaCard } from "@/components/lists/media/list-media-card";
import { m } from "@/paraglide/messages";
import { ListPagination } from "../list-pagination";

type ListContainerProps = {
	list: {
		name: string;
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
	list,
	page,
	totalPages,
	onPageChange,
	isOwnList,
}: ListContainerProps) {
	return (
		<div className="container px-4 flex flex-col gap-4">
			<div>
				<h1 className="text-3xl font-bold">{list.name}</h1>
				{list.description && (
					<p className="mt-2 text-muted-foreground">{list.description}</p>
				)}
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
