import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import type { Schemas } from "shared";
import backgroundPlaceholder from "@/assets/media-backdrop-placeholder.jpg";
import { BannerImageSelectDialog } from "@/components/auth/banner-image-select-dialog";
import { SearchDialog } from "@/components/search/search-dialog";
import { useDeleteBanner, useUpdateBanner } from "@/hooks/useUserProfile";
import { getTmdbImageUrl } from "@/utils/utils";

interface EditProfileBannerProps {
	bannerUrl?: string | null;
}

export function EditProfileBanner({ bannerUrl }: EditProfileBannerProps) {
	const deleteBanner = useDeleteBanner();
	const updateBanner = useUpdateBanner();
	const backgroundImage = getTmdbImageUrl(bannerUrl ?? null);

	const [searchDialogOpen, setSearchDialogOpen] = useState(false);
	const [imageSelectDialogOpen, setImageSelectDialogOpen] = useState(false);

	const [selectedMedia, setSelectedMedia] = useState<{
		id: number;
		mediaType: "movie" | "tv";
	} | null>(null);

	const handleDeleteBanner = () => {
		deleteBanner.mutate();
	};

	const handleEditClick = () => {
		setSearchDialogOpen(true);
	};

	const handleSelectMedia = (media: Schemas.MediaMulti) => {
		if (media.media_type === "person") {
			return;
		}

		const mediaItem = media as Schemas.Media;
		setSelectedMedia({
			id: mediaItem.id,
			mediaType: mediaItem.media_type,
		});

		setSearchDialogOpen(false);
		setImageSelectDialogOpen(true);
	};

	const handleSelectImage = (filePath: string) => {
		updateBanner.mutate({ bannerUrl: filePath });
	};

	const hasCustomBanner = !!bannerUrl;

	return (
		<>
			<div className="relative w-full h-32 rounded-lg overflow-hidden group">
				<div
					className="absolute inset-0 bg-cover bg-center transition-all"
					style={{
						backgroundImage: `url(${backgroundImage ?? backgroundPlaceholder})`,
					}}
				/>

				<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
					<button
						type="button"
						className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors disabled:opacity-50"
						onClick={handleEditClick}
						disabled={updateBanner.isPending}
					>
						<IconPencil className="w-4 h-4" />
					</button>

					{hasCustomBanner ? (
						<button
							type="button"
							onClick={handleDeleteBanner}
							disabled={deleteBanner.isPending}
							className="p-2 rounded-full bg-black/60 text-white hover:bg-destructive/80 transition-colors disabled:opacity-50"
						>
							<IconTrash className="w-4 h-4" />
						</button>
					) : null}
				</div>
			</div>

			<SearchDialog
				open={searchDialogOpen}
				onOpenChange={setSearchDialogOpen}
				onSelectMedia={handleSelectMedia}
			/>

			<BannerImageSelectDialog
				open={imageSelectDialogOpen}
				onOpenChange={setImageSelectDialogOpen}
				mediaId={selectedMedia?.id ?? null}
				mediaType={selectedMedia?.mediaType ?? null}
				onSelectImage={handleSelectImage}
			/>
		</>
	);
}
