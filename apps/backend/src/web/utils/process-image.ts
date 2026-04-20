import sharp from "sharp";

// Single core
sharp.concurrency(1);

export async function processImage(
	buffer: Buffer,
	timeoutMs = 2000,
): Promise<Buffer> {
	const timeout = new Promise<never>((_, reject) =>
		setTimeout(() => reject(new Error("Image processing timeout")), timeoutMs),
	);

	const processing = sharp(buffer)
		.resize(500, 500, { fit: "cover" })
		.webp({ quality: 80 })
		.toBuffer();

	return await Promise.race([processing, timeout]);
}
