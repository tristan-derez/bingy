import { m } from "@/paraglide/messages";
import { Badge } from "../ui/badge";

export const PersonBadge = () => {
	return (
		<Badge
			variant="secondary"
			className="bg-green-500/10 text-green-500 hover:bg-green-500/20 min-w-18 justify-center"
		>
			{m.search_person_badge()}
		</Badge>
	);
};
