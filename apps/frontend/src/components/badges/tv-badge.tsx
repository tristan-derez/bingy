import { m } from "@/paraglide/messages";
import { Badge } from "../ui/badge";

interface TvShowBadgeProps {
	minWidth?: number;
}

export const TvShowBadge = ({ minWidth = 18 }: TvShowBadgeProps) => {
	return (
		<Badge
			variant="secondary"
			className={`bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 min-w-${minWidth} justify-center`}
		>
			{m.search_tv_badge()}
		</Badge>
	);
};
