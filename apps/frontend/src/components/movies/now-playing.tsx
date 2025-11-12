import useEmblaCarousel from "embla-carousel-react";
import { toast } from "sonner";
import {
	NextButton,
	PrevButton,
	usePrevNextButtons,
} from "@/components/ui/embla/embla-carousel-arrow-buttons";
import { useNowPlayingMovies } from "@/hooks/useMovies";
import type { Movie } from "@/types/movie";
import { CenteredLayout } from "../layout/centered-layout";
import { LoaderOne } from "../ui/loader";
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
		return (
			<CenteredLayout>
				<LoaderOne />
			</CenteredLayout>
		);
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
			<h2 className="text-xl font-semibold">Now Playing</h2>
			<div className="overflow-hidden hover:cursor-grab" ref={emblaRef}>
				<div className="flex gap-4">
					{data.results.map((movie: Movie) => (
						<div
							key={movie.id}
							className="flex-[0_0_80%] sm:flex-[0_0_60%] md:flex-[0_0_40%] lg:flex-[0_0_300px]"
						>
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
