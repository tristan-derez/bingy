import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerBody, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/integrations/media-query";
import { getTmdbImageUrl, type ImageSize } from "@/utils/utils";

interface MediaPortraitImageProps {
	imagePath: string | null;
	alt: string;
	imageSize?: ImageSize;
}

export function MediaPortraitImage({
	imagePath,
	alt,
	imageSize = "original",
}: MediaPortraitImageProps) {
	const imageUrl = getTmdbImageUrl(imagePath, imageSize);
	const isMobile = useMediaQuery("(pointer: coarse)");
	const [open, setOpen] = useState(false);
	const fullImageUrl = getTmdbImageUrl(imagePath, "original");

	function FullImage({ className }: { className: string }) {
		return fullImageUrl ? (
			<img src={fullImageUrl} alt={alt} className={className} />
		) : null;
	}

	return (
		<>
			<div className="relative">
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={alt}
						className="w-44 md:w-52 lg:w-56 xl:w-64 2xl:w-80 aspect-2/3 rounded-lg shadow-lg flex items-center justify-center ring-accent ring-1 cursor-zoom-in"
						onClick={() => setOpen(true)}
					/>
				) : null}
			</div>

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
