import type { Schemas } from "shared";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { LoaderFive } from "@/components/ui/loader";
import { useMovieResource } from "@/hooks/useMovies";
import { useTvResources } from "@/hooks/useTv";
import { m } from "@/paraglide/messages";
import { getTmdbImageUrl } from "@/utils/utils";
import { BackdropImagesEmptyState } from "./banner-images-empty-state";

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

	const handleImageSelect = (filePath: string | null) => {
		if (!filePath) return;
		onSelectImage(filePath);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="w-full max-w-sm md:max-w-md lg:max-w-lg overflow-hidden max-h-[80vh] z-150">
				<DialogHeader>
					<DialogTitle>{m.banner_image_select_title()}</DialogTitle>
				</DialogHeader>

				<div className="mt-4 overflow-y-auto max-h-[60vh]">
					{isLoading ? (
						<div className="flex justify-center py-8">
							<LoaderFive text={m.banner_image_select_loading()} />
						</div>
					) : null}

					{!isLoading && !hasBackdrops ? <BackdropImagesEmptyState /> : null}

					{!isLoading && hasBackdrops ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-1">
							{backdrops.map((image) =>
								image.file_path ? (
									<button
										key={image.file_path}
										type="button"
										onClick={() => handleImageSelect(image.file_path)}
										className="relative aspect-video overflow-hidden rounded-lg border border-border hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
									>
										<img
											src={
												getTmdbImageUrl(image.file_path, "w500") ?? undefined
											}
											alt="Backdrop"
											className="w-full h-full object-cover"
											loading="lazy"
										/>
									</button>
								) : null,
							)}
						</div>
					) : null}
				</div>
			</DialogContent>
		</Dialog>
	);
}
