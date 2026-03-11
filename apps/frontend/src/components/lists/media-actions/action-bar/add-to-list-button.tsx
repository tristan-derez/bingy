import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

interface AddToListButtonProps {
	onClick: () => void;
}

export function AddToListButton({ onClick }: AddToListButtonProps) {
	return (
		<Button variant="ghost" onClick={onClick} className="flex gap-2">
			<span>{m.btn_add_to_list_text()}</span>
			<IconPlus className="ml-auto" />
		</Button>
	);
}
