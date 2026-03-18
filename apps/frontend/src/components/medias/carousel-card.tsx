import fallbackPoster from "@/assets/media-image-placeholder.jpg";

interface CarouselCardProps {
	imageUrl: string | null;
	mediaName: string;
}

export function CarouselCard({ imageUrl, mediaName }: CarouselCardProps) {
	return (
		<div className="ring-foreground/10 ring-1 overflow-hidden flex flex-col select-none gap-2 shadow-none py-0 rounded-md w-30 h-45 md:w-45 md:h-67.5">
			<img
				src={imageUrl ?? fallbackPoster}
				alt={mediaName}
				loading="lazy"
				onError={(e) => {
					const target = e.currentTarget;
					if (target.src !== fallbackPoster) {
						target.src = fallbackPoster;
					}
				}}
				className="h-full w-full object-cover aspect-2/3"
			/>
		</div>
	);
}
