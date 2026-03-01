import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { m } from "@/paraglide/messages";
import { getTruncatedContent } from "@/utils/truncate-content";

interface PersonBiographyProps {
	biography: string;
}

export const PersonBiography = ({ biography }: PersonBiographyProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	if (!biography) {
		return <p>{m.person_biography_missing()}</p>;
	}

	const { shouldTruncate, displayText, hiddenText } =
		getTruncatedContent(biography);

	if (!shouldTruncate) {
		return (
			<p className="whitespace-pre-line text-pretty w-6/7">{displayText}</p>
		);
	}

	return (
		<Collapsible
			open={isExpanded}
			onOpenChange={setIsExpanded}
			className="flex flex-col"
		>
			<div className="whitespace-pre-line text-pretty w-6/7">
				<span>{displayText}</span>
				<CollapsibleContent
					render={
						<span className={isExpanded ? "inline" : "hidden"}>
							{" " + hiddenText}
						</span>
					}
				/>
			</div>

			<div>
				<CollapsibleTrigger
					render={
						<Button variant="link" size="sm" className="p-0">
							{isExpanded ? m.btn_show_less() : m.btn_show_more()}
						</Button>
					}
				/>
			</div>
		</Collapsible>
	);
};
