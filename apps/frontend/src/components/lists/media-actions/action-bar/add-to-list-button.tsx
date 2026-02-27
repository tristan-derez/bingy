import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

interface AddToListButtonProps {
	onClick: () => void;
}

export function AddToListButton({ onClick }: AddToListButtonProps) {
	return (
		<Button variant="ghost" onClick={onClick}>
			{m.btn_add_to_list_text()}
		</Button>
	);
}
