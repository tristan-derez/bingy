import { IconStarFilled } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaAverageRating } from "@/hooks/useRating";
import { m } from "@/paraglide/messages";

interface MediaRatingDisplayCardProps {
	mediaType: "movie" | "tv";
	tmdbId: number;
}

export function MediaRatingDisplayCard({
	mediaType,
	tmdbId,
}: MediaRatingDisplayCardProps) {
	const { data, isLoading } = useMediaAverageRating(mediaType, tmdbId);

	const voteCount = data?.ratingCount ?? 0;
	const averageRating = data?.averageRating;

	if (isLoading) {
		return (
			<Card>
				<CardContent className="flex items-center gap-4">
					<Skeleton className="h-5 w-5 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-7 w-12" />
						<Skeleton className="h-4 w-24" />
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardContent className="flex items-center gap-4">
				<IconStarFilled className="h-5 w-5 text-yellow-500" />
				<div>
					<p className="text-xl xl:text-2xl font-bold">
						{averageRating
							? `${averageRating % 1 ? averageRating.toFixed(1) : averageRating}/5`
							: "—"}
					</p>
					<p className="text-sm text-muted-foreground">
						{voteCount > 0
							? m.media_details_votes({ count: voteCount, voteCount })
							: m.media_details_no_votes()}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
