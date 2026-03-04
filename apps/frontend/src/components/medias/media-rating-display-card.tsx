import { IconStarFilled } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { m } from "@/paraglide/messages";

interface MediaRatingDisplayCardProps {
	voteCount: number;
	voteAverage: number;
}

// @todo: use note from db instead of tmdb
export function MediaRatingDisplayCard({
	voteCount,
	voteAverage,
}: MediaRatingDisplayCardProps) {
	const hasVotes = voteCount > 0;

	return (
		<Card>
			<CardContent className="flex items-center gap-4">
				<IconStarFilled className="h-5 w-5 text-yellow-500" />
				<div>
					<p className="text-xl xl:text-2xl font-bold">
						{hasVotes ? voteAverage.toFixed(1) : "—"}
					</p>
					<p className="text-sm text-muted-foreground">
						{hasVotes
							? m.media_details_votes({ count: voteCount, voteCount })
							: m.media_details_no_votes()}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
