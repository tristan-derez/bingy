import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

interface ScrollToCrewButtonProps {
	crewSectionId: string;
}

export const ScrollToCrewButton = ({
	crewSectionId,
}: ScrollToCrewButtonProps) => {
	return (
		<Button variant="outline">
			<a
				href={`#${crewSectionId}`}
				onClick={(e) => {
					e.preventDefault();
					document.getElementById(crewSectionId)?.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});
				}}
				className="hover:cursor-default flex flex-row gap-1"
			>
				{m.btn_jump_to_crew()}
				<ArrowDown className="h-4 w-4 self-center" />
			</a>
		</Button>
	);
};
