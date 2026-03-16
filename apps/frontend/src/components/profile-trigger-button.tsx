import type { ComponentPropsWithoutRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileTriggerButtonProps extends ComponentPropsWithoutRef<"button"> {
	username: string;
	displayName: string;
	image?: string | null;
	showUsername?: boolean;
}

export function ProfileTriggerButton({
	username,
	displayName,
	image,
	showUsername = true,
	className,
	...props
}: ProfileTriggerButtonProps) {
	return (
		<button
			{...props}
			className={cn(
				"flex items-center h-10 gap-2 p-3 rounded-md border transition-all duration-200 focus:outline-none",
				"bg-transparent border-border hover:bg-card-foreground/10 hover:border-ring",
				"focus:outline-none focus-visible:outline-none *:focus:outline-none",
				className,
			)}
		>
			{showUsername && (
				<div className="text-left flex-1">
					<div className="text-sm font-medium tracking-tight leading-tight text-foreground">
						{displayName}
					</div>
				</div>
			)}
			<div className="relative">
				<div className="w-8 h-8 rounded-full p-0.5">
					<div className="w-full h-full rounded-full overflow-hidden bg-card">
						<Avatar className="w-full h-full object-cover rounded-full">
							<AvatarImage src={image || ""} alt={displayName} />
							<AvatarFallback className="rounded-lg">
								{username ? username[0].toUpperCase() : "U"}
							</AvatarFallback>
						</Avatar>
					</div>
				</div>
			</div>
		</button>
	);
}
