import { Resend } from "resend";
import env from "../lib/env";
import { logger } from "../lib/logger";
import OTPEmail from "./otp-verification";
import ResetPasswordEmail from "./reset-password";

const resend = new Resend(env.RESEND_API_KEY);

export interface SendOTPEmailParams {
	to: string;
	url: string;
	fromEmail: string;
	fromName: string;
	subject?: string;
	expirationMinutes: number;
	userName: string;
}

export interface SendResetPasswordEmailParams {
	to: string;
	url: string;
	fromEmail: string;
	fromName: string;
	subject?: string;
	expirationMinutes: number;
	userName: string;
}

export interface EmailResponse {
	success: boolean;
	id?: string;
	error?: string;
}

export const sendOTPEmail = async ({
	to,
	url,
	fromEmail,
	fromName,
	subject = "Verify your email",
	expirationMinutes,
	userName,
}: SendOTPEmailParams): Promise<EmailResponse> => {
	try {
		const { data, error } = await resend.emails.send({
			from: `${fromName} <${fromEmail}>`,
			to: [to],
			subject: subject,
			react: (
				<OTPEmail
					url={url}
					expirationMinutes={expirationMinutes}
					userName={userName}
				/>
			),
		});

		if (error) {
			logger.error({ error }, "Resend API error");
			return {
				success: false,
				error: error.message || "Failed to send email",
			};
		}

		return {
			success: true,
			id: data?.id,
		};
	} catch (error) {
		console.log(error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};

export const sendResetPasswordEmail = async ({
	to,
	url,
	fromEmail,
	fromName,
	subject = "Reset your password",
	expirationMinutes,
	userName,
}: SendResetPasswordEmailParams): Promise<EmailResponse> => {
	try {
		const { data, error } = await resend.emails.send({
			from: `${fromName} <${fromEmail}>`,
			to: [to],
			subject: subject,
			react: (
				<ResetPasswordEmail
					url={url}
					expirationMinutes={expirationMinutes}
					userName={userName}
				/>
			),
		});

		if (error) {
			logger.error({ error }, "Resend API error");
			return {
				success: false,
				error: error.message || "Failed to send email",
			};
		}

		return {
			success: true,
			id: data?.id,
		};
	} catch (error) {
		console.log(error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
