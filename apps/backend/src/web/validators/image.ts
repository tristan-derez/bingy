import { fileTypeFromBuffer } from "file-type";

const MAX_SIZE = 5 * 1024 * 1024;

export async function validateImage(file: unknown): Promise<Buffer> {
	if (!(file instanceof File)) {
		throw new Error("INVALID_FILE");
	}

	if (file.size > MAX_SIZE) {
		throw new Error("FILE_TOO_LARGE");
	}

	const buffer = Buffer.from(await file.arrayBuffer());

	const type = await fileTypeFromBuffer(buffer);

	if (!type || !type.mime.startsWith("image/")) {
		throw new Error("INVALID_IMG_FILE");
	}

	return buffer;
}
