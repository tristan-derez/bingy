import { IconEdit, IconLocation } from "@tabler/icons-react";
import { ProfilePicture } from "@/components/profile-picture";
import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages";

interface ProfileInfosProps {
	displayName: string;
	avatar: string | null;
	bio?: string | null;
	location?: string | null;
	onEditClick?: () => void;
	showEditButton?: boolean;
}

export function ProfileInfos({
	displayName,
	avatar,
	bio,
	location,
	onEditClick,
	showEditButton = false,
}: ProfileInfosProps) {
	return (
		<div className="flex flex-col md:flex-row gap-2 lg:gap-4 self-center lg:self-start w-full md:w-lg">
			<ProfilePicture avatar={avatar} displayName={displayName} />
			<div className="flex flex-col gap-2 justify-center flex-1 min-w-0">
				<div className="flex flex-row w-full justify-between gap-2 items-center">
					<p className="font-extrabold text-sm md:text-base">{displayName}</p>
					{showEditButton ? (
						<Button
							variant="secondary"
							size="sm"
							onClick={onEditClick}
							className="shrink-0"
						>
							<IconEdit />
							<span className="hidden md:flex">
								{m.profile_page_edit_btn_label()}
							</span>
						</Button>
					) : null}
				</div>
				<p className="text-muted-foreground text-pretty">
					{bio ?? m.profile_page_user_bio_empty({ username: displayName })}
				</p>
				{location ? (
					<div className="flex flex-row gap-2 items-center text-sm">
						<IconLocation size={16} />
						<p>{location}</p>
					</div>
				) : null}
			</div>
		</div>
	);
}
