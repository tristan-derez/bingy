import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useMediaQuery } from "@/integrations/media-query";
import { m } from "@/paraglide/messages";
import { getTruncatedContent } from "@/utils/truncate-content";

interface ListDescriptionProps {
	description: string | null;
}

export const ListDescription = ({ description }: ListDescriptionProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const isMobile = useMediaQuery("(max-width: 768px)");
	const searchWindow = isMobile ? 120 : 300;

	if (!description) {
		return <span />;
	}

	const { shouldTruncate, displayText, hiddenText } = getTruncatedContent(
		description,
		searchWindow,
	);

	if (!shouldTruncate) {
		return (
			<p className="text-muted-foreground whitespace-pre-wrap w-full md:max-w-6/7 lg:max-w-3/4 text-pretty leading-relaxed">
				{displayText}
			</p>
		);
	}

	return (
		<Collapsible
			open={isExpanded}
			onOpenChange={setIsExpanded}
			className="flex flex-col"
		>
			<div className="text-muted-foreground whitespace-pre-wrap w-full md:max-w-6/7 lg:max-w-3/4">
				<span>{displayText}</span>
				<CollapsibleContent
					render={
						<span className={isExpanded ? "inline" : "hidden"}>
							{hiddenText}
						</span>
					}
				/>
			</div>

			<div>
				<CollapsibleTrigger
					render={
						<Button variant="link" size="sm" className="p-0">
							{isExpanded ? (
								<>
									<IconChevronUp /> {m.btn_show_less()}
								</>
							) : (
								<>
									<IconChevronDown /> {m.btn_show_more()}
								</>
							)}
						</Button>
					}
				/>
			</div>
		</Collapsible>
	);
};
