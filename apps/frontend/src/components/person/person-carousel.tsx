import useEmblaCarousel from "embla-carousel-react";
import {
	NextButton,
	PrevButton,
	usePrevNextButtons,
} from "@/components/ui/embla/embla-carousel-arrow-buttons";
import type { CastMember } from "../movies/movie-details";
import { PersonCard } from "./person-card";

interface PersonCarouselProps {
	people: CastMember[];
}

export const PersonCarousel = ({ people }: PersonCarouselProps) => {
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

	if (!people.length) {
		return (
			<div>
				<p>No cast</p>
			</div>
		);
	}

	return (
		<section className="flex flex-col gap-1 lg:gap-2">
			<div className="overflow-hidden hover:cursor-grab" ref={emblaRef}>
				<div className="flex gap-1 lg:gap-4">
					{people.map((person) => (
						<div key={person.id} className="min-w-30 lg:min-w-60">
							<PersonCard key={person.id} person={person} />
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
