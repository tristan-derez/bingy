import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface EmptyCardSlotProps {
	isOwnProfile: boolean;
}

export function EmptyCardSlot({ isOwnProfile }: EmptyCardSlotProps) {
	return (
		<div className="aspect-2/3 rounded-lg bg-muted flex items-center justify-center">
			{isOwnProfile ? (
				<Button size="icon-sm">
					<IconPlus />
				</Button>
			) : null}
		</div>
	);
}
