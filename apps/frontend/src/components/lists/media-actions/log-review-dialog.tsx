import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRateMovie, useRateTvShow } from "@/hooks/useRating";
import { useTv } from "@/hooks/useTv";
import { m } from "@/paraglide/messages";
import { getNumberOrNull } from "@/utils/get-number-or-null";
import {
	getHasContinuousEpisodeNumbering,
	getLastAiredEpisodeInfo,
	getValidSeasons,
} from "@/utils/season-helper";
import { AbsoluteEpisodeCombobox } from "./absolute-episode-combobox";
import { ReviewTextarea } from "./review-text-area";
import { SeasonEpisodeCombobox } from "./season-episode-combobox";
import { StarRating } from "./star-rating";
import { WatchedDateControl } from "./watched-date-controls";

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
	imageUrl?: string | null;
	username: string;
	existingData?: {
		rating: number | null;
		review: string | null;
		watchedAt: Date | null;
		seasonNumber?: string | null;
		episodeNumber?: string | null;
	};
}

interface ReviewFormData {
	rating: number;
	season: string;
	episode: string;
	shouldUseAbsoluteEpisode: boolean;
	absoluteEpisode: string;
	isComplete: boolean;
	review: string;
	watchedDate: Date;
	hasSpecificDate: boolean;
}

const initialFormData = {
	season: "",
	episode: "",
	shouldUseAbsoluteEpisode: false,
	absoluteEpisode: "",
	isComplete: false,
	review: "",
	hasSpecificDate: true,
};

