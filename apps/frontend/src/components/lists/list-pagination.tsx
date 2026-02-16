import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

type ListPaginationProps = {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export function ListPagination({
	page,
	totalPages,
	onPageChange,
}: ListPaginationProps) {
	if (totalPages <= 1) return null;

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() => onPageChange(Math.max(1, page - 1))}
						className={
							page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
						}
					/>
				</PaginationItem>

				<PaginationItem>
					<PaginationLink
						onClick={() => onPageChange(1)}
						isActive={page === 1}
						className="cursor-pointer"
					>
						1
					</PaginationLink>
				</PaginationItem>

				{page > 3 && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{Array.from({ length: totalPages }, (_, i) => i + 1)
					.filter((p) => p > 1 && p < totalPages && Math.abs(p - page) <= 1)
					.map((p) => (
						<PaginationItem key={p}>
							<PaginationLink
								onClick={() => onPageChange(p)}
								isActive={p === page}
								className="cursor-pointer"
							>
								{p}
							</PaginationLink>
						</PaginationItem>
					))}

				{page < totalPages - 2 && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{totalPages > 1 && (
					<PaginationItem>
						<PaginationLink
							onClick={() => onPageChange(totalPages)}
							isActive={page === totalPages}
							className="cursor-pointer"
						>
							{totalPages}
						</PaginationLink>
					</PaginationItem>
				)}

				<PaginationItem>
					<PaginationNext
						onClick={() => onPageChange(Math.min(totalPages, page + 1))}
						className={
							page === totalPages
								? "pointer-events-none opacity-50"
								: "cursor-pointer"
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
