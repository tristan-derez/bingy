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
import { m } from "@/paraglide/messages";

interface RemoveHistoryAlertDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mediaName: string;
	onConfirm: () => void;
}

export function RemoveHistoryAlertDialog({
	open,
	onOpenChange,
	mediaName,
	onConfirm,
}: RemoveHistoryAlertDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{m.alert_dialog_remove_media_history_title()}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{m.alert_dialog_remove_media_history_desc({
							media_name: mediaName,
						})}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>
						{m.alert_dialog_remove_media_history_cancel_btn()}
					</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>
						{m.alert_dialog_remove_media_history_confirm_btn()}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
