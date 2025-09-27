import { IoSettingsSharp } from "react-icons/io5";
import { ModeToggle } from "@/components/theme-toggle";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export function SettingsDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="flex items-center w-full">
					<IoSettingsSharp className="mr-2" />
					<span>Settings</span>
				</div>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Theme</DialogTitle>
					<DialogDescription>Select your preferred theme</DialogDescription>
				</DialogHeader>
				<div className="flex py-4">
					<ModeToggle />
				</div>
			</DialogContent>
		</Dialog>
	);
}
