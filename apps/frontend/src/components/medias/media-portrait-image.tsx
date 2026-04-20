import { useAtomValue } from "jotai";
import type { Schemas } from "shared";
import { WatchProvidersSection } from "@/components/watch-providers/watch-providers-section";
import { regionAtom } from "@/lib/atoms/region";
import { getTmdbImageUrl, type ImageSize } from "@/utils/utils";

interface MediaPortraitImageProps {
	imagePath: string | null;
	alt: string;
	imageSize?: ImageSize;
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

	return (
		<div className="relative">
			<img
				src={imageUrl ?? undefined}
				alt={alt}
				className="aspect-2/3 w-44 h-65 md:w-52 md:h-80 xl:w-80 xl:h-120 rounded-lg shadow-lg flex items-center justify-center ring-accent ring-1"
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
