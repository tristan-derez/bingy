import { useAtomValue } from "jotai";
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
import { localeRegionAtom } from "@/lib/atoms/region";
import { m } from "@/paraglide/messages";
import {
	getLastAiredEpisodeInfo,
	getValidSeasons,
	usesContinuousEpisodeNumbering,
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
	initialRating?: number;
	imageUrl?: string;
	username: string;
	existingData?: {
		rating: number | null;
		review: string | null;
		watchedAt: Date | null;
		seasonNumber?: string | null;
		episodeNumber?: string | null;
	};
}

export function LogReviewDialog({
	open,
	onOpenChange,
	tvShow,
	movie,
	initialRating = 0,
	imageUrl,
	username,
	existingData,
}: LogReviewDialogProps) {
	const localeRegion = useAtomValue(localeRegionAtom);
	const isTvShow = !!tvShow;
	const tmdbId = isTvShow ? tvShow.id : (movie?.id ?? 0);

	const { data: tvDetails } = useTv(
		tmdbId,
		{ language: localeRegion },
		{ enabled: isTvShow },
	);

	const rateMovieMutation = useRateMovie();
	const rateTvMutation = useRateTvShow();

	const [rating, setRating] = useState(initialRating);
	const [season, setSeason] = useState("");
	const [episode, setEpisode] = useState("");
	const [useAbsoluteEpisode, setUseAbsoluteEpisode] = useState(false);
	const [absoluteEpisode, setAbsoluteEpisode] = useState("");
	const [isComplete, setIsComplete] = useState(false);
	const [review, setReview] = useState("");
	const [hasSpecificDate, setHasSpecificDate] = useState(true);
	const [unknownDate, setUnknownDate] = useState(false);
	const [watchedDate, setWatchedDate] = useState<Date>(new Date());

	const seasons = getValidSeasons(tvDetails?.seasons);
	const hasContinuousNumbering = usesContinuousEpisodeNumbering(tvDetails);
	const totalEpisodes = tvDetails?.number_of_episodes ?? 0;
	const mediaTitle = isTvShow ? tvShow.name : movie?.title;

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			setRating(initialRating);
			setHasSpecificDate(true);
			setUnknownDate(false);
			setWatchedDate(new Date());
			setSeason("");
			setEpisode("");
			setUseAbsoluteEpisode(false);
			setAbsoluteEpisode("");
			setIsComplete(false);
			setReview("");
		}
		onOpenChange(newOpen);
	};

	useEffect(() => {
		if (open && existingData) {
			setRating(existingData.rating ?? initialRating);
			setReview(existingData.review ?? "");

			if (existingData.watchedAt) {
				setWatchedDate(new Date(existingData.watchedAt));
				setHasSpecificDate(true);
				setUnknownDate(false);
			} else {
				setHasSpecificDate(false);
				setUnknownDate(true);
			}

			if (isTvShow && existingData.seasonNumber && existingData.episodeNumber) {
				setSeason(existingData.seasonNumber);
				setEpisode(existingData.episodeNumber);
			}
		}
	}, [open, existingData, initialRating, isTvShow]);

	const handleHasSpecificDateChange = (checked: boolean) => {
		setHasSpecificDate(checked);
		if (checked) {
			setUnknownDate(false);
		} else {
			setUnknownDate(true);
		}
	};

	const handleUnknownDateChange = (checked: boolean) => {
		setUnknownDate(checked);
		if (checked) {
			setHasSpecificDate(false);
		} else {
			setHasSpecificDate(true);
		}
	};

	const handleCompleteChange = (checked: boolean) => {
		setIsComplete(checked);
		if (checked) {
			const episodeInfo = getLastAiredEpisodeInfo(tvDetails);
			if (episodeInfo) {
				if (useAbsoluteEpisode) {
					const episodesBeforeSeason =
						tvDetails?.seasons
							?.filter(
								(s) =>
									s.season_number > 0 &&
									s.season_number < episodeInfo.seasonNumber,
							)
							.reduce((sum, s) => sum + s.episode_count, 0) ?? 0;
					setAbsoluteEpisode(
						(episodesBeforeSeason + episodeInfo.episodeNumber).toString(),
					);
				} else {
					setSeason(episodeInfo.seasonNumber.toString());
					setEpisode(episodeInfo.episodeNumber.toString());
				}
			}
		} else {
			setSeason("");
			setEpisode("");
			setAbsoluteEpisode("");
		}
	};

	const handleUseAbsoluteEpisodeChange = (checked: boolean) => {
		setUseAbsoluteEpisode(checked);
		setSeason("");
		setEpisode("");
		setAbsoluteEpisode("");
		setIsComplete(false);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const watchedAt = hasSpecificDate ? watchedDate : undefined;

		if (isTvShow) {
			let lastWatchedSeason: number | undefined;
			let lastWatchedEpisode: number | undefined;
			let absoluteEpisodeNumber: number | undefined;

			if (useAbsoluteEpisode && absoluteEpisode) {
				const absEp = Number(absoluteEpisode);
				absoluteEpisodeNumber = absEp;
				let remaining = absEp;
				const validSeasons = seasons.filter((s) => s.season_number > 0);

				for (const s of validSeasons) {
					if (remaining <= s.episode_count) {
						lastWatchedSeason = s.season_number;
						lastWatchedEpisode = remaining;
						break;
					}
					remaining -= s.episode_count;
				}
			} else if (season && episode) {
				lastWatchedSeason = Number(season);
				lastWatchedEpisode = Number(episode);
			}

			rateTvMutation.mutate(
				{
					tmdbId,
					rating: rating || undefined,
					review: review || undefined,
					lastWatchedSeason,
					lastWatchedEpisode,
					absoluteEpisode: absoluteEpisodeNumber,
					trackingMode: useAbsoluteEpisode ? "absolute" : "season",
					watchedAt,
				},
				{ onSuccess: () => handleOpenChange(false) },
			);
		} else {
			rateMovieMutation.mutate(
				{
					tmdbId,
					rating: rating || undefined,
					review: review || undefined,
					watchedAt,
				},
				{ onSuccess: () => handleOpenChange(false) },
			);
		}
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
										rating={rating}
										onRatingChange={setRating}
										onRatingDelete={() => setRating(0)}
									/>
								</div>

								<WatchedDateControl
									hasSpecificDate={hasSpecificDate}
									unknownDate={unknownDate}
									watchedDate={watchedDate}
									handleHasSpecificDateChange={handleHasSpecificDateChange}
									handleUnknownDateChange={handleUnknownDateChange}
									setWatchedDate={setWatchedDate}
								/>

								{isTvShow && (
									<div className="flex flex-col gap-4 border-t pt-4">
										<div className="flex items-center gap-2">
											<Checkbox
												id="isComplete"
												checked={isComplete}
												onCheckedChange={(c) =>
													handleCompleteChange(c === true)
												}
											/>
											<Label
												htmlFor="isComplete"
												className="text-sm font-normal cursor-pointer"
											>
												{m.log_review_dialog_tv_show_completed_label()}
											</Label>
										</div>

										{!isComplete && (
											<>
												{hasContinuousNumbering && (
													<div className="flex items-center gap-2">
														<Checkbox
															id="useAbsoluteEpisode"
															checked={useAbsoluteEpisode}
															onCheckedChange={(c) =>
																handleUseAbsoluteEpisodeChange(c === true)
															}
														/>
														<Label
															htmlFor="useAbsoluteEpisode"
															className="text-sm font-normal cursor-pointer"
														>
															{m.log_review_dialog_absolute_episode_label()}
														</Label>
													</div>
												)}

												{useAbsoluteEpisode ? (
													<AbsoluteEpisodeCombobox
														totalEpisodes={totalEpisodes}
														selectedEpisode={absoluteEpisode}
														onEpisodeChange={setAbsoluteEpisode}
													/>
												) : (
													<SeasonEpisodeCombobox
														seasons={seasons}
														selectedSeason={season}
														selectedEpisode={episode}
														onSeasonChange={setSeason}
														onEpisodeChange={setEpisode}
													/>
												)}
											</>
										)}
									</div>
								)}

								<ReviewTextarea
									value={review}
									onChange={setReview}
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
