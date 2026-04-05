import { IconPencil } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateAvatar } from "@/hooks/useUserProfile";
import { m } from "@/paraglide/messages";
import { toast } from "../toast/toast";
import { CropImageDialog } from "./crop-image-dialog";

interface EditProfilePictureProps {
	avatar?: string | null;
	displayName: string;
}

export function EditProfilePicture({
	avatar,
	displayName,
}: EditProfilePictureProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [cropSrc, setCropSrc] = useState<string | null>(null);
	const updateAvatar = useUpdateAvatar();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			setCropSrc(reader.result as string);
		};
		reader.readAsDataURL(file);
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
				toast.success({ title: m.toast_edit_profile_picture_success() });
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
			<div className="relative w-16 h-16">
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleFileChange}
				/>
				<Avatar
					className="w-16 h-16 object-cover rounded-full"
					onClick={() => fileInputRef.current?.click()}
				>
					<AvatarImage src={displayAvatar} alt={displayName} />
					<AvatarFallback className="rounded-full">
						{displayName[0].toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-80 hover:opacity-100 text-muted-foreground hover:text-white transition-opacity"
				>
					<IconPencil className="w-5 h-5" />
				</button>
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
