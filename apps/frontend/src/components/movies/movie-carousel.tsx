import useEmblaCarousel from "embla-carousel-react";
import { useId } from "react";
import {
	NextButton,
	PrevButton,
	usePrevNextButtons,
} from "@/components/ui/embla/embla-carousel-arrow-buttons";
import {
	CarouselGradient,
	useCarouselGradient,
} from "@/components/ui/embla/embla-carousel-gradient";
import type { Movie } from "@/types/movie";
import { MovieCard } from "./movie-card";

interface MovieCarouselProps {
	movies: Movie[];
	title?: string;
}

export const MovieCarousel = ({ movies, title }: MovieCarouselProps) => {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		dragFree: true,
		align: "start",
	});

	const carouselId = useId();

	const {
		prevBtnDisabled,
		nextBtnDisabled,
		onPrevButtonClick,
		onNextButtonClick,
	} = usePrevNextButtons(emblaApi);

	const { showGradient } = useCarouselGradient(emblaApi);

	if (!movies.length) {
		return (
			<div>
				<p>No movies found</p>
			</div>
		);
	}

	const showButtons = !prevBtnDisabled || !nextBtnDisabled;

	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">{title}</h2>
			<div className="relative">
				<div className="overflow-hidden hover:cursor-grab" ref={emblaRef}>
					<div className="flex gap-4">
						{movies.map((movie) => (
							<div
								key={`${carouselId}-${movie.id}`}
								className="min-w-80 md:min-w-60 gap-4"
							>
								<MovieCard movie={movie} />
							</div>
						))}
					</div>
				</div>
				<CarouselGradient show={showGradient} />
			</div>
			{showButtons && (
				<div className="flex items-center gap-2">
					<PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
					<NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
				</div>
			)}
		</section>
	);
};
