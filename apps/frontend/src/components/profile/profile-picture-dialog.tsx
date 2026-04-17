import { ProfilePicture } from "@/components/profile/profile-picture";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ProfilePictureDialogProps {
	avatar?: string | null;
	displayName: string;
}

export function ProfilePictureDialog({
	avatar,
	displayName,
}: ProfilePictureDialogProps) {
	return (
		<Dialog>
			<DialogTrigger
				render={
					<button type="button" className="cursor-pointer">
						<ProfilePicture avatar={avatar} displayName={displayName} />
					</button>
				}
			/>
			<DialogContent className="p-0 border-0 bg-transparent ring-0 shadow-none max-w-sm">
				{avatar ? (
					<img
						src={avatar}
						alt={displayName}
						className="w-full aspect-square rounded-lg object-cover"
					/>
				) : null}
			</DialogContent>
		</Dialog>
	);
}
