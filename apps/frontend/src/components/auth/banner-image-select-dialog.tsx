import { useCallback, useEffect, useRef, useState } from "react";
import type { Schemas } from "shared";
import { BackdropImagesEmptyState } from "@/components/auth/banner-images-empty-state";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { LoaderFive } from "@/components/ui/loader";
import { useMovieResource } from "@/hooks/useMovies";
import { useTvResources } from "@/hooks/useTv";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { getTmdbImageUrl } from "@/utils/utils";

interface BannerImageSelectDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mediaId: number | null;
	mediaType: "movie" | "tv" | null;
	onSelectImage: (filePath: string) => void;
}

export function BannerImageSelectDialog({
	open,
	onOpenChange,
	mediaId,
	mediaType,
	onSelectImage,
}: BannerImageSelectDialogProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

	const { data: movieImages, isLoading: isLoadingMovie } =
		useMovieResource<Schemas.MovieImages>(
			mediaId ?? 0,
			"images",
			{},
			{ enabled: open && mediaType === "movie" && mediaId !== null },
		);

	const { data: tvImages, isLoading: isLoadingTv } =
		useTvResources<Schemas.TvImages>(
			mediaId ?? 0,
			"images",
			{},
			{ enabled: open && mediaType === "tv" && mediaId !== null },
		);

	const images = mediaType === "movie" ? movieImages : tvImages;
	const backdrops = images?.backdrops;

	const hasBackdrops = Array.isArray(backdrops) && backdrops.length > 0;

	const isLoading = isLoadingMovie || isLoadingTv;

	// Reset selected index when dialog opens or images change
	useEffect(() => {
		setSelectedIndex(0);
	}, [open, backdrops]);

	// Scroll selected item into view
	useEffect(() => {
		const selectedElement = itemRefs.current[selectedIndex];
		if (selectedElement) {
			selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
		}
	}, [selectedIndex]);

	const handleImageSelect = useCallback(
		(filePath: string | null) => {
			if (!filePath) return;
			onSelectImage(filePath);
			onOpenChange(false);
		},
		[onSelectImage, onOpenChange],
	);

	// Filter out items without file_path for keyboard navigation
	const validBackdrops =
		backdrops?.filter((image): image is typeof image & { file_path: string } =>
			Boolean(image.file_path),
		) ?? [];

	// Grid navigation: 2 columns on md+ screens
	const COLS = 2;

	// Keyboard navigation handler
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (validBackdrops.length === 0) return;

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setSelectedIndex((prev) => {
						const next = prev + COLS;
						return next < validBackdrops.length ? next : prev;
					});
					break;
				case "ArrowUp":
					e.preventDefault();
					setSelectedIndex((prev) => {
						const next = prev - COLS;
						return next >= 0 ? next : prev;
					});
					break;
				case "ArrowRight":
					e.preventDefault();
					setSelectedIndex((prev) => {
						// Don't wrap to next row, only move right within same row
						const currentRow = Math.floor(prev / COLS);
						const next = prev + 1;
						const nextRow = Math.floor(next / COLS);
						return nextRow === currentRow && next < validBackdrops.length
							? next
							: prev;
					});
					break;
				case "ArrowLeft":
					e.preventDefault();
					setSelectedIndex((prev) => {
						// Don't wrap to previous row, only move left within same row
						const currentRow = Math.floor(prev / COLS);
						const next = prev - 1;
						const nextRow = Math.floor(next / COLS);
						return nextRow === currentRow && next >= 0 ? next : prev;
					});
					break;
				case "Enter":
					e.preventDefault();
					handleImageSelect(validBackdrops[selectedIndex]?.file_path ?? null);
					break;
			}
		},
		[validBackdrops, selectedIndex, handleImageSelect],
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="w-full max-w-sm md:max-w-md lg:max-w-lg overflow-hidden max-h-[80vh] z-150"
				onKeyDown={handleKeyDown}
			>
				<DialogHeader>
					<DialogTitle>{m.banner_image_select_title()}</DialogTitle>
				</DialogHeader>

				<div className="mt-4 overflow-y-auto max-h-[60vh] no-scrollbar">
					{isLoading ? (
						<div className="flex justify-center py-8">
							<LoaderFive text={m.banner_image_select_loading()} />
						</div>
					) : null}

					{!isLoading && !hasBackdrops ? <BackdropImagesEmptyState /> : null}

					{!isLoading && hasBackdrops ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-1">
							{validBackdrops.map((image, index) => (
								<button
									key={image.file_path}
									ref={(el) => {
										itemRefs.current[index] = el;
									}}
									type="button"
									onClick={() => handleImageSelect(image.file_path)}
									className={cn(
										"relative aspect-video overflow-hidden rounded-lg border-2 transition-all opacity-80 focus:outline-none select-none",
										index === selectedIndex
											? "border-primary ring-1 ring-primary ring-inset opacity-100"
											: "border-transparent hover:opacity-100 hover:ring-1 hover:ring-primary/30 hover:ring-inset",
									)}
								>
									<img
										src={getTmdbImageUrl(image.file_path, "w500") ?? undefined}
										alt="Backdrop"
										className="w-full h-full object-cover"
										loading="lazy"
									/>
								</button>
							))}
						</div>
					) : null}
				</div>
			</DialogContent>
		</Dialog>
	);
}
