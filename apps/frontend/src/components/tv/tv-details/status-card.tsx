import {
	IconCircleCheck,
	IconCircleX,
	IconClipboard,
	IconProgress,
	IconSparkles,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { m } from "@/paraglide/messages";

const STATUS_CONFIG = {
	"In Production": {
		icon: IconClipboard,
		key: "tv_details_status_in_production",
	},
	"Returning Series": {
		icon: IconProgress,
		key: "tv_details_status_returning_series",
	},
	Canceled: {
		icon: IconCircleX,
		key: "tv_details_status_canceled",
	},
	Ended: {
		icon: IconCircleCheck,
		key: "tv_details_status_ended",
	},
	Pilot: {
		icon: IconSparkles,
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
		<Card className="border ring-0">
			<CardContent className="flex items-center gap-4">
				<Icon />
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
