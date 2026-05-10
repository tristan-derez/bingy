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
		type: "ranked" | "unranked";
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
		<div className="flex flex-col gap-4 flex-1">
			{isOwnProfile ? (
				<div className="flex items-center justify-between gap-4">
					<ToggleGroup
						value={filter ? [filter] : []}
						onValueChange={(values) => handleFilterChange(values[0] || "")}
						className="justify-start"
						spacing={2}
					>
						<ToggleGroupItem
							value="all"
							aria-label={m.list_visibility_all_aria_label()}
						>
							<IconLayoutGrid className="h-4 w-4" />
							<span className="hidden xs:inline">
								{m.list_visibility_all()}
							</span>
						</ToggleGroupItem>
						<ToggleGroupItem
							value="public"
							aria-label={m.list_visibility_public_aria_label()}
						>
							<IconWorld className="h-4 w-4" />
							<span className="hidden xs:inline">
								{m.list_visibility_public()}
							</span>
						</ToggleGroupItem>
						<ToggleGroupItem
							value="limited"
							aria-label={m.list_visibility_limited_aria_label()}
						>
							<IconUsers className="h-4 w-4" />
							<span className="hidden xs:inline">
								{m.list_visibility_limited()}
							</span>
						</ToggleGroupItem>
						<ToggleGroupItem
							value="private"
							aria-label={m.list_visibility_private_aria_label()}
						>
							<IconLock className="h-4 w-4" />
							<span className="hidden xs:inline">
								{m.list_visibility_private()}
							</span>
						</ToggleGroupItem>
					</ToggleGroup>

					<Button>
						<Link to="/lists/create" className="flex items-center gap-2">
							<IconPlus className="h-4 w-4 font-bold" />
							<span className="font-semibold hidden xs:inline">
								{m.btn_create_list()}
							</span>
						</Link>
					</Button>
				</div>
			) : null}

			{emptyList ? (
				<ListsEmptyState
					isOwnProfile={isOwnProfile}
					username={username}
					filter={filter}
				/>
			) : (
				<>
					<div
						className={`grid gap-4 ${items.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}
					>
						{items.map((item) => (
							<ListCard
								key={item.id}
								item={item}
								username={username}
								isOwnProfile={isOwnProfile}
							/>
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
