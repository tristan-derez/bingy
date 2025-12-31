import { Star } from "lucide-react";
import { useState } from "react";
import { useMovieRating, useTvRating } from "@/hooks/useRating";

interface StarRatingProps {
	rating?: number;
	onRatingChange: (rating: number) => void;
	movie?: {
		id: number;
	};
	tvShow?: {
		id: number;
	};
	fetchRating?: boolean;
	username: string;
}

export function StarRating({
	rating: externalRating,
	onRatingChange,
	movie,
	tvShow,
	fetchRating = false,
	username,
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
		<div className="flex gap-1 py-2" onMouseLeave={() => setHoverRating(null)}>
			{[0, 1, 2, 3, 4].map((starIndex) => {
				const filled = displayRating >= starIndex + 1;
				const halfFilled =
					displayRating > starIndex && displayRating < starIndex + 1;

				return (
					<div key={starIndex} className="relative cursor-pointer text-brand">
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

						<Star
							className="w-6 h-6 absolute top-0 left-0"
							fill="none"
							stroke="currentColor"
						/>

						<Star
							className="w-6 h-6 relative"
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
		</div>
	);
}
