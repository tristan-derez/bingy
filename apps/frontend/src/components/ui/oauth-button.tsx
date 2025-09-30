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
	disabled?: boolean;
}

function OAuthButton({
	icon: Icon,
	label,
	text,
	onClick,
	disabled,
}: OAuthButtonProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="w-full" asChild>
					<Button
						variant="outline"
						className="w-full hover:cursor-pointer"
						aria-label={`${label}`}
						onClick={onClick}
						disabled={disabled}
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
