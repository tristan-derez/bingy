import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

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
	if (totalPages <= 1) return null;

	const getPageNumbers = () => {
		const pages: (number | "ellipsis")[] = [];
		const showMax = 7;

		if (totalPages <= showMax) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		pages.push(1);
		if (currentPage > 3) pages.push("ellipsis");

		const start = Math.max(2, currentPage - 1);
		const end = Math.min(totalPages - 1, currentPage + 1);

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		if (currentPage < totalPages - 2) pages.push("ellipsis");
		pages.push(totalPages);

		return pages;
	};

	const PaginationLink = ({
		page,
		children,
		disabled,
		className,
	}: {
		page: number;
		children: React.ReactNode;
		disabled?: boolean;
		className?: string;
	}) => {
		const styles = cn(
			buttonVariants({ variant: "ghost", size: "default" }),
			disabled && "opacity-50 cursor-not-allowed",
			className,
		);

		if (disabled) return <span className={styles}>{children}</span>;

		return (
			<Link
				to="/search"
				search={{ q: query, language, page }}
				className={styles}
			>
				{children}
			</Link>
		);
	};

	return (
		<Pagination>
			<PaginationContent>
				{/* Previous Button */}
				<PaginationItem>
					<PaginationLink
						page={currentPage - 1}
						disabled={currentPage <= 1}
						className="gap-1 pl-2.5"
					>
						<IconChevronLeft className="h-4 w-4" />
						<span className="sm:inline">{m.search_pagination_previous()}</span>
					</PaginationLink>
				</PaginationItem>

				{/* Current page indicator on mobile */}
				<PaginationItem className="sm:hidden">
					<span className="px-2 text-sm">
						{currentPage} / {totalPages}
					</span>
				</PaginationItem>

				{/* Numbers - hidden on mobile */}
				{getPageNumbers().map((pageNum, idx) => (
					<PaginationItem key={idx} className="hidden sm:inline-flex">
						{pageNum === "ellipsis" ? (
							<PaginationEllipsis />
						) : (
							<Link
								to="/search"
								search={{ q: query, language, page: pageNum }}
								className={cn(
									buttonVariants({
										variant: currentPage === pageNum ? "outline" : "ghost",
										size: "icon",
									}),
								)}
							>
								{pageNum}
							</Link>
						)}
					</PaginationItem>
				))}

				{/* Next Button */}
				<PaginationItem>
					<PaginationLink
						page={currentPage + 1}
						disabled={currentPage >= totalPages}
						className="gap-1 pr-2.5"
					>
						<span className="sm:inline">{m.search_pagination_next()}</span>
						<IconChevronRight className="h-4 w-4" />
					</PaginationLink>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};
