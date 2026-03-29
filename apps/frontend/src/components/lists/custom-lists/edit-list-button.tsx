import { IconEdit } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

interface EditListButtonProps {
	username: string;
	listSlug: string;
	size?: "icon-lg" | "icon-sm" | "lg";
	showText?: boolean;
}

export function EditListButton({
	username,
	listSlug,
	size = "icon-lg",
	showText = true,
}: EditListButtonProps) {
	const navigate = useNavigate();

	return (
		<Button
			size={size}
			onClick={() =>
				navigate({
					to: "/@{$username}/lists/$listslug/edit",
					params: { username, listslug: listSlug },
				})
			}
		>
			<IconEdit />
			{showText && (
				<span className="hidden xs:inline">{m.btn_edit_list()}</span>
			)}
		</Button>
	);
}
