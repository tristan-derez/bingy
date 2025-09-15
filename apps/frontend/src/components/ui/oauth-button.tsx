import type { IconType } from "react-icons";
import { Button } from "./button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./tooltip";

interface OAuthButtonProps {
	icon: IconType;
	label: string;
	text: string;
	onClick: () => void;
}

function OAuthButton({ icon: Icon, label, text, onClick }: OAuthButtonProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="w-full" asChild>
					<Button
						variant="outline"
						className="w-full"
						aria-label={`${label}`}
						onClick={onClick}
					>
						<Icon className="h-5 w-5" />
						<p>{text}</p>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export { OAuthButton };
