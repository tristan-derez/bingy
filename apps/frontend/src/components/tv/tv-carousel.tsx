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
import type { Tv } from "@/types/tv";
import { TvCard } from "./tv-card";

interface TvCarouselProps {
	tvShows: Tv[];
	title?: string;
}

export const TvCarousel = ({ tvShows, title }: TvCarouselProps) => {
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

	if (!tvShows.length) {
		return (
			<div>
				<p>No tv shows found</p>
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
						{tvShows.map((tv: Tv) => (
							<div
								key={`${carouselId}-${tv.id}`}
								className="min-w-80 md:min-w-60 gap-4"
							>
								<TvCard tvShow={tv} />
							</div>
						))}
					</div>
				</div>
				<CarouselGradient show={showGradient} />
			</div>
			{showButtons ? (
				<div className="flex items-center gap-2">
					<PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
					<NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
				</div>
			) : null}
		</section>
	);
};
