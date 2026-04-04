type Crop = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type ImageFormat = "image/jpeg" | "image/png" | "image/webp";

type CropOptions = {
	format?: ImageFormat;
	quality?: number;
};

/**
 * Creates an HTMLImageElement from a URL.
 * @param url - The image URL to load
 * @returns A promise that resolves with the loaded image element
 */
export function createImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) =>
			reject(new Error(`Failed to load image from ${url}: ${error}`)),
		);
		image.src = url;
	});
}

/**
 * Validates crop parameters against image dimensions.
 */
function validateCrop(
	crop: Crop,
	imageWidth: number,
	imageHeight: number,
): void {
	if (crop.width <= 0 || crop.height <= 0) {
		throw new Error("Crop width and height must be positive");
	}

	if (crop.x < 0 || crop.y < 0) {
		throw new Error("Crop coordinates cannot be negative");
	}

	if (crop.x + crop.width > imageWidth) {
		throw new Error(
			`Crop exceeds image width (${crop.x + crop.width} > ${imageWidth})`,
		);
	}

	if (crop.y + crop.height > imageHeight) {
		throw new Error(
			`Crop exceeds image height (${crop.y + crop.height} > ${imageHeight})`,
		);
	}
}

/**
 * Crops an image from a given source based on the specified area.
 * @param imageSrc - The source URL of the image to crop
 * @param crop - The crop area with x, y, width, and height coordinates
 * @param options - Optional format and quality settings
 * @returns A promise that resolves with the cropped image as a Blob
 */
export async function getCroppedImg(
	imageSrc: string,
	crop: Crop,
	options: CropOptions = {},
): Promise<Blob> {
	const { format = "image/jpeg", quality = 0.95 } = options;

	const image = await createImage(imageSrc);

	validateCrop(crop, image.naturalWidth, image.naturalHeight);

	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("Failed to get 2D canvas context");
	}

	canvas.width = crop.width;
	canvas.height = crop.height;

	ctx.drawImage(
		image,
		crop.x,
		crop.y,
		crop.width,
		crop.height,
		0,
		0,
		crop.width,
		crop.height,
	);

	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) {
					resolve(blob);
				} else {
					reject(new Error("Failed to generate cropped image blob"));
				}
			},
			format,
			quality,
		);
	});
}
