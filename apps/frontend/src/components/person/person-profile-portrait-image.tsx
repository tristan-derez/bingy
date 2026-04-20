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

	return (
		<img
			src={imageUrl ?? undefined}
			alt={alt}
			className="aspect-2/3 w-44 h-65 md:w-52 md:h-80 xl:w-80 xl:h-120 rounded-lg shadow-lg flex items-center justify-center ring-accent ring-1"
		/>
	);
}
