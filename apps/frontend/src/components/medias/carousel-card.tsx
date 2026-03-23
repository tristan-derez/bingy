interface CarouselCardProps {
	imageUrl: string | null;
	mediaName: string;
}

export function CarouselCard({ imageUrl, mediaName }: CarouselCardProps) {
	return (
		<div className="ring-foreground/10 ring-1 overflow-hidden flex flex-col select-none gap-2 shadow-none py-0 rounded-md w-30 h-45 md:w-45 md:h-67.5">
			<img
				src={imageUrl ?? undefined}
				alt={mediaName}
				loading="lazy"
				className="h-full w-full object-cover aspect-2/3 ring-accent ring-1 flex items-center justify-center"
			/>
		</div>
	);
}
