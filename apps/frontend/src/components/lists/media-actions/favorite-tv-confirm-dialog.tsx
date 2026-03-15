import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { m } from "@/paraglide/messages";

interface FavoriteTvConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}

export function FavoriteTvConfirmDialog({
	open,
	onOpenChange,
	onConfirm,
}: FavoriteTvConfirmDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogTitle>
					{m.alert_dialog_favorite_tv_confirm_title()}
				</AlertDialogTitle>
				<AlertDialogDescription>
					{m.alert_dialog_favorite_tv_confirm_desc()}
				</AlertDialogDescription>
				<AlertDialogFooter>
					<AlertDialogCancel>
						{m.alert_dialog_favorite_tv_confirm_cancel_btn()}
					</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm}>
						{m.alert_dialog_favorite_tv_confirm_btn()}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