export function LogReviewDialog({
	open,
	onOpenChange,
	tvShow,
	movie,
	imageUrl,
	username,
	existingData,
}: LogReviewDialogProps) {
	const isTvShow = !!tvShow;
	const tmdbId = isTvShow ? tvShow.id : (movie?.id ?? 0);
	const rating = existingData?.rating ?? 0;

	const { data: tvDetails } = useTv(tmdbId, {}, { enabled: isTvShow });

	const rateMovieMutation = useRateMovie();
	const rateTvMutation = useRateTvShow();

	const [reviewFormData, setReviewFormData] = useState<ReviewFormData>({
		...initialFormData,
		rating,
		watchedDate: new Date(),
	});

	const seasons = getValidSeasons(tvDetails?.seasons);
	const hasContinuousNumbering = getHasContinuousEpisodeNumbering(tvDetails);
	const totalEpisodes = tvDetails?.number_of_episodes ?? 0;
	const mediaTitle = isTvShow ? tvShow.name : movie?.title;

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			setReviewFormData({
				...initialFormData,
				rating,
				watchedDate: new Date(),
			});
		}
		onOpenChange(newOpen);
	};

	// sync form with data available via the query
	useEffect(() => {
		if (!existingData || !open) return;

		setReviewFormData((prev) => ({
			...prev,
			rating,
			review: existingData.review ?? "",
			season: existingData.seasonNumber ?? "",
			episode: existingData.episodeNumber ?? "",
			watchedDate: existingData.watchedAt
				? new Date(existingData.watchedAt)
				: new Date(),
			hasSpecificDate: !!existingData.watchedAt, // keep track of checkboxes states
		}));
	}, [open, existingData]);

	const handleHasSpecificDateChange = (checked: boolean) => {
		setReviewFormData((prev) => ({
			...prev,
			hasSpecificDate: checked,
		}));
	};

	const handleCompleteChange = (checked: boolean) => {
		if (!checked) {
			return setReviewFormData((prev) => ({
				...prev,
				isComplete: false,
				season: "",
				episode: "",
			}));
		}

		const episodeInfo = getLastAiredEpisodeInfo(tvDetails);
		if (!episodeInfo) return;

		setReviewFormData((prev) => ({
			...prev,
			isComplete: true,
			season: episodeInfo.seasonNumber.toString(),
			episode: episodeInfo.episodeNumber.toString(),
		}));
	};

	const handleShouldUseAbsoluteEpisodeChange = (checked: boolean) => {
		setReviewFormData((prev) => ({
			...prev,
			shouldUseAbsoluteEpisode: checked,
			season: "",
			episode: "",
			absoluteEpisode: "",
			isComplete: false,
		}));
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		const payload = {
			tmdbId,
			rating: reviewFormData.rating || null,
			review: reviewFormData.review || null,
			watchedAt: reviewFormData.watchedDate || null,
		};

		const options = { onSuccess: () => handleOpenChange(false) };

		if (!isTvShow) {
			return rateMovieMutation.mutate(payload, options);
		}

		rateTvMutation.mutate(
			{
				...payload,
				lastWatchedSeason: getNumberOrNull(reviewFormData.season),
				lastWatchedEpisode: getNumberOrNull(reviewFormData.episode),
				absoluteEpisode: getNumberOrNull(reviewFormData.absoluteEpisode),
				trackingMode: reviewFormData.shouldUseAbsoluteEpisode
					? "absolute"
					: "season",
			},
			options,
		);
	};

	const isSubmitting = rateMovieMutation.isPending || rateTvMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="lg:max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
				<div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden gap-8 p-6">
					{imageUrl && (
						<div className="hidden lg:flex items-start justify-center shrink-0">
							<div className="w-full max-w-2xs sticky top-0">
								<img
									src={imageUrl}
									alt={mediaTitle || "Media poster"}
									className="w-full h-auto rounded-lg shadow-lg object-cover"
								/>
							</div>
						</div>
					)}

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
							<div className="flex flex-col gap-4 py-4 flex-1 overflow-y-auto min-h-0 pr-2">
								<div className="flex flex-col gap-2">
									<Label>{m.log_review_dialog_rating_label()}</Label>
									<StarRating
										username={username}
										rating={reviewFormData.rating}
										onRatingChange={(rating) =>
											setReviewFormData((prev) => ({ ...prev, rating }))
										}
										onRatingDelete={() =>
											setReviewFormData((prev) => ({ ...prev, rating: 0 }))
										}
									/>
								</div>

								<WatchedDateControl
									watchedDate={reviewFormData.watchedDate}
									hasSpecificDate={reviewFormData.hasSpecificDate}
									handleHasSpecificDateChange={handleHasSpecificDateChange}
									setWatchedDate={(watchedDate) =>
										setReviewFormData((prev) => ({ ...prev, watchedDate }))
									}
								/>

								{isTvShow ? (
									<div className="flex flex-col gap-4 border-t pt-4">
										<div className="flex items-center gap-2">
											<Checkbox
												id="isComplete"
												checked={reviewFormData.isComplete}
												onCheckedChange={handleCompleteChange}
											/>
											<Label
												htmlFor="isComplete"
												className="text-sm font-normal cursor-pointer"
											>
												{m.log_review_dialog_tv_show_completed_label()}
											</Label>
										</div>

										{!reviewFormData.isComplete && (
											<>
												{hasContinuousNumbering ? (
													<div className="flex items-center gap-2">
														<Checkbox
															id="useAbsoluteEpisode"
															checked={reviewFormData.shouldUseAbsoluteEpisode}
															onCheckedChange={
																handleShouldUseAbsoluteEpisodeChange
															}
														/>
														<Label
															htmlFor="useAbsoluteEpisode"
															className="text-sm font-normal cursor-pointer"
														>
															{m.log_review_dialog_absolute_episode_label()}
														</Label>
													</div>
												) : null}

												{reviewFormData.shouldUseAbsoluteEpisode ? (
													<AbsoluteEpisodeCombobox
														totalEpisodes={totalEpisodes}
														selectedEpisode={reviewFormData.absoluteEpisode}
														onEpisodeChange={(absoluteEpisode) =>
															setReviewFormData((prev) => ({
																...prev,
																absoluteEpisode,
															}))
														}
													/>
												) : (
													<SeasonEpisodeCombobox
														seasons={seasons}
														selectedSeason={reviewFormData.season}
														selectedEpisode={reviewFormData.episode}
														onSeasonChange={(season) =>
															setReviewFormData((prev) => ({ ...prev, season }))
														}
														onEpisodeChange={(episode) =>
															setReviewFormData((prev) => ({
																...prev,
																episode,
															}))
														}
													/>
												)}
											</>
										)}
									</div>
								) : null}

								<ReviewTextarea
									value={reviewFormData.review}
									onChange={(review) =>
										setReviewFormData((prev) => ({ ...prev, review }))
									}
									label={m.log_review_dialog_review_label()}
									placeholder={m.log_review_dialog_review_placeholder()}
								/>
							</div>

							<div className="sticky bottom-0 pt-4 shrink-0 flex gap-2 self-end">
								<DialogClose
									render={
										<Button variant="outline" disabled={isSubmitting}>
											{m.log_review_dialog_cancel_btn()}
										</Button>
									}
								/>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting
										? m.log_review_dialog_submitting_btn()
										: m.log_review_dialog_submit_btn()}
								</Button>
							</div>
						</form>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
