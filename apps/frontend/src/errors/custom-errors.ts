export class AppError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class NetworkError extends AppError {
	constructor(
		message = "Network request failed. Please check your connection.",
	) {
		super(message);
	}
}
