import { useAtomValue } from "jotai";
import type { SyntheticEvent } from "react";
import type { Schemas } from "shared";
import fallbackPoster from "@/assets/media-image-placeholder.jpg";
import { WatchProvidersSection } from "@/components/watch-providers/watch-providers-section";
import { regionAtom } from "@/lib/atoms/region";
import { getTmdbImageUrl } from "@/utils/utils";

interface MediaPortraitImageProps {
	imagePath: string | null;
	alt: string;
	imageSize?: "w500" | "original";
	watchProviders?: Schemas.WatchProviders;
}

export function MediaPortraitImage({
	imagePath,
	alt,
	watchProviders,
	imageSize = "original",
}: MediaPortraitImageProps) {
	const region = useAtomValue(regionAtom);
	const imageUrl = getTmdbImageUrl(imagePath, imageSize);

	const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
		const target = e.currentTarget;
		if (target.src !== fallbackPoster) {
			target.src = fallbackPoster;
		}
	};

	return (
		<div className="relative w-full">
			<img
				src={imageUrl ?? fallbackPoster}
				alt={alt}
				className="aspect-2/3 w-full max-h-72 lg:max-h-90 rounded-lg shadow-lg xl:max-h-[450px]"
				onError={handleImageError}
			/>

			{watchProviders ? (
				<WatchProvidersSection
					watchProviders={watchProviders}
					region={region}
					className="absolute bottom-0 w-full items-center justify-center rounded-b-lg border-none bg-linear-to-t from-black via-black/60 to-transparent p-4 py-0 pt-50"
				/>
			) : null}
		</div>
	);
}
