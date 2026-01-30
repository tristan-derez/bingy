import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDeleteList } from "@/hooks/useLists";
import { m } from "@/paraglide/messages";

interface DeleteListButtonProps {
	listId: string;
	listName: string;
}

export function DeleteListButton({ listId, listName }: DeleteListButtonProps) {
	const [open, setOpen] = useState(false);
	const { mutate: deleteList, isPending } = useDeleteList();

	const handleDelete = () => {
		deleteList(listId);
		setOpen(false);
	};

	return (
		<>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setOpen(true)}
						disabled={isPending}
						aria-label="Delete list"
					>
						<IconTrash />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>{m.delete_list_tooltip({ list_name: listName })}</p>
				</TooltipContent>
			</Tooltip>

			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{m.delete_list_dialog_title()}</AlertDialogTitle>
						<AlertDialogDescription>
							{m.delete_list_dialog_description({ list_name: listName })}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							{m.delete_list_dialog_cancel()}
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete} disabled={isPending}>
							{m.delete_list_dialog_confirm()}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
