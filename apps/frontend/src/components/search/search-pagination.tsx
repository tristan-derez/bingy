import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface SearchPaginationProps {
	currentPage: number;
	totalPages: number;
	query: string;
	language: string;
}

export const SearchPagination = ({
	currentPage,
	totalPages,
	query,
	language,
}: SearchPaginationProps) => {
	const maxPages = Math.min(totalPages, 5);

	const getPageNumbers = (): (number | "ellipsis")[] => {
		if (maxPages <= 5) {
			return Array.from({ length: maxPages }, (_, i) => i + 1);
		}

		if (currentPage <= 3) {
			return [1, 2, 3, 4, "ellipsis", maxPages];
		}

		if (currentPage >= maxPages - 2) {
			return [
				1,
				"ellipsis",
				maxPages - 3,
				maxPages - 2,
				maxPages - 1,
				maxPages,
			];
		}

		return [
			1,
			"ellipsis",
			currentPage - 1,
			currentPage,
			currentPage + 1,
			"ellipsis",
			maxPages,
		];
	};

	if (totalPages <= 1) return null;

	const canGoPrev = currentPage > 1;
	const canGoNext = currentPage < maxPages;

	return (
		<Pagination className="max-w-[320px] md:max-w-full">
			<PaginationContent>
				<PaginationItem>
					{canGoPrev ? (
						<Link
							to="/search"
							search={{ q: query, language, page: currentPage - 1 }}
							className={cn(
								buttonVariants({ variant: "ghost", size: "default" }),
								"gap-1 pl-2.5",
							)}
						>
							<ChevronLeft className="h-4 w-4" />
							<span className="text-xs md:text-lg">Previous</span>
						</Link>
					) : (
						<span
							className={cn(
								buttonVariants({ variant: "ghost", size: "default" }),
								"gap-1 pl-2.5 opacity-50 cursor-not-allowed",
							)}
						>
							<ChevronLeft className="h-4 w-4" />
							<span className="text-xs md:text-lg">Previous</span>
						</span>
					)}
				</PaginationItem>

				{getPageNumbers().map((pageNum, idx) =>
					pageNum === "ellipsis" ? (
						<PaginationItem key={`ellipsis-${idx}`}>
							<PaginationEllipsis />
						</PaginationItem>
					) : (
						<PaginationItem key={pageNum}>
							<Link
								to="/search"
								search={{ q: query, language, page: pageNum }}
								className={cn(
									buttonVariants({
										variant: currentPage === pageNum ? "outline" : "ghost",
										size: "icon",
									}),
									"text-xs md:text-lg",
								)}
							>
								{pageNum}
							</Link>
						</PaginationItem>
					),
				)}

				<PaginationItem>
					{canGoNext ? (
						<Link
							to="/search"
							search={{ q: query, language, page: currentPage + 1 }}
							className={cn(
								buttonVariants({ variant: "ghost", size: "default" }),
								"gap-1 pr-2.5",
							)}
						>
							<span className="text-xs md:text-lg">Next</span>
							<ChevronRight className="h-4 w-4" />
						</Link>
					) : (
						<span
							className={cn(
								buttonVariants({ variant: "ghost", size: "default" }),
								"gap-1 pr-2.5 opacity-50 cursor-not-allowed",
							)}
						>
							<span className="text-xs md:text-lg">Next</span>
							<ChevronRight className="h-4 w-4" />
						</span>
					)}
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};
