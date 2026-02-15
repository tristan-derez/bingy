import {
	IconLayoutGrid,
	IconLock,
	IconPlus,
	IconUsers,
	IconWorld,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { m } from "@/paraglide/messages";
import { ListPagination } from "../list-pagination";
import { ListCard } from "./list-card";
import { ListsEmptyState } from "./lists-empty-state";

export type VisibilityFilter = "all" | "public" | "private" | "limited";

type ListsContainerProps = {
	username: string;
	userNameFromSession?: string;
	items?: {
		id: string;
		name: string;
		slug: string;
		description: string | null;
		visibility: "limited" | "private" | "public";
		createdAt: Date;
		updatedAt: Date | null;
	}[];
	filter: VisibilityFilter;
	onFilterChange: (filter: VisibilityFilter) => void;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export function ListsContainer({
	username,
	userNameFromSession,
	items = [],
	filter,
	onFilterChange,
	page,
	totalPages,
	onPageChange,
}: ListsContainerProps) {
	const isOwnProfile =
		userNameFromSession?.toLowerCase() === username.toLowerCase();

	const handleFilterChange = (value: string) => {
		if (value) {
			onFilterChange(value as VisibilityFilter);
			onPageChange(1);
		}
	};

	const emptyList = items.length === 0;

	return (
		<div className="container px-4 flex flex-col gap-4">
			<h1 className="text-3xl font-bold">{m.lists_page_title()}</h1>

			{isOwnProfile ? (
				<div className="flex items-center justify-between gap-4">
					<ToggleGroup
						type="single"
						value={filter}
						onValueChange={handleFilterChange}
						className="justify-start"
					>
						<ToggleGroupItem
							value="all"
							aria-label={m.list_visibility_all_aria_label()}
						>
							<IconLayoutGrid className="h-4 w-4" />
							{m.list_visibility_all()}
						</ToggleGroupItem>
						<ToggleGroupItem
							value="public"
							aria-label={m.list_visibility_public_aria_label()}
						>
							<IconWorld className="h-4 w-4" />
							{m.list_visibility_public()}
						</ToggleGroupItem>
						<ToggleGroupItem
							value="limited"
							aria-label={m.list_visibility_limited_aria_label()}
						>
							<IconUsers className="h-4 w-4" />
							{m.list_visibility_limited()}
						</ToggleGroupItem>
						<ToggleGroupItem
							value="private"
							aria-label={m.list_visibility_private_aria_label()}
						>
							<IconLock className="h-4 w-4" />
							{m.list_visibility_private()}
						</ToggleGroupItem>
					</ToggleGroup>
					<Button size="icon-lg">
						<Link to="/lists/create" className="hover:cursor-default">
							<IconPlus className="h-4 w-4" />
						</Link>
					</Button>
				</div>
			) : null}

			{emptyList ? (
				<ListsEmptyState isOwnProfile={isOwnProfile} username={username} />
			) : (
				<>
					<div
						className={`grid gap-4 ${items.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}
					>
						{items.map((item) => (
							<ListCard key={item.id} item={item} username={username} />
						))}
					</div>

					<ListPagination
						page={page}
						totalPages={totalPages}
						onPageChange={onPageChange}
					/>
				</>
			)}
		</div>
	);
}
