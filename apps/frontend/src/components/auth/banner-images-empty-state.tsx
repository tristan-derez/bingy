import { IconPhotoOff } from "@tabler/icons-react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { m } from "@/paraglide/messages";

export function BackdropImagesEmptyState() {
	return (
		<Empty className="min-h-[200px]">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconPhotoOff className="size-4" />
				</EmptyMedia>
				<EmptyTitle>{m.banner_image_select_empty_title()}</EmptyTitle>
				<EmptyDescription>
					{m.banner_image_select_empty_desc()}
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
