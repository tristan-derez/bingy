import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfilePictureProps {
	avatar?: string | null;
	displayName: string;
}

export function ProfilePicture({ avatar, displayName }: ProfilePictureProps) {
	return (
		<Avatar className="w-16 h-16 object-cover rounded-full">
			<AvatarImage src={avatar ?? ""} alt={displayName} />
			<AvatarFallback className="rounded-full">
				{displayName.charAt(0)}
			</AvatarFallback>
		</Avatar>
	);
}
