import { useAtomValue } from "jotai";
import { useState } from "react";
import type { Schemas } from "shared";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerBody, DrawerContent } from "@/components/ui/drawer";
import { WatchProvidersSection } from "@/components/watch-providers/watch-providers-section";
import { useMediaQuery } from "@/integrations/media-query";
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
						className="aspect-2/3 w-44 h-65 md:w-52 md:h-80 xl:w-80 xl:h-120 rounded-lg shadow-lg flex items-center justify-center ring-accent ring-1 cursor-pointer"
						onClick={() => setOpen(true)}
					/>
				) : null}

				{watchProviders ? (
					<WatchProvidersSection
						watchProviders={watchProviders}
						region={region}
						className="absolute bottom-0 w-full items-center justify-center rounded-b-lg border-none bg-linear-to-t from-black via-black/60 to-transparent p-4 py-0 pt-50"
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
