import type { ReactElement } from "react";
import { Resend } from "resend";
import env from "../lib/env";
import { logger } from "../lib/logger";
import DeleteAccountEmail from "./delete-account";
import DeletedAccountEmail from "./deleted-account";
import ResetPasswordEmail from "./reset-password";
import UpdateEmailEmail from "./update-email";
import VerificationEmail from "./verification-email";

const resend = new Resend(env.RESEND_API_KEY);

type EmailType =
	| {
			type: "verification-email";
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
			type: "delete-account";
			subject?: string;
			expirationMinutes: number;
			url: string;
	  }
	| {
			type: "deleted-account";
			subject?: string;
			date: string;
	  }
	| {
			type: "update-email";
			subject?: string;
			expirationMinutes: number;
			url: string;
			newEmail: string;
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
	newEmail?: string,
): ReactElement => {
	const logoUrl =
		env.NODE_ENV === "production"
			? `${env.API_URL}/assets/icons/bingy-icon_text.png`
			: `${env.BUCKET_URL}/bingy-icon_text.png`;
	switch (type) {
		case "verification-email":
			return (
				<VerificationEmail
					url={url ?? ""}
					expirationMinutes={expirationMinutes ?? 0}
					userName={userName}
					logoUrl={logoUrl}
				/>
			);
		case "reset-password":
			return (
				<ResetPasswordEmail
					url={url ?? ""}
					expirationMinutes={expirationMinutes ?? 0}
					userName={userName}
					logoUrl={logoUrl}
				/>
			);
		case "delete-account":
			return (
				<DeleteAccountEmail
					url={url ?? ""}
					expirationMinutes={expirationMinutes ?? 0}
					userName={userName}
					logoUrl={logoUrl}
				/>
			);
		case "deleted-account":
			return (
				<DeletedAccountEmail
					deletionDate={date ?? ""}
					userName={userName}
					logoUrl={logoUrl}
				/>
			);
		case "update-email":
			return (
				<UpdateEmailEmail
					url={url ?? ""}
					expirationMinutes={expirationMinutes ?? 0}
					userName={userName}
					newEmail={newEmail ?? ""}
					logoUrl={logoUrl}
				/>
			);
	}
};

const getDefaultSubject = (type: EmailType["type"]): string => {
	switch (type) {
		case "verification-email":
			return "Verify your email";
		case "reset-password":
			return "Reset your password";
		case "delete-account":
			return "Confirm the deletion of your account";
		case "deleted-account":
			return "Your account has been deleted";
		case "update-email":
			return "Confirm email change";
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
		logger.info(
			{
				type,
				hasUrl: !!url,
				hasUserName: !!userName,
				to,
				from: `${fromName} <${fromEmail}>`,
				subject,
			},
			"About to send email",
		);

		logger.info("Email component created successfully");

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
