import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { m } from "@/paraglide/messages";
import { getTruncatedContent } from "@/utils/truncate-content";

export const MediaOverview = ({ overview }: { overview: string }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const { shouldTruncate, displayText, hiddenText } =
		getTruncatedContent(overview);

	if (!shouldTruncate) {
		return (
			<p className="text-sm xl:w-6/7 whitespace-pre-line text-foreground text-pretty leading-relaxed">
				{overview}
			</p>
		);
	}

	return (
		<Collapsible
			open={isExpanded}
			onOpenChange={setIsExpanded}
			className="group flex gap-3 text-sm xl:w-6/7"
		>
			<div className="flex-1 whitespace-pre-line leading-relaxed text-pretty text-foreground">
				<span>{displayText}</span>
				<CollapsibleContent
					render={
						<span className={isExpanded ? "inline" : "hidden"}>
							{" "}
							{hiddenText}
						</span>
					}
				/>
			</div>

			<div className="flex flex-none items-start">
				<CollapsibleTrigger
					render={
						<Button
							variant="secondary"
							size="icon"
							className="h-6 w-6 p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
							title={isExpanded ? m.btn_show_less() : m.btn_show_more()}
						>
							{isExpanded ? (
								<IconChevronUp size={18} />
							) : (
								<IconChevronDown size={18} />
							)}
						</Button>
					}
				/>
			</div>
		</Collapsible>
	);
};
