import useEmblaCarousel from "embla-carousel-react";
import { toast } from "sonner";
import {
	NextButton,
	PrevButton,
	usePrevNextButtons,
} from "@/components/ui/embla/embla-carousel-arrow-buttons";
import { useNowPlayingMovies } from "@/hooks/useMovies";
import type { Movie } from "@/types/movie";
import { LoadingSection } from "../loading/loading-section";
import { MovieCard } from "./movie-card";

export const NowPlayingMovies = () => {
	const { data, isLoading, error } = useNowPlayingMovies();
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

	if (isLoading) {
		return <LoadingSection title="In Theaters Now" />;
	}

	if (error) {
		toast.error("error while fetching now playing movies");
		return null;
	}

	if (!data || !data.results?.length) {
		return (
			<div>
				<p>No movies found</p>
			</div>
		);
	}
	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">In Theaters Now</h2>
			<div className="overflow-hidden hover:cursor-grab" ref={emblaRef}>
				<div className="flex gap-4">
					{data.results.map((movie: Movie) => (
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
