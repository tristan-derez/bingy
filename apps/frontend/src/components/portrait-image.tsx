import {
	IconCameraOff,
	IconDeviceTv,
	IconMovie,
	IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerBody, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "@/integrations/media-query";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { getTmdbImageUrl, type ImageSize } from "@/utils/utils";

type PortraitImageCategory = "movie" | "tv" | "person";

interface PortraitImageProps {
	imagePath: string | null;
	alt: string;
	category?: PortraitImageCategory;
	imageSize?: ImageSize;
	className?: string;
}

const DEFAULT_SIZE_CLASSES = "w-62.5 md:w-60 2xl:w-75 aspect-2/3";

const CATEGORY_ICONS: Record<PortraitImageCategory, typeof IconMovie> = {
	movie: IconMovie,
	tv: IconDeviceTv,
	person: IconUser,
};

function PortraitImageEmptyState({
	category,
}: {
	category?: PortraitImageCategory;
}) {
	const Icon = category ? CATEGORY_ICONS[category] : IconCameraOff;

	return (
		<div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
			<Icon className="size-6 w-1/4 h-1/4 text-muted-foreground" />
			<span className="text-sm">{m.image_empty_state_message()}</span>
		</div>
	);
}

export function PortraitImage({
	imagePath,
	alt,
	category,
	imageSize = "original",
	className,
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
				<div className={containerClasses}>
					<PortraitImageEmptyState category={category} />
				</div>
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
