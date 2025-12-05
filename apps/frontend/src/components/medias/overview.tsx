import { useState } from "react";
import { m } from "@/paraglide/messages";
import { Button } from "../ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";

interface MediaOverviewProps {
	overview: string;
	bg?: string;
}

export const MediaOverview = ({ overview, bg }: MediaOverviewProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const textColor = bg ? "text-dark-card-foreground" : "text-foreground";

	if (!overview) {
		return <p className={textColor}>{m.overview_none()}</p>;
	}

	const maxInitialLength = 250;

	if (overview.length <= maxInitialLength) {
		return (
			<p className={`w-full xl:w-2/3 whitespace-pre-line ${textColor}`}>
				{overview}
			</p>
		);
	}

	const textUpToLimit = overview.slice(0, maxInitialLength);
	const lastPeriod = textUpToLimit.lastIndexOf(".");

	let displayText: string;
	let hiddenText: string;

	if (lastPeriod > 0) {
		displayText = overview.slice(0, lastPeriod + 1);
		hiddenText = overview.slice(lastPeriod + 1).trim();
	} else {
		displayText = overview.slice(0, maxInitialLength);
		hiddenText = overview.slice(maxInitialLength);
	}

	return (
		<>
			<p className={`w-full xl:w-2/3 whitespace-pre-line ${textColor}`}>
				{displayText}
			</p>
			<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
				<div className={isExpanded ? "hidden" : ""}>
					<CollapsibleTrigger asChild>
						<Button variant="link" size="sm" className={`p-0 ${textColor}`}>
							{m.btn_show_more()}
						</Button>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent>
					<p className={`w-full xl:w-2/3 whitespace-pre-line ${textColor}`}>
						{hiddenText}
					</p>
				</CollapsibleContent>
			</Collapsible>
		</>
	);
};
