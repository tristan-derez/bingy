// components/badges/position-badge.tsx
import {
	IconRosetteNumber1,
	IconRosetteNumber2,
	IconRosetteNumber3,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface PositionBadgeProps {
	position: number;
	variant?: "overlay" | "inline";
	className?: string;
}

const MEDAL_CONFIG = {
	1: { Icon: IconRosetteNumber1, color: "text-yellow-400" },
	2: { Icon: IconRosetteNumber2, color: "text-gray-300" },
	3: { Icon: IconRosetteNumber3, color: "text-orange-600" },
} as const;

export const PositionBadge = ({
	position,
	variant = "overlay",
	className,
}: PositionBadgeProps) => {
	const medal = MEDAL_CONFIG[position as keyof typeof MEDAL_CONFIG];

	if (medal) {
		const { Icon, color } = medal;
		const size = variant === "overlay" ? "w-8 h-8" : "w-6 h-6";
		return <Icon className={cn(size, color, className)} />;
	}

	if (variant === "inline") {
		return (
			<span
				className={cn("text-lg font-bold text-muted-foreground", className)}
			>
				#{position}
			</span>
		);
	}

	return (
		<div
			className={cn(
				"bg-black/80 text-white px-2 py-1 rounded text-sm font-bold",
				className,
			)}
		>
			#{position}
		</div>
	);
};
