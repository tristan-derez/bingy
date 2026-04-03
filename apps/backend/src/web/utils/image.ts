import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import env from "../../lib/env";
import { logger } from "../../lib/logger";
import { s3 } from "../../lib/s3-client";

/**
 * Uploads a buffer to R2 and returns the public URL.
 * @param buffer - The image data
 * @param key - The destination path in the bucket eg: "avatar/userid-timestamp"
 * @returns The full public URL of the uploaded image
 */
export async function uploadImage(
	buffer: Buffer,
	key: string,
): Promise<string> {
	const bucket = env.R2_BUCKET_NAME;

	try {
		await s3.send(
			new PutObjectCommand({
				Bucket: bucket,
				Key: key,
				Body: buffer,
				ContentType: "image/webp",
			}),
		);

		return `${env.R2_PUBLIC_URL}/${key}`;
	} catch (err) {
		logger.error({ err, key, bucket }, "Failed to upload image to bucket");

		throw new Error("Upload failed");
	}
}

/**
 * Delete an image from R2
 * @param url - The full image url from db
 * @returns void
 */
export async function deleteImageByUrl(url: string | null): Promise<void> {
	if (!url) return;

	const baseUrl = env.R2_PUBLIC_URL;

	// Only attempt deletion if the URL belongs to our bucket
	if (!url.startsWith(baseUrl)) return;

	// Extract the key: "https://url.com/avatars/1.webp" -> "avatars/1.webp"
	const key = url.replace(`${baseUrl}/`, "");

	try {
		await s3.send(
			new DeleteObjectCommand({
				Bucket: env.R2_BUCKET_NAME,
				Key: key,
			}),
		);
	} catch (err) {
		logger.error({ err, key }, "Failed to delete old avatar from bucket");
	}
}
