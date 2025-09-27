import { RiVerifiedBadgeFill } from "react-icons/ri";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { UpdatePasswordForm } from "./auth/forms/update-password-form";
import { Separator } from "./ui/separator";

export function AccountDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="flex items-center w-full">
					<RiVerifiedBadgeFill className="mr-2" />
					<span>Account</span>
				</div>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit account</DialogTitle>
					<DialogDescription>
						Make changes to your account informations here.
					</DialogDescription>
				</DialogHeader>
				<Separator />
				<UpdatePasswordForm />
				<Separator />
			</DialogContent>
		</Dialog>
	);
}
