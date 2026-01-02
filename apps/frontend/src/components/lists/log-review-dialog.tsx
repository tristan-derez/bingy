import { IconCalendarWeekFilled } from "@tabler/icons-react";
import { format } from "date-fns";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useRateMovie, useRateTvShow } from "@/hooks/useRating";
import { useTv } from "@/hooks/useTv";
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import { SeasonEpisodeCombobox } from "./season-episode-combobox";
import { StarRating } from "./star-rating";

interface LogReviewDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	movie?: {
		mediaType?: string;
		id: number;
		title: string;
	};
	tvShow?: {
		mediaType?: string;
		id: number;
		name: string;
	};
	initialRating?: number;
	imageUrl?: string;
	username: string;
}

export function LogReviewDialog({
	open,
	onOpenChange,
	tvShow,
	movie,
	initialRating = 0,
	imageUrl,
	username,
}: LogReviewDialogProps) {
	const localeRegion = useAtomValue(localeRegionAtom);
	const isTvShow = !!tvShow;
	const tmdbId = isTvShow ? tvShow.id : (movie?.id ?? 0);

	const { data: tvDetails } = useTv(
		tmdbId,
		{
			language: localeRegion,
		},
		{
			enabled: isTvShow,
		},
	);

	const rateMovieMutation = useRateMovie();
	const rateTvMutation = useRateTvShow();

	const [rating, setRating] = useState(initialRating);
	const [season, setSeason] = useState("");
	const [episode, setEpisode] = useState("");
	const [isComplete, setIsComplete] = useState(false);
	const [review, setReview] = useState("");
	const [watchedToday, setWatchedToday] = useState(true);
	const [watchedBefore, setWatchedBefore] = useState(false);
	const [watchedDate, setWatchedDate] = useState<Date>(new Date());

	const seasons = tvDetails?.seasons?.filter((s) => s.season_number > 0) || [];

	useEffect(() => {
		if (open) {
			setRating(initialRating);
			setWatchedToday(true);
			setWatchedBefore(false);
			setWatchedDate(new Date());
			setSeason("");
			setEpisode("");
			setIsComplete(false);
			setReview("");
		}
	}, [open, initialRating]);

	const mediaTitle = isTvShow ? tvShow.name : movie?.title;

	const handleWatchedTodayChange = (checked: boolean) => {
		setWatchedToday(checked);
		if (checked) {
			setWatchedBefore(false);
			setWatchedDate(new Date());
		}
	};

	const handleWatchedBeforeChange = (checked: boolean) => {
		setWatchedBefore(checked);
		if (checked) {
			setWatchedToday(false);
		}
	};

	const handleCompleteChange = (checked: boolean) => {
		setIsComplete(checked);

		if (checked && seasons.length > 0) {
			const lastSeason = seasons[seasons.length - 1];
			setSeason(lastSeason.season_number.toString());
			setEpisode(lastSeason.episode_count.toString());
		} else if (!checked) {
			setSeason("");
			setEpisode("");
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const watchedAt = watchedBefore ? undefined : watchedDate;

		if (isTvShow) {
			rateTvMutation.mutate(
				{
					tmdbId,
					rating: rating || undefined,
					review: review || undefined,
					lastWatchedSeason: isComplete
						? undefined
						: Number(season) || undefined,
					lastWatchedEpisode: isComplete
						? undefined
						: Number(episode) || undefined,
					watchedAt,
				},
				{
					onSuccess: () => onOpenChange(false),
				},
			);
		} else {
			rateMovieMutation.mutate(
				{
					tmdbId,
					rating: rating || undefined,
					review: review || undefined,
					watchedAt,
				},
				{
					onSuccess: () => onOpenChange(false),
				},
			);
		}
	};

	const isSubmitting = rateMovieMutation.isPending || rateTvMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-[95vw] lg:max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
				<div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden gap-8 p-6">
					{imageUrl ? (
						<div className="hidden lg:flex items-start justify-center shrink-0">
							<div className="w-full max-w-2xs sticky top-0">
								<img
									src={imageUrl}
									alt={mediaTitle || "Media poster"}
									className="w-full h-auto rounded-lg shadow-lg object-cover"
								/>
							</div>
						</div>
					) : null}

					<div className="flex flex-col flex-1 min-h-0 overflow-hidden">
						<DialogHeader className="shrink-0">
							<DialogTitle>
								{isTvShow
									? m.log_review_dialog_title_tv()
									: m.log_review_dialog_title_movie()}
							</DialogTitle>
							<DialogDescription className="max-w-full lg:max-w-3/4">
								{isTvShow
									? m.log_review_dialog_desc_tv()
									: m.log_review_dialog_desc_movie()}
							</DialogDescription>
						</DialogHeader>

						<form
							onSubmit={handleSubmit}
							className="flex flex-col flex-1 min-h-0 overflow-hidden"
						>
							<div className="flex flex-col gap-4 py-4 flex-1 overflow-y-auto min-h-0">
								<div className="flex flex-col gap-2">
									<Label>Rating (optional)</Label>
									<StarRating
										username={username}
										rating={rating}
										onRatingChange={setRating}
									/>
								</div>

								<div className="flex flex-col lg:flex-row gap-3">
									<div className="flex items-center gap-2">
										<Checkbox
											id="watchedToday"
											checked={watchedToday}
											onCheckedChange={(checked) =>
												handleWatchedTodayChange(checked === true)
											}
										/>
										<Label
											htmlFor="watchedToday"
											className="text-sm font-normal"
										>
											Watched on
										</Label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													className="h-7 px-2 text-sm font-normal"
													type="button"
												>
													<IconCalendarWeekFilled className="mr-1.5 h-3.5 w-3.5" />
													{format(watchedDate, "MMMM d, yyyy")}
												</Button>
											</PopoverTrigger>
											<PopoverContent align="start">
												<Calendar
													className="w-full"
													mode="single"
													selected={watchedDate}
													onSelect={(date) => date && setWatchedDate(date)}
													captionLayout="dropdown"
												/>
											</PopoverContent>
										</Popover>
									</div>

									<div className="flex items-center gap-2">
										<Checkbox
											id="watchedBefore"
											checked={watchedBefore}
											onCheckedChange={(checked) =>
												handleWatchedBeforeChange(checked === true)
											}
										/>
										<Label
											htmlFor="watchedBefore"
											className="text-sm font-normal cursor-pointer"
										>
											I watched this before
										</Label>
									</div>
								</div>

								{isTvShow ? (
									<>
										<div className="flex items-center gap-2">
											<Checkbox
												id="isComplete"
												checked={isComplete}
												onCheckedChange={(checked) =>
													handleCompleteChange(checked === true)
												}
											/>
											<Label
												htmlFor="isComplete"
												className="text-sm font-normal cursor-pointer"
											>
												Completed
											</Label>
										</div>

										{!isComplete ? (
											<SeasonEpisodeCombobox
												seasons={seasons}
												selectedSeason={season}
												selectedEpisode={episode}
												onSeasonChange={setSeason}
												onEpisodeChange={setEpisode}
											/>
										) : null}
									</>
								) : null}

								<div className="flex flex-col gap-2 flex-1">
									<Label htmlFor="review">Review (optional)</Label>
									<Textarea
										id="review"
										value={review}
										onChange={(e) => setReview(e.target.value)}
										placeholder="Share your thoughts..."
										className="flex-1 min-h-[120px]"
									/>
								</div>
							</div>

							<div className="sticky bottom-0 bg-background pt-4 shrink-0">
								<DialogFooter className="gap-2">
									<DialogClose asChild>
										<Button
											variant="outline"
											type="button"
											disabled={isSubmitting}
										>
											Cancel
										</Button>
									</DialogClose>
									<Button type="submit" disabled={isSubmitting}>
										{isSubmitting ? "Saving..." : "Save"}
									</Button>
								</DialogFooter>
							</div>
						</form>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
