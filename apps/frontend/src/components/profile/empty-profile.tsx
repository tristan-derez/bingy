import { IconMoodWrrrFilled } from "@tabler/icons-react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { m } from "@/paraglide/messages";

interface EmptyProfileProps {
	ownProfile: boolean;
}

export function EmptyProfile({ ownProfile }: EmptyProfileProps) {
	return (
		<Empty className="min-h-[400px]">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconMoodWrrrFilled />
				</EmptyMedia>
				<EmptyTitle>{m.empty_profile_title()}</EmptyTitle>
				<EmptyDescription>
					{ownProfile
						? m.empty_profile_desc_own()
						: m.empty_profile_desc_other()}
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
