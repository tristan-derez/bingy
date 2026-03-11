import type { Schemas } from "shared";
import { Badge } from "@/components/ui/badge";

interface MediaGenresBadgeProps {
	genres: Schemas.Genre[];
}

export function MediaGenresBadge({ genres }: MediaGenresBadgeProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{genres.map((genre) => (
				<Badge key={genre.id} variant="secondary">
					{genre.name}
				</Badge>
			))}
		</div>
	);
}
