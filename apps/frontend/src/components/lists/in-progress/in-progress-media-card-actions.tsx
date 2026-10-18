import { IconCheck, IconDotsFilled } from "@tabler/icons-react";
import { useState } from "react";
import type { InProgressItem, NextEpisode } from "@/api/in-progress";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMarkEpisodeWatched } from "@/hooks/useInProgress";
import { useMediaQuery } from "@/integrations/media-query";
import { m } from "@/paraglide/messages";

interface InProgressMediaCardActionsProps {
	username: string;
	item: InProgressItem;
	nextEpisode: NextEpisode;
}

export const InProgressMediaCardActions = ({
	username,
	item,
	nextEpisode,
}: InProgressMediaCardActionsProps) => {
	const [open, setOpen] = useState(false);
	const isMobile = useMediaQuery("(pointer: coarse)");
	const markWatched = useMarkEpisodeWatched(username);

	const handleMarkWatched = () => {
		markWatched.mutate({
			tmdbId: item.id,
			seasonNumber: nextEpisode.season_number,
			episodeNumber: nextEpisode.episode_number,
			trackingMode: item.progress.trackingMode,
		});
		setOpen(false);
	};

	return (
		<div className="absolute right-2 top-2 z-10">
			{isMobile ? (
				<Drawer open={open} onOpenChange={setOpen} swipeDirection="up">
					<DrawerTrigger
						render={(props) => (
							<Button
								{...props}
								variant="ghost"
								size="icon"
								aria-label={m.in_progress_card_actions()}
								className="bg-background/70 backdrop-blur-sm hover:bg-background/90"
							>
								<IconDotsFilled />
							</Button>
						)}
					/>
					<DrawerContent>
						<DrawerBody>
							<div className="p-4">
								<Button
									variant="ghost"
									className="w-full justify-start"
									disabled={markWatched.isPending}
									onClick={handleMarkWatched}
								>
									<IconCheck className="size-4" />
									{m.in_progress_mark_next_seen()}
								</Button>
							</div>
						</DrawerBody>
					</DrawerContent>
				</Drawer>
			) : (
				<DropdownMenu open={open} onOpenChange={setOpen}>
					<DropdownMenuTrigger
						render={
							<Button
								variant="ghost"
								size="icon"
								aria-label={m.in_progress_card_actions()}
								className="bg-background/70 backdrop-blur-sm hover:bg-background/90"
							>
								<IconDotsFilled />
							</Button>
						}
					/>
					<DropdownMenuContent align="end" className="min-w-72">
						<DropdownMenuItem
							disabled={markWatched.isPending}
							onClick={handleMarkWatched}
						>
							<IconCheck className="size-4" />
							{m.in_progress_mark_next_seen()}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
};
