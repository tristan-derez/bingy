import type { SyntheticEvent } from "react";
import fallbackPoster from "@/assets/user-placeholder.jpg";
import { getTmdbImageUrl, type ImageSize } from "@/utils/utils";

interface PersonProfilePortraitImageProps {
	imagePath: string | null;
	alt: string;
	imageSize?: ImageSize;
}

export function PersonProfilePortraitImage({
	imagePath,
	alt,
	imageSize = "original",
}: PersonProfilePortraitImageProps) {
	const imageUrl = getTmdbImageUrl(imagePath, imageSize);

	const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
		const target = e.currentTarget;
		if (target.src !== fallbackPoster) {
			target.src = fallbackPoster;
		}
	};

	return (
		<img
			src={imageUrl ?? fallbackPoster}
			alt={alt}
			className="aspect-2/3 w-44 h-65 md:w-52 md:h-80 lg:w-67 lg:h-100 xl:w-80 xl:h-120 rounded-lg shadow-lg"
			onError={handleImageError}
		/>
	);
}
