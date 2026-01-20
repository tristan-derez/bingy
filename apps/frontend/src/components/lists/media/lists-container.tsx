import {
	IconLayoutGrid,
	IconLock,
	IconUsers,
	IconWorld,
} from "@tabler/icons-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { m } from "@/paraglide/messages";
import { ListPagination } from "../list-pagination";
import { ListCard } from "./list-card";

export type VisibilityFilter = "all" | "public" | "private" | "limited";

type ListsContainerProps = {
	username: string;
	currentUsername?: string;
	items?: {
		id: string;
		name: string;
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
	currentUsername,
	items = [],
	filter,
	onFilterChange,
	page,
	totalPages,
	onPageChange,
}: ListsContainerProps) {
	const isOwnProfile =
		currentUsername?.toLowerCase() === username.toLowerCase();

	const handleFilterChange = (value: string) => {
		if (value) {
			onFilterChange(value as VisibilityFilter);
			onPageChange(1);
		}
	};

	return (
		<div className="container px-4 flex flex-col gap-4">
			<h1 className="text-3xl font-bold">{m.lists_page_title()}</h1>

			{isOwnProfile && (
				<ToggleGroup
					type="single"
					value={filter}
					onValueChange={handleFilterChange}
					className="justify-start"
				>
					<ToggleGroupItem
						value="all"
						aria-label={m.list_visibility_all_aria_label()}
						className="hover:cursor-pointer"
					>
						<IconLayoutGrid className="h-4 w-4" />
						{m.list_visibility_all()}
					</ToggleGroupItem>
					<ToggleGroupItem
						value="public"
						aria-label={m.list_visibility_public_aria_label()}
						className="hover:cursor-pointer"
					>
						<IconWorld className="h-4 w-4" />
						{m.list_visibility_public()}
					</ToggleGroupItem>
					<ToggleGroupItem
						value="limited"
						aria-label={m.list_visibility_limited_aria_label()}
						className="hover:cursor-pointer"
					>
						<IconUsers className="h-4 w-4" />
						{m.list_visibility_limited()}
					</ToggleGroupItem>
					<ToggleGroupItem
						value="private"
						aria-label={m.list_visibility_private_aria_label()}
						className="hover:cursor-pointer"
					>
						<IconLock className="h-4 w-4" />
						{m.list_visibility_private()}
					</ToggleGroupItem>
				</ToggleGroup>
			)}

			{items.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 gap-4">
					<p className="text-muted-foreground">
						{isOwnProfile
							? m.lists_empty_state_own()
							: m.lists_empty_state_other({ username })}
					</p>
				</div>
			) : (
				<>
					<div className="flex flex-col gap-4">
						{items.map((item) => (
							<ListCard
								key={item.id}
								item={item}
								linkTo={`/lists/${item.id}`}
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
