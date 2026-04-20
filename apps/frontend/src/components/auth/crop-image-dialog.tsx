import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { toast } from "@/components/toast/toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { m } from "@/paraglide/messages";
import { getCroppedImg, type ImageFormat } from "@/utils/image";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

interface CropImageDialogProps {
	imageSrc: string;
	onCropComplete: (croppedImage: Blob) => void;
	onCancel: () => void;
	format?: ImageFormat;
	quality?: number;
}

export function CropImageDialog({
	imageSrc,
	onCropComplete,
	onCancel,
	format = "image/webp",
	quality = 0.85,
}: CropImageDialogProps) {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

	const onCropChange = useCallback((crop: { x: number; y: number }) => {
		setCrop(crop);
	}, []);

	const onCropAreaChange = useCallback((_: Area, croppedAreaPixels: Area) => {
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	const handleSave = async () => {
		if (!croppedAreaPixels) return;

		try {
			const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, {
				format,
				quality,
			});

			onCropComplete(croppedImage);
		} catch (error) {
			toast.error({ title: m.toast_error_crop_image() });
		}
	};

	return (
		<Dialog open={true} onOpenChange={onCancel}>
			<DialogContent
				className="max-w-[95vw] md:max-w-lg lg:max-w-xl max-h-[90dvh] z-80"
				showCloseButton={false}
			>
				<div className="relative h-80 sm:h-96">
					<Cropper
						image={imageSrc}
						crop={crop}
						zoom={zoom}
						aspect={1}
						cropShape="round"
						showGrid={true}
						onCropChange={onCropChange}
						onCropComplete={onCropAreaChange}
						onZoomChange={setZoom}
					/>
				</div>
				<div className="flex flex-col gap-2 px-4 pb-4">
					<Label className="text-sm">{m.edit_image_zoom_label()}</Label>
					<Slider
						min={1}
						max={3}
						step={0.1}
						value={zoom}
						onValueChange={(value) => setZoom(value as number)}
						className="w-full"
					/>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onCancel}>
						{m.btn_cancel()}
					</Button>
					<Button onClick={handleSave}>{m.btn_save()}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
