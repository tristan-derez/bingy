import { randomInt } from "node:crypto";

interface OTPData {
	code: string;
	expiresAt: Date;
	expirationMinutes: number;
}

export const generateOtpWithExpiration = (): OTPData => {
	const otpNumber = randomInt(0, 1_000_000);
	const expirationMs = 10 * 60 * 1000; // 10 minutes
	const expirationMinutes = expirationMs / (60 * 1000);
	const expiresAt = new Date(Date.now() + expirationMs);

	return {
		code: otpNumber.toString().padStart(6, "0"),
		expiresAt,
		expirationMinutes,
	};
};
