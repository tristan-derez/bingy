import { IconDeviceTv, IconLayoutGrid, IconMovie } from "@tabler/icons-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { m } from "@/paraglide/messages";

export type MediaFilter = "all" | "movie" | "tv";

type MediaToggleGroupProps = {
	value: MediaFilter;
	onValueChange: (value: MediaFilter) => void;
};

export function MediaToggleGroup({
	value,
	onValueChange,
}: MediaToggleGroupProps) {
	const handleChange = (values: string[]) => {
		const newValue = values[0];
		if (newValue === "all" || newValue === "movie" || newValue === "tv") {
			onValueChange(newValue);
		}
	};

	return (
		<ToggleGroup
			value={[value]}
			onValueChange={handleChange}
			className="justify-start"
			spacing={2}
		>
			<ToggleGroupItem
				value="all"
				aria-label={m.toggle_aria_label_all()}
				className="hover:cursor-pointer"
			>
				<IconLayoutGrid className="h-4 w-4" />
				{m.toggle_group_item_all()}
			</ToggleGroupItem>
			<ToggleGroupItem
				value="movie"
				aria-label={m.toggle_aria_label_movies()}
				className="hover:cursor-pointer"
			>
				<IconMovie className="h-4 w-4" />
				{m.toggle_group_item_movies()}
			</ToggleGroupItem>
			<ToggleGroupItem
				value="tv"
				aria-label={m.toggle_aria_label_tv()}
				className="hover:cursor-pointer"
			>
				<IconDeviceTv className="h-4 w-4" />
				{m.toggle_group_item_tv()}
			</ToggleGroupItem>
		</ToggleGroup>
	);
}
