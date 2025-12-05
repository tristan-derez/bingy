import {
	CheckCircle,
	Clapperboard,
	RotateCcw,
	Sparkles,
	XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { m } from "@/paraglide/messages";

const STATUS_CONFIG = {
	"In Production": {
		icon: Clapperboard,
		key: "tv_details_status_in_production",
	},
	"Returning Series": {
		icon: RotateCcw,
		key: "tv_details_status_returning_series",
	},
	Canceled: {
		icon: XCircle,
		key: "tv_details_status_canceled",
	},
	Ended: {
		icon: CheckCircle,
		key: "tv_details_status_ended",
	},
	Pilot: {
		icon: Sparkles,
		key: "tv_details_status_pilot",
	},
} as const;

type TVStatus = keyof typeof STATUS_CONFIG;

interface TVStatusCardProps {
	status: string;
}

export function TVStatusCard({ status }: TVStatusCardProps) {
	const config = STATUS_CONFIG[status as TVStatus];

	if (!config) return null;

	const Icon = config.icon;
	const statusMessage = m[config.key as keyof typeof m] as () => string;

	return (
		<Card>
			<CardContent className="flex items-center gap-4">
				<Icon className="h-5 w-5" />
				<div>
					<p className="text-xl xl:text-2xl font-bold">{statusMessage()}</p>
					<p className="text-sm text-muted-foreground">
						{m.tv_details_status()}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
