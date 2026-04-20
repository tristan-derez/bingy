import { IconMenu2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileProfileTriggerButtonProps {
	className?: string;
	size?:
		| "default"
		| "xs"
		| "sm"
		| "lg"
		| "icon"
		| "icon-xs"
		| "icon-sm"
		| "icon-lg"
		| null;
	variant?:
		| "default"
		| "outline"
		| "secondary"
		| "ghost"
		| "destructive"
		| "link"
		| null;
}

export function MobileProfileTriggerButton({
	className,
	size = "icon",
	variant = "ghost",
	...props
}: MobileProfileTriggerButtonProps) {
	return (
		<Button {...props} size="icon" variant="ghost" className={cn(className)}>
			<IconMenu2 />
		</Button>
	);
}
