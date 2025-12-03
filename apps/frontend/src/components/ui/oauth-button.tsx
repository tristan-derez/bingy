import type { IconType } from "react-icons";
import { Badge } from "@/components/ui/badge";
import { m } from "@/paraglide/messages";
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
	lastMethod?: boolean;
}

function OAuthButton({
	icon: Icon,
	label,
	text,
	onClick,
	disabled,
	lastMethod,
}: OAuthButtonProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="w-full" asChild>
					<Button
						variant="outline"
						className="w-full hover:cursor-pointer justify-center relative"
						aria-label={`${label}`}
						onClick={onClick}
						disabled={disabled}
					>
						<Icon className="h-5 w-5" />
						<p>{text}</p>
						{lastMethod && (
							<Badge
								variant="secondary"
								className="absolute right-2 rounded-md"
							>
								{m.signin_last_method_badge()}
							</Badge>
						)}
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
