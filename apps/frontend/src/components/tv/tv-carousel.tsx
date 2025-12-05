import useEmblaCarousel from "embla-carousel-react";
import { useId } from "react";
import type { Schemas } from "shared";
import {
	NextButton,
	PrevButton,
	usePrevNextButtons,
} from "@/components/ui/embla/embla-carousel-arrow-buttons";
import {
	CarouselGradient,
	useCarouselGradient,
} from "@/components/ui/embla/embla-carousel-gradient";
import { TvCard } from "./tv-card";

interface TvCarouselProps {
	tvShows: Schemas.Tv[];
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
		return null;
	}

	const showButtons = !prevBtnDisabled || !nextBtnDisabled;

	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">{title}</h2>
			<div className="relative">
				<div className="overflow-hidden hover:cursor-grab" ref={emblaRef}>
					<div className="flex gap-4">
						{tvShows.map((tv: Schemas.Tv) => (
							<div
								key={`${carouselId}-${tv.id}`}
								className="flex-[0_0_calc(100vw-3rem)] md:flex-[0_0_300px]"
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
