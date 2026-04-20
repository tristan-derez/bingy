import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { CropImageDialog } from "@/components/auth/crop-image-dialog";
import { ProfilePicture } from "@/components/profile/profile-picture";
import { toast } from "@/components/toast/toast";
import { useDeleteAvatar, useUpdateAvatar } from "@/hooks/useUserProfile";
import { m } from "@/paraglide/messages";

interface EditProfilePictureProps {
	avatar?: string | null;
	displayName: string;
}

export function EditProfilePicture({
	avatar,
	displayName,
}: EditProfilePictureProps) {
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [cropSrc, setCropSrc] = useState<string | null>(null);
	const updateAvatar = useUpdateAvatar();
	const deleteAvatar = useDeleteAvatar();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			setCropSrc(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleDeleteAvatar = () => {
		deleteAvatar.mutate(undefined, {
			onSuccess: () => {
				navigate({
					to: "/@{$username}",
					params: { username: displayName.toLowerCase() },
				});
			},
		});
	};

	const handleCropComplete = async (croppedBlob: Blob) => {
		const file = new File([croppedBlob], "avatar.webp", { type: "image/webp" });

		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result as string);
		};
		reader.readAsDataURL(croppedBlob);

		setCropSrc(null);

		await updateAvatar.mutateAsync(file, {
			onSuccess: () => {
				navigate({
					to: "/@{$username}",
					params: { username: displayName.toLowerCase() },
				});
			},
			onError: () => {
				setPreview(null);
				toast.error({ title: m.toast_edit_profile_picture_error() });
			},
		});
	};

	const displayAvatar = preview ?? avatar ?? "";

	return (
		<>
			<div className="flex items-center gap-2">
				<div className="relative w-16 h-16">
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleFileChange}
					/>
					<ProfilePicture avatar={displayAvatar} displayName={displayName} />
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-80 hover:opacity-100 text-muted-foreground hover:text-white transition-opacity"
					>
						<IconPencil className="w-5 h-5" />
					</button>
				</div>
				{!avatar?.startsWith("https://api.dicebear.com") ? (
					<button
						type="button"
						onClick={handleDeleteAvatar}
						disabled={deleteAvatar.isPending}
						className="text-muted-foreground hover:text-destructive transition-colors"
					>
						<IconTrash className="w-5 h-5" />
					</button>
				) : null}
			</div>

			{cropSrc ? (
				<CropImageDialog
					imageSrc={cropSrc}
					onCropComplete={handleCropComplete}
					onCancel={() => setCropSrc(null)}
				/>
			) : null}
		</>
	);
}
