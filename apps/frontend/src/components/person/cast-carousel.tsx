import useEmblaCarousel from "embla-carousel-react";
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
import { CastCardCarousel } from "./cast-card-carousel";

interface CastCarouselProps {
	people: Schemas.CastMember[];
}

export const CastCarousel = ({ people }: CastCarouselProps) => {
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

	const { showGradient } = useCarouselGradient(emblaApi);

	if (!people.length) return null;

	const showButtons = !prevBtnDisabled || !nextBtnDisabled;

	return (
		<section className="flex flex-col gap-4">
			<div className="relative">
				<div className="overflow-hidden hover:cursor-grab" ref={emblaRef}>
					<div className="flex gap-4 p-px">
						{people.map((person) => (
							<div key={person.id} className="flex-none">
								<CastCardCarousel person={person} />
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
