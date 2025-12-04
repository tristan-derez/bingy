import { ArrowDown } from "lucide-react";
import { m } from "@/paraglide/messages";
import { Button } from "../ui/button";

interface ScrollToCrewButtonProps {
	crewSectionId: string;
}

export const ScrollToCrewButton = ({
	crewSectionId,
}: ScrollToCrewButtonProps) => {
	return (
		<Button asChild variant="outline">
			<a
				href={`#${crewSectionId}`}
				onClick={(e) => {
					e.preventDefault();
					document.getElementById(crewSectionId)?.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});
				}}
			>
				{m.btn_jump_to_crew()}
				<ArrowDown className="h-4 w-4" />
			</a>
		</Button>
	);
};
