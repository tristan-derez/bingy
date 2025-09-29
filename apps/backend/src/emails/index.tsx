import type { ReactElement } from "react";
import { Resend } from "resend";
import env from "../lib/env";
import { logger } from "../lib/logger";
import AccountDeletedEmail from "./account-deleted";
import DeleteAccountEmail from "./delete-account";
import OTPEmail from "./otp-verification";
import ResetPasswordEmail from "./reset-password";

const resend = new Resend(env.RESEND_API_KEY);

type EmailType =
	| {
			type: "otp";
			subject?: string;
			expirationMinutes: number;
			url: string;
	  }
	| {
			type: "reset-password";
			subject?: string;
			expirationMinutes: number;
			url: string;
	  }
	| {
			type: "account-deletion";
			subject?: string;
			expirationMinutes: number;
			url: string;
	  }
	| {
			type: "account-deleted";
			subject?: string;
			date: string;
	  };

interface BaseEmailParams {
	to: string;
	fromEmail: string;
	fromName: string;
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
	userName: string,
	url?: string,
	expirationMinutes?: number,
	date?: string,
): ReactElement => {
	switch (type) {
		case "otp":
			return (
				<OTPEmail
					url={url ?? ""}
					expirationMinutes={expirationMinutes ?? 0}
					userName={userName}
				/>
			);
		case "reset-password":
			return (
				<ResetPasswordEmail
					url={url ?? ""}
					expirationMinutes={expirationMinutes ?? 0}
					userName={userName}
				/>
			);
		case "account-deletion":
			return (
				<DeleteAccountEmail
					url={url ?? ""}
					expirationMinutes={expirationMinutes ?? 0}
					userName={userName}
				/>
			);
		case "account-deleted":
			return (
				<AccountDeletedEmail userName={userName} deletionDate={date ?? ""} />
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
		case "account-deleted":
			return "Your account has been deleted";
	}
};

export const sendEmail = async (
	params: SendEmailParams,
): Promise<EmailResponse> => {
	const { to, fromEmail, fromName, userName, type } = params;
	const url = "url" in params ? params.url : undefined;
	const expirationMinutes =
		"expirationMinutes" in params ? params.expirationMinutes : undefined;
	const date = "date" in params ? params.date : undefined;
	const subject = params.subject ?? getDefaultSubject(type);

	try {
		const { data, error } = await resend.emails.send({
			from: `${fromName} <${fromEmail}>`,
			to: [to],
			subject,
			react: getEmailComponent(type, userName, url, expirationMinutes, date),
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
