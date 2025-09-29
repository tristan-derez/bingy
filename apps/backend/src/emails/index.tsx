import type { ReactElement } from "react";
import { Resend } from "resend";
import env from "../lib/env";
import { logger } from "../lib/logger";
import DeleteAccountEmail from "./delete-account";
import OTPEmail from "./otp-verification";
import ResetPasswordEmail from "./reset-password";

const resend = new Resend(env.RESEND_API_KEY);

type EmailType =
	| {
			type: "otp";
			subject?: string;
	  }
	| {
			type: "reset-password";
			subject?: string;
	  }
	| {
			type: "account-deletion";
			subject?: string;
	  };

interface BaseEmailParams {
	to: string;
	url: string;
	fromEmail: string;
	fromName: string;
	expirationMinutes?: number;
	userName: string;
}

export type SendEmailParams = BaseEmailParams & EmailType;

export interface EmailResponse {
	success: boolean;
	id?: string;
	error?: string;
}

const getEmailComponent = (
	type: EmailType["type"],
	url: string,
	expirationMinutes: number,
	userName: string,
): ReactElement => {
	switch (type) {
		case "otp":
			return (
				<OTPEmail
					url={url}
					expirationMinutes={expirationMinutes}
					userName={userName}
				/>
			);
		case "reset-password":
			return (
				<ResetPasswordEmail
					url={url}
					expirationMinutes={expirationMinutes}
					userName={userName}
				/>
			);
		case "account-deletion":
			return (
				<DeleteAccountEmail
					url={url}
					expirationMinutes={expirationMinutes}
					userName={userName}
				/>
			);
	}
};

const getDefaultSubject = (type: EmailType["type"]): string => {
	switch (type) {
		case "otp":
			return "Verify your email";
		case "reset-password":
			return "Reset your password";
		case "account-deletion":
			return "Confirm the deletion of your account";
	}
};

export const sendEmail = async (
	params: SendEmailParams,
): Promise<EmailResponse> => {
	const { to, fromEmail, fromName, url, expirationMinutes, userName, type } =
		params;
	const subject = params.subject ?? getDefaultSubject(type);

	try {
		const { data, error } = await resend.emails.send({
			from: `${fromName} <${fromEmail}>`,
			to: [to],
			subject,
			react: getEmailComponent(type, url, expirationMinutes ?? 0, userName),
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
		logger.error({ error }, "Failed to send email");
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
