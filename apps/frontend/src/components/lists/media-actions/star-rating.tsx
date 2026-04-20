import { IconStar, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useMovieRating, useTvRating } from "@/hooks/useRating";
import { m } from "@/paraglide/messages";

interface StarRatingProps {
	rating?: number;
	onRatingChange: (rating: number) => void;
	onRatingDelete?: () => void;
	movie?: {
		id: number;
	};
	tvShow?: {
		id: number;
	};
	fetchRating?: boolean;
	username: string;
	gapSize?: number;
	iconSize?: number;
}

export function StarRating({
	rating: externalRating,
	onRatingChange,
	onRatingDelete,
	movie,
	tvShow,
	fetchRating = false,
	username,
	gapSize = 1,
	iconSize = 6,
}: StarRatingProps) {
	const [hoverRating, setHoverRating] = useState<number | null>(null);

	const isTvShow = !!tvShow;
	const tmdbId = isTvShow ? tvShow.id : (movie?.id ?? 0);

	const { data: movieRating } = useMovieRating(username, tmdbId);
	const { data: tvRating } = useTvRating(username, tmdbId);

	const existingRating = isTvShow ? tvRating : movieRating;

	const rating =
		externalRating ?? (fetchRating ? (existingRating?.rating ?? 0) : 0);

	const handleClick = (starIndex: number, isHalf: boolean) => {
		const newRating = starIndex + (isHalf ? 0.5 : 1);
		onRatingChange(newRating);
	};

	const displayRating = hoverRating ?? rating;

	return (
		<div className="flex gap-2 items-center py-1">
			<div
				className={`gap-${gapSize} flex items-center`}
				onMouseLeave={() => setHoverRating(null)}
			>
				{[0, 1, 2, 3, 4].map((starIndex) => {
					const filled = displayRating >= starIndex + 1;
					const halfFilled =
						displayRating > starIndex && displayRating < starIndex + 1;

					return (
						<div key={starIndex} className="relative text-brand">
							<div
								className="absolute left-0 w-1/2 h-full z-10"
								onMouseEnter={() => setHoverRating(starIndex + 0.5)}
								onClick={() => handleClick(starIndex, true)}
							/>
							<div
								className="absolute right-0 w-1/2 h-full z-10"
								onMouseEnter={() => setHoverRating(starIndex + 1)}
								onClick={() => handleClick(starIndex, false)}
							/>

							<IconStar
								className={`w-${iconSize} h-${iconSize} absolute top-0 left-0`}
								fill="none"
								stroke="currentColor"
							/>

							<IconStar
								className={`w-${iconSize} h-${iconSize} relative`}
								fill={filled || halfFilled ? "currentColor" : "none"}
								stroke="none"
								style={
									halfFilled
										? {
												clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
											}
										: undefined
								}
							/>
						</div>
					);
				})}

				{rating > 0 && onRatingDelete ? (
					<button
						type="button"
						onClick={onRatingDelete}
						className="text-muted-foreground hover:text-foreground transition-colors"
						aria-label={m.btn_delete_rating_aria_label()}
					>
						<IconX className="w-5 h-5" />
					</button>
				) : null}
			</div>
		</div>
	);
}
