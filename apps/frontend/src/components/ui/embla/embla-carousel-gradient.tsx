import type { EmblaCarouselType } from "embla-carousel";
import { useCallback, useEffect, useState } from "react";

type UseCarouselGradientType = {
	showGradient: boolean;
};

export const useCarouselGradient = (
	emblaApi: EmblaCarouselType | undefined,
): UseCarouselGradientType => {
	const [showGradient, setShowGradient] = useState(true);

	const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
		const progress = emblaApi.scrollProgress();
		setShowGradient(progress < 0.99);
	}, []);

	useEffect(() => {
		if (!emblaApi) return;

		onScroll(emblaApi);
		emblaApi.on("scroll", onScroll).on("reInit", onScroll);

		return () => {
			emblaApi.off("scroll", onScroll).off("reInit", onScroll);
		};
	}, [emblaApi, onScroll]);

	return { showGradient };
};

export const CarouselGradient = ({ show }: { show: boolean }) => {
	if (!show) return null;

	return (
		<div className="pointer-events-none absolute right-0 top-0 h-full w-0 bg-linear-to-l from-background to-transparent md:w-12" />
	);
};
