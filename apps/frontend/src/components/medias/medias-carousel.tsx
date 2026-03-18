import useEmblaCarousel from "embla-carousel-react";
import { useId } from "react";
import type { Schemas } from "shared";
import { MediaCard } from "@/components/medias/media-card";
import {
	NextButton,
	PrevButton,
	usePrevNextButtons,
} from "@/components/ui/embla/embla-carousel-arrow-buttons";
import {
	CarouselGradient,
	useCarouselGradient,
} from "@/components/ui/embla/embla-carousel-gradient";

interface MediaCarouselProps {
	medias:
		| (Schemas.MediaWithCastCredits | Schemas.MediaWithCrewCredits)[]
		| null;
	title?: string;
}

export const MediasCarousel = ({ medias, title }: MediaCarouselProps) => {
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

	if (!medias) {
		return null;
	}

	const showButtons = !prevBtnDisabled || !nextBtnDisabled;

	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">{title}</h2>
			<div className="relative">
				<div className="overflow-hidden hover:cursor-grab" ref={emblaRef}>
					<div className="flex gap-4 p-px">
						{medias.map((media) => (
							<div key={`${carouselId}-${media.id}`} className="flex-none">
								<MediaCard media={media} />
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
