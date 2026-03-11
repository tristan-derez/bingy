import type { Icon } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { m } from "@/paraglide/messages";
import { Button } from "./button";

interface OAuthButtonProps {
	icon: Icon;
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
		<Button
			variant="outline"
			className="w-full justify-center relative"
			aria-label={`${label}`}
			onClick={onClick}
			disabled={disabled}
		>
			<Icon className="h-5 w-5" />
			<p>{text}</p>
			{lastMethod ? (
				<Badge
					variant="secondary"
					className="hidden right-2 rounded-md md:absolute"
				>
					{m.signin_last_method_badge()}
				</Badge>
			) : null}
		</Button>
	);
}

export { OAuthButton };
