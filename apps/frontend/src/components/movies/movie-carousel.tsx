import useEmblaCarousel from "embla-carousel-react";
import {
	NextButton,
	PrevButton,
	usePrevNextButtons,
} from "@/components/ui/embla/embla-carousel-arrow-buttons";
import type { Movie } from "@/types/movie";
import { MovieCard } from "./movie-card";

interface MovieCarouselProps {
	title: string;
	movies: Movie[];
}

export const MovieCarousel = ({ title, movies }: MovieCarouselProps) => {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		dragFree: true,
		align: "start",
	});

	const {
		prevBtnDisabled,
		nextBtnDisabled,
		onPrevButtonClick,
		onNextButtonClick,
	} = usePrevNextButtons(emblaApi);

	if (!movies.length) {
		return (
			<div>
				<p>No movies found</p>
			</div>
		);
	}

	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">{title}</h2>
			<div className="overflow-hidden hover:cursor-grab" ref={emblaRef}>
				<div className="flex gap-4">
					{movies.map((movie) => (
						<div key={movie.id} className="min-w-80 md:min-w-60">
							<MovieCard movie={movie} />
						</div>
					))}
				</div>
			</div>
			<div className="flex items-center gap-2">
				<PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
				<NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
			</div>
		</section>
	);
};
