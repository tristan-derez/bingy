import { IconPencil } from "@tabler/icons-react";
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
					to: "/user/$username/lists/$listslug/edit",
					params: { username, listslug: listSlug },
				})
			}
		>
			<IconPencil />
			{showText && (
				<span className="hidden xs:inline">{m.btn_edit_list()}</span>
			)}
		</Button>
	);
}
