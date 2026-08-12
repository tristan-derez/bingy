import { type ReactNode, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerBody, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/integrations/media-query";
import { cn } from "@/lib/utils";
import { getTmdbImageUrl, type ImageSize } from "@/utils/utils";

interface PortraitImageProps {
	imagePath: string | null;
	alt: string;
	imageSize?: ImageSize;
	className?: string;
	fallback?: ReactNode;
}

const DEFAULT_SIZE_CLASSES =
	"w-44 md:w-52 lg:w-56 xl:w-64 2xl:max-w-60 aspect-2/3";

const DEFAULT_FALLBACK = (
	<div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm">
		No image
	</div>
);

export function PortraitImage({
	imagePath,
	alt,
	imageSize = "original",
	className,
	fallback = DEFAULT_FALLBACK,
}: PortraitImageProps) {
	const imageUrl = getTmdbImageUrl(imagePath, imageSize);
	const fullImageUrl = getTmdbImageUrl(imagePath, "original");
	const isMobile = useMediaQuery("(pointer: coarse)");
	const [open, setOpen] = useState(false);

	const containerClasses = cn(
		DEFAULT_SIZE_CLASSES,
		"rounded-lg shadow-lg ring-accent ring-1 overflow-hidden flex items-center justify-center",
		className,
	);

	function FullImage({ className }: { className: string }) {
		return fullImageUrl ? (
			<img src={fullImageUrl} alt={alt} className={className} />
		) : null;
	}

	return (
		<>
			{imageUrl ? (
				<img
					src={imageUrl}
					alt={alt}
					className={cn(containerClasses, "cursor-zoom-in")}
					onClick={() => setOpen(true)}
				/>
			) : (
				<div className={containerClasses}>{fallback}</div>
			)}

			{isMobile ? (
				<Drawer open={open} onOpenChange={setOpen} swipeDirection="down">
					<DrawerContent className="max-h-[96vh]">
						<DrawerBody>
							<div className="flex items-center justify-center p-4">
								<FullImage className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-lg" />
							</div>
						</DrawerBody>
					</DrawerContent>
				</Drawer>
			) : (
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogContent
						showCloseButton={false}
						className="p-0 border-0 bg-transparent ring-0 shadow-none w-auto max-w-fit"
					>
						<FullImage className="max-w-[85vw] max-h-[75vh] w-auto h-auto object-contain rounded-lg" />
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
