import { m } from "@/paraglide/messages";
import { Badge } from "../ui/badge";

interface MovieBadgeProps {
	minWidth?: number;
}

export const MovieBadge = ({ minWidth = 18 }: MovieBadgeProps) => {
	return (
		<Badge
			variant="secondary"
			className={`bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 min-w-${minWidth} justify-center`}
		>
			{m.search_movie_badge()}
		</Badge>
	);
};
